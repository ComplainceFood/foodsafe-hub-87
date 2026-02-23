import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types/document';
import { addDays, format, parse, isAfter, isBefore, addMonths } from 'date-fns';
import { adaptDocumentToDatabase } from '@/utils/documentTypeAdapter';

export const getExpiringDocuments = async (daysThreshold: number = 30): Promise<Document[]> => {
  try {
    const today = new Date();
    const thresholdDate = addDays(today, daysThreshold);
    
    // Format dates for Supabase query
    const formattedToday = format(today, 'yyyy-MM-dd');
    const formattedThreshold = format(thresholdDate, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .gte('expiry_date', formattedToday)
      .lte('expiry_date', formattedThreshold)
      .not('status', 'eq', 'Archived')
      .order('expiry_date', { ascending: true });

    if (error) {
      console.error('Error fetching expiring documents:', error);
      throw error;
    }

    // Cast data to Document[] - this usage is safe because we're controlling the type
    return data as unknown as Document[];
  } catch (error) {
    console.error('Error in getExpiringDocuments:', error);
    throw error;
  }
};

export const getExpiredDocuments = async (): Promise<Document[]> => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .lt('expiry_date', today)
      .not('status', 'eq', 'Archived')
      .order('expiry_date', { ascending: false });

    if (error) {
      console.error('Error fetching expired documents:', error);
      throw error;
    }

    // Cast data to Document[] - this usage is safe because we're controlling the type
    return data as unknown as Document[];
  } catch (error) {
    console.error('Error in getExpiredDocuments:', error);
    throw error;
  }
};

export const scheduleReviewNotifications = async (document: Document): Promise<void> => {
  try {
    if (!document.next_review_date) {
      console.warn(`Document ${document.id} has no next_review_date. Skipping notification scheduling.`);
      return;
    }

    // Calculate notification dates (e.g., 30, 15, and 7 days before review)
    const nextReviewDate = parse(document.next_review_date, 'yyyy-MM-dd', new Date());
    const notificationDates = [30, 15, 7].map(days => addDays(nextReviewDate, -days));

    // Filter out dates that are in the past
    const validNotificationDates = notificationDates.filter(date => isAfter(date, new Date()));

    // Schedule notifications for each valid date
    for (const notificationDate of validNotificationDates) {
      const notificationTime = format(notificationDate, 'yyyy-MM-dd HH:mm:ss');
      console.log(`Scheduling notification for document ${document.id} on ${notificationTime}`);
      // In a real implementation, you would schedule a background task or use a service like Firebase Cloud Messaging
      // to send the notification at the specified time.
    }
  } catch (error) {
    console.error('Error scheduling review notifications:', error);
  }
};

export const updateExpiryDate = async (documentId: string, newExpiryDate: string): Promise<Document | null> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .update({ expiry_date: newExpiryDate })
      .eq('id', documentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating expiry date:', error);
      return null;
    }

    return data as unknown as Document;
  } catch (error) {
    console.error('Error in updateExpiryDate:', error);
    return null;
  }
};

export const autoArchiveExpiredDocuments = async (): Promise<void> => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');

    // Fetch documents that are expired and not already archived
    const { data: expiredDocuments, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .lt('expiry_date', today)
      .neq('status', 'Archived');

    if (fetchError) {
      console.error('Error fetching expired documents for archiving:', fetchError);
      return;
    }

    if (!expiredDocuments || expiredDocuments.length === 0) {
      console.log('No documents to auto-archive.');
      return;
    }

    // Update the status of each expired document to "Archived"
    for (const document of expiredDocuments) {
      const dbDocument = adaptDocumentToDatabase({
        ...document,
        status: 'Archived',
        updated_at: new Date().toISOString()
      } as Document);

      const { error: updateError } = await supabase
        .from('documents')
        .update(dbDocument)
        .eq('id', document.id);

      if (updateError) {
        console.error(`Error updating document ${document.id} status to Archived:`, updateError);
      } else {
        console.log(`Document ${document.id} auto-archived successfully.`);
      }
    }
  } catch (error) {
    console.error('Error in autoArchiveExpiredDocuments:', error);
  }
};

export default {
  getExpiringDocuments,
  getExpiredDocuments,
  scheduleReviewNotifications,
  updateExpiryDate,
  autoArchiveExpiredDocuments
};

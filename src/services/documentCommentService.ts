
import { supabase } from '@/integrations/supabase/client';
import { DocumentComment } from '@/types/database';
import { v4 as uuidv4 } from 'uuid';

const documentCommentService = {
  // Document comments
  async getDocumentComments(documentId: string): Promise<DocumentComment[]> {
    try {
      // Check if 'document_comments' table exists first
      const { data, error } = await supabase
        .from('document_comments')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Return the data cast as DocumentComment[]
      return (data || []) as DocumentComment[];
    } catch (error) {
      console.error(`Error fetching comments for document ${documentId}:`, error);
      throw error;
    }
  },
  
  async createDocumentComment(comment: Partial<DocumentComment>): Promise<DocumentComment> {
    try {
      // Ensure the comment has all required fields according to the DocumentComment interface
      if (!comment.content) {
        throw new Error("Comment content is required");
      }

      if (!comment.document_id) {
        throw new Error("Document ID is required");
      }

      if (!comment.user_id) {
        throw new Error("User ID is required");
      }

      if (!comment.user_name) {
        throw new Error("User name is required");
      }

      const newComment = {
        id: comment.id || uuidv4(),
        document_id: comment.document_id,
        user_id: comment.user_id,
        user_name: comment.user_name,
        content: comment.content,
        created_at: comment.created_at || new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('document_comments')
        .insert(newComment)
        .select()
        .single();
      
      if (error) throw error;
      
      // Return the data cast as DocumentComment
      return data as DocumentComment;
    } catch (error) {
      console.error('Error creating document comment:', error);
      throw error;
    }
  },
  
  async updateDocumentComment(commentId: string, updates: Partial<DocumentComment>): Promise<DocumentComment> {
    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('document_comments')
        .update(updatedData)
        .eq('id', commentId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Return the data cast as DocumentComment
      return data as DocumentComment;
    } catch (error) {
      console.error(`Error updating comment ${commentId}:`, error);
      throw error;
    }
  },
  
  async deleteDocumentComment(commentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('document_comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  }
};

export default documentCommentService;

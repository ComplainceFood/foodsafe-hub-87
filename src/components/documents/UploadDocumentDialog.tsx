
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DocumentUploader from './DocumentUploader';
import { useDocuments } from '@/contexts/DocumentContext';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: string;
  allowedTypes?: string[];
  maxSize?: number;
  selectedFolder?: string | null;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onOpenChange,
  category,
  allowedTypes,
  maxSize,
  selectedFolder
}) => {
  const { selectedFolder: contextFolder, refreshData } = useDocuments();
  
  const handleUploadComplete = () => {
    onOpenChange(false);
    refreshData(); // Refresh document list after upload
  };

  // Use selectedFolder prop if provided, otherwise use the one from context
  const folderToUse = selectedFolder || (contextFolder?.id || null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to the document management system
            {contextFolder && ` in folder: ${contextFolder.name}`}
          </DialogDescription>
        </DialogHeader>
        
        <DocumentUploader
          onSuccess={handleUploadComplete}
          onCancel={() => onOpenChange(false)}
          category={category}
          allowedTypes={allowedTypes}
          maxSize={maxSize}
          selectedFolder={folderToUse}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;

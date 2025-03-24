
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentCategory, ModuleReference, DocumentStatus } from '@/types/document';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileUp, Upload, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useDocuments } from '@/contexts/DocumentContext';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory | ''>('');
  const [linkedModule, setLinkedModule] = useState<ModuleReference>('none');
  const [date, setDate] = useState<Date>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [applySameMetadata, setApplySameMetadata] = useState(true);
  const { toast } = useToast();
  const { addDocument, setSelectedDocument } = useDocuments();

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setLinkedModule('none');
    setDate(undefined);
    setSelectedFiles([]);
    setApplySameMetadata(true);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive"
      });
      return;
    }

    if (!category) {
      toast({
        title: "Missing information",
        description: "Please select a category for the document(s).",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new document with the "Draft" status (explicitly using DocumentStatus type)
    const newDocument = {
      id: `doc-${Math.random().toString(36).substring(2, 11)}`,
      title: title || selectedFiles[0].name,
      description: description,
      fileName: selectedFiles[0].name,
      fileSize: selectedFiles[0].size,
      fileType: selectedFiles[0].type,
      category: category,
      status: 'Draft' as DocumentStatus,
      version: 1,
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiryDate: date ? date.toISOString() : undefined,
      linkedModule: linkedModule,
      tags: [],
    };
    
    // Add the document to the context
    addDocument(newDocument);
    
    // Set this as the selected document for editing
    setSelectedDocument(newDocument);
    
    toast({
      title: "Document created",
      description: `New document "${newDocument.title}" has been created and is now ready for editing.`,
    });
    
    handleClose();
  };

  const getTotalFileSize = () => {
    return selectedFiles.reduce((total, file) => total + file.size, 0);
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / 1024 / 1024).toFixed(2)} MB`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
            <DialogDescription>
              Create a new document to add to the repository. Fill in the required details below.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file" className="text-right">
                  Document File
                </Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-md p-8 transition-colors cursor-pointer text-center",
                    isDragging ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="font-medium">Drag & drop your file here or click to browse</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Support for PDF, DOC, DOCX, XLS, XLSX, CSV, TXT, JPG, PNG
                    </p>
                    {selectedFiles.length > 0 && (
                      <Badge variant="secondary" className="mt-2">
                        File selected • {formatFileSize(getTotalFileSize())}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="grid gap-2 bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Selected File</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedFiles([])}
                    >
                      Clear
                    </Button>
                  </div>
                  
                  <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md border">
                        <div className="flex items-center">
                          <FileUp className="h-4 w-4 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium truncate max-w-[300px]">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="title">Document Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Enter document title"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={3} 
                  placeholder="Enter description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as DocumentCategory)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOP">SOP</SelectItem>
                      <SelectItem value="Policy">Policy</SelectItem>
                      <SelectItem value="Form">Form</SelectItem>
                      <SelectItem value="Certificate">Certificate</SelectItem>
                      <SelectItem value="Audit Report">Audit Report</SelectItem>
                      <SelectItem value="HACCP Plan">HACCP Plan</SelectItem>
                      <SelectItem value="Training Material">Training Material</SelectItem>
                      <SelectItem value="Supplier Documentation">Supplier Documentation</SelectItem>
                      <SelectItem value="Risk Assessment">Risk Assessment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="linkedModule">Link to Module</Label>
                  <Select value={linkedModule} onValueChange={(value) => setLinkedModule(value as ModuleReference)}>
                    <SelectTrigger id="linkedModule">
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="haccp">HACCP</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="audits">Audits</SelectItem>
                      <SelectItem value="suppliers">Suppliers</SelectItem>
                      <SelectItem value="capa">CAPA</SelectItem>
                      <SelectItem value="traceability">Traceability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select expiry date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={selectedFiles.length === 0 || !category}>
              Create Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;

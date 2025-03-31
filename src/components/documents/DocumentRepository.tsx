import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, CheckCircle, Copy, CopyCheck, File, FileText, Filter, FolderPlus, Loader2, MoreHorizontal, Plus, RefreshCw, Search, Trash2, Upload, UploadCloud, Eye, Download, Edit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDocumentService } from '@/hooks/useDocumentService';
import { Document, DocumentCategory, DocumentStatus, Folder } from '@/types/database';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import DocumentVersionHistory from './DocumentVersionHistory';
import DocumentComments from './DocumentComments';
import DocumentAccessControl from './DocumentAccessControl';
import DocumentUploader from './DocumentUploader';

const createPlaceholderComponent = (name: string) => {
  return () => <div>Placeholder for {name} component</div>;
};

const DocumentFilters = ({ 
  categoryFilter, statusFilter, dateRangeFilter, isLockedFilter, 
  onCategoryChange, onStatusChange, onDateRangeChange, onIsLockedChange,
  onResetFilters
}: { 
  categoryFilter: DocumentCategory | null;
  statusFilter: DocumentStatus | null;
  dateRangeFilter: DateRange | undefined;
  isLockedFilter: boolean | null;
  onCategoryChange: (category: DocumentCategory | null) => void;
  onStatusChange: (status: DocumentStatus | null) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onIsLockedChange: (isLocked: boolean | null) => void;
  onResetFilters: () => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {(categoryFilter || statusFilter || dateRangeFilter || isLockedFilter !== null) && (
            <Badge variant="secondary" className="ml-1 rounded-full">
              {[
                categoryFilter && "Category",
                statusFilter && "Status",
                dateRangeFilter && "Date",
                isLockedFilter !== null && "Locked"
              ].filter(Boolean).length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <h4 className="font-medium">Filter Documents</h4>
          
          <div className="space-y-2">
            <Label htmlFor="category-filter">Category</Label>
            <Select
              value={categoryFilter || ""}
              onValueChange={(value) => onCategoryChange(value ? value as DocumentCategory : null)}
            >
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
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
          
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select
              value={statusFilter || ""}
              onValueChange={(value) => onStatusChange(value ? value as DocumentStatus : null)}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRangeFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRangeFilter?.from ? (
                    dateRangeFilter.to ? (
                      <>
                        {format(dateRangeFilter.from, "LLL dd, y")} -{" "}
                        {format(dateRangeFilter.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRangeFilter.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRangeFilter?.from}
                  selected={dateRangeFilter}
                  onSelect={onDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="locked-filter" 
              checked={isLockedFilter === true}
              onCheckedChange={(checked) => 
                onIsLockedChange(checked ? true : (isLockedFilter === true ? null : false))
              } 
            />
            <Label htmlFor="locked-filter">
              {isLockedFilter === true 
                ? "Show Locked Documents" 
                : isLockedFilter === false 
                  ? "Show Unlocked Documents" 
                  : "Show All Documents"}
            </Label>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={onResetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const DocumentActions = createPlaceholderComponent('DocumentActions');
const DocumentFolders = createPlaceholderComponent('DocumentFolders');
const DocumentMetadata = createPlaceholderComponent('DocumentMetadata');
const DocumentWorkflowManagement = createPlaceholderComponent('DocumentWorkflowManagement');
const DocumentTrainingIntegration = createPlaceholderComponent('DocumentTrainingIntegration');
const DocumentReviewSchedule = createPlaceholderComponent('DocumentReviewSchedule');
const DocumentLinking = createPlaceholderComponent('DocumentLinking');
const DocumentSecuritySettings = createPlaceholderComponent('DocumentSecuritySettings');
const DocumentCompliance = createPlaceholderComponent('DocumentCompliance');
const DocumentTranslations = createPlaceholderComponent('DocumentTranslations');
const DocumentAnalytics = createPlaceholderComponent('DocumentAnalytics');
const DocumentTemplates = createPlaceholderComponent('DocumentTemplates');
const DocumentCollaboration = createPlaceholderComponent('DocumentCollaboration');
const DocumentCheckinCheckout = createPlaceholderComponent('DocumentCheckinCheckout');
const DocumentApprovalWorkflow = createPlaceholderComponent('DocumentApprovalWorkflow');
const DocumentNotifications = createPlaceholderComponent('DocumentNotifications');
const DocumentAuditTrail = createPlaceholderComponent('DocumentAuditTrail');
const DocumentRetentionPolicy = createPlaceholderComponent('DocumentRetentionPolicy');
const DocumentExport = createPlaceholderComponent('DocumentExport');
const DocumentImport = createPlaceholderComponent('DocumentImport');
const DocumentSearch = createPlaceholderComponent('DocumentSearch');
const DocumentTagging = createPlaceholderComponent('DocumentTagging');
const DocumentCustomFields = createPlaceholderComponent('DocumentCustomFields');
const DocumentReporting = createPlaceholderComponent('DocumentReporting');
const DocumentWatermarking = createPlaceholderComponent('DocumentWatermarking');
const DocumentDigitalSignatures = createPlaceholderComponent('DocumentDigitalSignatures');
const DocumentOCR = createPlaceholderComponent('DocumentOCR');
const DocumentAI = createPlaceholderComponent('DocumentAI');
const DocumentMobileAccess = createPlaceholderComponent('DocumentMobileAccess');
const DocumentOfflineAccess = createPlaceholderComponent('DocumentOfflineAccess');
const DocumentIntegration = createPlaceholderComponent('DocumentIntegration');
const DocumentBranding = createPlaceholderComponent('DocumentBranding');
const DocumentHelp = createPlaceholderComponent('DocumentHelp');
const DocumentSettings = createPlaceholderComponent('DocumentSettings');

const documentFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  category: z.enum(['SOP', 'Policy', 'Form', 'Certificate', 'Audit Report', 'HACCP Plan', 'Training Material', 'Supplier Documentation', 'Risk Assessment', 'Other'] as [DocumentCategory, ...DocumentCategory[]]),
  status: z.enum(['Draft', 'Pending Approval', 'Approved', 'Published', 'Archived', 'Expired'] as [DocumentStatus, ...DocumentStatus[]]),
  expiry_date: z.date().optional(),
  tags: z.string().optional(),
  is_locked: z.boolean().default(false),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

const DocumentRepository: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | null>(null);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | null>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange | undefined>(undefined);
  const [isLockedFilter, setIsLockedFilter] = useState<boolean | null>(null);
  const [isAscendingSort, setIsAscendingSort] = useState(true);
  const [selectedDocumentToDelete, setSelectedDocumentToDelete] = useState<Document | null>(null);
  const { toast } = useToast();
  const documentService = useDocumentService();

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Other",
      status: "Draft",
      expiry_date: undefined,
      tags: "",
      is_locked: false,
    },
  });

  useEffect(() => {
    loadDocuments();
    setFolders([]);
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const fetchedDocuments = await documentService.fetchDocuments();
      setDocuments(fetchedDocuments);
    } catch (error: any) {
      setError(error.message || 'Failed to load documents');
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setCategoryFilter(null);
    setStatusFilter(null);
    setDateRangeFilter(undefined);
    setIsLockedFilter(null);
  };

  const loadFolders = async () => {
    try {
      setFolders([]);
    } catch (error: any) {
      console.error('Error loading folders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load folders',
        variant: 'destructive',
      });
    }
  };

  const handleCreateDocument = async (values: DocumentFormValues) => {
    try {
      const newDocument = {
        title: values.title,
        description: values.description,
        file_name: 'N/A',
        file_size: 0,
        file_type: 'N/A',
        category: values.category as DocumentCategory,
        status: values.status as DocumentStatus,
        version: 1,
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expiry_date: values.expiry_date?.toISOString(),
        tags: values.tags?.split(',').map(tag => tag.trim()),
        is_locked: values.is_locked,
      };

      await documentService.createDocument(newDocument);
      toast({
        title: 'Success',
        description: 'Document created successfully',
      });
      setIsCreateDialogOpen(false);
      form.reset();
      loadDocuments();
    } catch (error: any) {
      console.error('Error creating document:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create document',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateDocument = async (values: DocumentFormValues) => {
    if (!selectedDocument) return;

    try {
      const updatedDocument: Partial<Document> = {
        title: values.title,
        description: values.description,
        category: values.category as DocumentCategory,
        status: values.status as DocumentStatus,
        expiry_date: values.expiry_date?.toISOString(),
        tags: values.tags?.split(',').map(tag => tag.trim()),
        is_locked: values.is_locked,
      };

      await documentService.updateDocument(selectedDocument.id, updatedDocument);
      toast({
        title: 'Success',
        description: 'Document updated successfully',
      });
      setIsEditDialogOpen(false);
      form.reset();
      loadDocuments();
    } catch (error: any) {
      console.error('Error updating document:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update document',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocumentToDelete) return;

    try {
      await documentService.deleteDocument(selectedDocumentToDelete.id);
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      loadDocuments();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete document',
        variant: 'destructive',
      });
    }
  };

  const handleDocumentUploadSuccess = () => {
    setIsUploadDialogOpen(false);
    loadDocuments();
  };

  const filteredDocuments = documents.filter(doc => {
    const searchTermLower = searchTerm.toLowerCase();
    const titleMatch = doc.title.toLowerCase().includes(searchTermLower);
    const descriptionMatch = doc.description?.toLowerCase().includes(searchTermLower);
    const categoryMatch = !categoryFilter || doc.category === categoryFilter;
    const statusMatch = !statusFilter || doc.status === statusFilter;
    const dateRangeMatch = !dateRangeFilter ||
      (doc.created_at &&
        new Date(doc.created_at) >= (dateRangeFilter.from || new Date(0)) &&
        new Date(doc.created_at) <= (dateRangeFilter.to || new Date()));
    const isLockedMatch = isLockedFilter === null || doc.is_locked === isLockedFilter;

    return (titleMatch || descriptionMatch) && categoryMatch && statusMatch && dateRangeMatch && isLockedMatch;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
    const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
    return isAscendingSort ? dateA - dateB : dateB - dateA;
  });

  const handleDocumentSelected = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleOpenEditDialog = (document: Document) => {
    setSelectedDocument(document);
    form.setValue('title', document.title);
    form.setValue('description', document.description || '');
    form.setValue('category', document.category);
    form.setValue('status', document.status);
    form.setValue('expiry_date', document.expiry_date ? new Date(document.expiry_date) : undefined);
    form.setValue('tags', document.tags?.join(', ') || '');
    form.setValue('is_locked', document.is_locked || false);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (document: Document) => {
    setSelectedDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  const handleSortToggle = () => {
    setIsAscendingSort(!isAscendingSort);
  };

  const handleCategoryFilterChange = (category: DocumentCategory | null) => {
    setCategoryFilter(category);
  };

  const handleStatusFilterChange = (status: DocumentStatus | null) => {
    setStatusFilter(status);
  };

  const handleDateRangeFilterChange = (dateRange: DateRange | undefined) => {
    setDateRangeFilter(dateRange);
  };

  const handleIsLockedFilterChange = (isLocked: boolean | null) => {
    setIsLockedFilter(isLocked);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Document Repository</CardTitle>
          <CardDescription>Manage and organize your documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-md border"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSortToggle}>
                  <span className="mr-1">Sort</span> {isAscendingSort ? '↑' : '↓'}
                </Button>

                <DocumentFilters
                  categoryFilter={categoryFilter}
                  statusFilter={statusFilter}
                  dateRangeFilter={dateRangeFilter}
                  isLockedFilter={isLockedFilter}
                  onCategoryChange={setCategoryFilter}
                  onStatusChange={setStatusFilter}
                  onDateRangeChange={setDateRangeFilter}
                  onIsLockedChange={setIsLockedFilter}
                  onResetFilters={resetFilters}
                />

                <Button 
                  size="sm" 
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Upload Document</span>
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading documents...
              </div>
            ) : error ? (
              <div className="text-red-500 py-4">Error: {error}</div>
            ) : (
              <ScrollArea className="rounded-md border h-[500px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileText className="h-10 w-10 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">No documents found</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="mt-2"
                              onClick={() => setIsUploadDialogOpen(true)}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Document
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedDocuments.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell className="font-medium">{document.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-secondary/30">
                              {document.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                document.status === 'Draft' && 'bg-slate-200 text-slate-700',
                                document.status === 'Pending Approval' && 'bg-amber-100 text-amber-700',
                                document.status === 'Approved' && 'bg-green-100 text-green-700',
                                document.status === 'Published' && 'bg-blue-100 text-blue-700',
                                document.status === 'Archived' && 'bg-gray-100 text-gray-700',
                                document.status === 'Expired' && 'bg-red-100 text-red-700'
                              )}
                            >
                              {document.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {document.updated_at
                              ? format(new Date(document.updated_at), 'MMM d, yyyy h:mm a')
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDocumentSelected(document)}
                                title="Preview"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleOpenEditDialog(document)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleOpenDeleteDialog(document)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create Document</DialogTitle>
            <DialogDescription>
              Add a new document to the repository.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateDocument)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Document Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Document Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Expiry Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Set an expiry date for the document.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma separated tags" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add comma separated tags for document.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_locked"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Lock Document</FormLabel>
                      <FormDescription>
                        Prevent further modifications to the document.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Edit the selected document.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateDocument)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Document Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Document Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Expiry Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Set an expiry date for the document.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma separated tags" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add comma separated tags for document.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_locked"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Lock Document</FormLabel>
                      <FormDescription>
                        Prevent further modifications to the document.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteDocument}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document to the repository.
            </DialogDescription>
          </DialogHeader>
          <DocumentUploader onSuccess={handleDocumentUploadSuccess} onCancel={() => setIsUploadDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[80%] sm:max-h-[90vh]">
          {selectedDocument && (
            <DocumentPreviewDialog document={selectedDocument} onClose={() => setIsPreviewOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      <DocumentVersionHistory
        document={selectedDocument}
        open={isVersionHistoryOpen}
        onOpenChange={setIsVersionHistoryOpen}
      />
    </>
  );
};

export default DocumentRepository;

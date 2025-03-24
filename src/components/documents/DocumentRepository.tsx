
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FolderIcon, FileText, Download, CheckCircle2, Clock, AlertTriangle, Tag, Edit, Eye, Trash2 } from 'lucide-react';
import { useDocuments } from '@/contexts/DocumentContext';
import { Document, DocumentCategory } from '@/types/document';
import { documentWorkflowService } from '@/services/documentWorkflowService';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import DocumentPreviewDialog from './DocumentPreviewDialog';

const DocumentRepository: React.FC = () => {
  const { documents, deleteDocument, setSelectedDocument } = useDocuments();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [showPreview, setShowPreview] = useState(false);
  const [docToPreview, setDocToPreview] = useState<Document | null>(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, document: null as Document | null });
  
  // Get all unique categories from documents
  const categories = Array.from(new Set(documents.map(doc => doc.category)));

  // Filter documents based on search query, category, and status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
    const matchesCategory = 
      filterCategory === 'all' || doc.category === filterCategory;
      
    const matchesStatus = 
      filterStatus === 'all' || doc.status === filterStatus;
      
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenDeleteDialog = (doc: Document) => {
    setDeleteDialog({ open: true, document: doc });
  };

  const handleDelete = () => {
    if (deleteDialog.document) {
      deleteDocument(deleteDialog.document.id);
      setDeleteDialog({ open: false, document: null });
    }
  };

  const handleEditDocument = (doc: Document) => {
    setSelectedDocument(doc);
    navigate('/documents', { state: { activeTab: 'edit' } });
  };

  const getStatusBadge = (doc: Document) => {
    switch (doc.status) {
      case 'Draft':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Draft
          </Badge>
        );
      case 'Pending Approval':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending Approval
          </Badge>
        );
      case 'Approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'Published':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Published
          </Badge>
        );
      case 'Archived':
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Archived
          </Badge>
        );
      case 'Expired':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Expired
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{doc.status}</Badge>
        );
    }
  };

  const documentCountsByCategory: Record<DocumentCategory, number> = {} as Record<DocumentCategory, number>;
  
  documents.forEach(doc => {
    if (!documentCountsByCategory[doc.category]) {
      documentCountsByCategory[doc.category] = 0;
    }
    documentCountsByCategory[doc.category]++;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Document Repository</CardTitle>
              <CardDescription>
                Central storage for all compliance documentation
              </CardDescription>
            </div>
            <Button onClick={() => navigate('/documents', { state: { activeTab: 'edit' } })}>
              Upload New Document
            </Button>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-blue-500 mr-2" />
                            <div>
                              <div>{doc.title}</div>
                              <div className="text-xs text-muted-foreground">{doc.fileName}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-100">
                            {doc.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(doc)}
                        </TableCell>
                        <TableCell>
                          {new Date(doc.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>v{doc.version}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setDocToPreview(doc);
                                setShowPreview(true);
                              }}
                              title="View Document"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditDocument(doc)}
                              title="Edit Document"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              title="Download Document"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenDeleteDialog(doc)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              title="Delete Document"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No documents found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(documentCountsByCategory).map(([category, count]) => (
                  <div 
                    key={category} 
                    className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      filterCategory === category ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => setFilterCategory(category)}
                  >
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{category}</span>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Folders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center">
                    <FolderIcon className="h-4 w-4 mr-2 text-amber-500" />
                    <span>SOPs</span>
                  </div>
                  <Badge variant="outline">
                    {documents.filter(doc => doc.category === 'SOP').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center">
                    <FolderIcon className="h-4 w-4 mr-2 text-amber-500" />
                    <span>HACCP Plans</span>
                  </div>
                  <Badge variant="outline">
                    {documents.filter(doc => doc.category === 'HACCP Plan').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center">
                    <FolderIcon className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Certificates</span>
                  </div>
                  <Badge variant="outline">
                    {documents.filter(doc => doc.category === 'Certificate').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center">
                    <FolderIcon className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Audit Reports</span>
                  </div>
                  <Badge variant="outline">
                    {documents.filter(doc => doc.category === 'Audit Report').length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document preview dialog */}
      <DocumentPreviewDialog 
        document={docToPreview} 
        open={showPreview} 
        onOpenChange={setShowPreview} 
      />

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.document?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, document: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentRepository;

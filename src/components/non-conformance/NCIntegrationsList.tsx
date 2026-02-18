
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, ClipboardCheck, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface NCIntegrationsListProps {
  nonConformanceId: string;
}

type IntegrationType = 'capa' | 'document' | 'training';

const NCIntegrationsList: React.FC<NCIntegrationsListProps> = ({ nonConformanceId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [capaItems, setCapaItems] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        
        // Fetch linked CAPA via NC's capa_id
        const { data: nc } = await supabase
          .from('non_conformances')
          .select('capa_id')
          .eq('id', nonConformanceId)
          .single();

        if (nc?.capa_id) {
          const { data: capa } = await supabase
            .from('capas')
            .select('*')
            .eq('id', nc.capa_id);
          setCapaItems(capa || []);
        }
        
        // Documents are fetched from the documents table if any reference this NC
        // For now, just set empty
        setDocuments([]);
      } catch (err) {
        console.error('Error fetching integrations:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIntegrations();
  }, [nonConformanceId]);
  
  const allIntegrations = [
    ...capaItems.map(item => ({
      id: item.id, title: item.title, status: item.status,
      dueDate: item.due_date, assignedTo: item.assigned_to, type: 'capa' as IntegrationType
    })),
    ...documents.map(doc => ({
      id: doc.id, title: doc.title, status: doc.status,
      dueDate: doc.expiry_date, type: 'document' as IntegrationType
    }))
  ];
  
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded w-1/3"></div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Related Items</CardTitle></CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({allIntegrations.length})</TabsTrigger>
            <TabsTrigger value="capa">CAPA ({capaItems.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {allIntegrations.length > 0 ? (
              <div className="space-y-3">
                {allIntegrations.map(item => (
                  <IntegrationItem key={`${item.type}-${item.id}`} item={item}
                    onClick={() => item.type === 'capa' ? navigate(`/capa/${item.id}`) : undefined} />
                ))}
              </div>
            ) : <EmptyState message="No related items found" />}
          </TabsContent>
          
          <TabsContent value="capa">
            {capaItems.length > 0 ? (
              <div className="space-y-3">
                {capaItems.map(item => (
                  <IntegrationItem key={`capa-${item.id}`}
                    item={{ id: item.id, title: item.title, status: item.status, dueDate: item.due_date, assignedTo: item.assigned_to, type: 'capa' }}
                    onClick={() => navigate(`/capa/${item.id}`)} />
                ))}
              </div>
            ) : <EmptyState message="No CAPA actions found" />}
          </TabsContent>
          
          <TabsContent value="documents">
            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map(doc => (
                  <IntegrationItem key={`doc-${doc.id}`}
                    item={{ id: doc.id, title: doc.title, status: doc.status, dueDate: doc.expiry_date, type: 'document' }}
                    onClick={() => {}} />
                ))}
              </div>
            ) : <EmptyState message="No related documents found" />}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface IntegrationItemProps {
  item: { id: string; title: string; status?: string; dueDate?: string; assignedTo?: string; type: IntegrationType };
  onClick: () => void;
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({ item, onClick }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'capa': return <ClipboardCheck className="h-5 w-5 text-blue-600" />;
      case 'document': return <FileSpreadsheet className="h-5 w-5 text-purple-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  return (
    <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div>
            <h4 className="text-sm font-medium">{item.title}</h4>
            {item.assignedTo && <p className="text-xs text-muted-foreground">Assigned to: {item.assignedTo}</p>}
            {item.dueDate && <p className="text-xs text-muted-foreground">Due: {new Date(item.dueDate).toLocaleDateString()}</p>}
          </div>
        </div>
        {item.status && (
          <Badge variant="outline" className={
            item.status?.toLowerCase().includes('complete') || item.status?.toLowerCase().includes('closed') ? 'border-green-500 text-green-600' :
            item.status?.toLowerCase().includes('progress') ? 'border-blue-500 text-blue-600' :
            item.status?.toLowerCase().includes('open') ? 'border-yellow-500 text-yellow-600' :
            'border-muted text-muted-foreground'
          }>{item.status}</Badge>
        )}
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center p-6 border border-dashed rounded-md">
    <p className="text-muted-foreground">{message}</p>
  </div>
);

export default NCIntegrationsList;

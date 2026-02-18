
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Plus, RefreshCcw, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface NCCAPAIntegrationProps {
  nonConformanceId: string;
}

interface CAPA {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  created_at: string;
  assigned_to: string;
}

const NCCAPAIntegration: React.FC<NCCAPAIntegrationProps> = ({ nonConformanceId }) => {
  const [relatedCAPAs, setRelatedCAPAs] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLinkDialog, setShowLinkDialog] = useState<boolean>(false);
  const [availableCAPAs, setAvailableCAPAs] = useState<CAPA[]>([]);
  const [selectedCAPAId, setSelectedCAPAId] = useState<string>('');
  const [creatingCAPA, setCreatingCAPA] = useState<boolean>(false);

  const fetchRelatedCAPAs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if the NC has a capa_id linked
      const { data: nc, error: ncError } = await supabase
        .from('non_conformances')
        .select('capa_id')
        .eq('id', nonConformanceId)
        .single();
      
      if (ncError) throw ncError;
      
      if (nc?.capa_id) {
        const { data: capa, error: capaError } = await supabase
          .from('capas')
          .select('*')
          .eq('id', nc.capa_id)
          .single();
        
        if (!capaError && capa) {
          setRelatedCAPAs([capa as unknown as CAPA]);
        } else {
          setRelatedCAPAs([]);
        }
      } else {
        setRelatedCAPAs([]);
      }
    } catch (err) {
      console.error('Error fetching related CAPAs:', err);
      setError('Failed to load related CAPAs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCAPA = async () => {
    try {
      setCreatingCAPA(true);
      const { data: nc } = await supabase
        .from('non_conformances')
        .select('*')
        .eq('id', nonConformanceId)
        .single();

      if (!nc) throw new Error('NC not found');

      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: capa, error: capaError } = await supabase
        .from('capas')
        .insert({
          title: `CAPA for: ${nc.title}`,
          description: nc.description || '',
          source: 'Non Conformance',
          source_reference: nonConformanceId,
          priority: nc.risk_level === 'Critical' ? 'Critical' : nc.risk_level === 'High' ? 'High' : 'Medium',
          status: 'Open',
          created_by: user?.id,
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (capaError) throw capaError;

      // Link CAPA to NC
      await supabase
        .from('non_conformances')
        .update({ capa_id: capa.id })
        .eq('id', nonConformanceId);

      toast.success('CAPA created successfully');
      fetchRelatedCAPAs();
    } catch (err) {
      console.error('Error creating CAPA:', err);
      toast.error('Failed to create CAPA');
    } finally {
      setCreatingCAPA(false);
    }
  };

  const handleLinkCAPA = async () => {
    if (!selectedCAPAId) return;
    try {
      await supabase
        .from('non_conformances')
        .update({ capa_id: selectedCAPAId })
        .eq('id', nonConformanceId);

      toast.success('CAPA linked successfully');
      setShowLinkDialog(false);
      fetchRelatedCAPAs();
    } catch (err) {
      console.error('Error linking CAPA:', err);
      toast.error('Failed to link CAPA');
    }
  };

  const fetchAvailableCAPAs = async () => {
    try {
      const { data, error } = await supabase
        .from('capas')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const linkedIds = relatedCAPAs.map(c => c.id);
      setAvailableCAPAs((data || []).filter((c: any) => !linkedIds.includes(c.id)) as unknown as CAPA[]);
    } catch (err) {
      console.error('Error fetching available CAPAs:', err);
    }
  };

  useEffect(() => { fetchRelatedCAPAs(); }, [nonConformanceId]);
  useEffect(() => { if (showLinkDialog) fetchAvailableCAPAs(); }, [showLinkDialog]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Related CAPAs</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchRelatedCAPAs} disabled={loading}>
            <RefreshCcw className="h-4 w-4 mr-1" />Refresh
          </Button>
          <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><LinkIcon className="h-4 w-4 mr-1" />Link Existing</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link Existing CAPA</DialogTitle>
                <DialogDescription>Select an existing CAPA to link to this Non-Conformance</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select value={selectedCAPAId} onValueChange={setSelectedCAPAId}>
                  <SelectTrigger><SelectValue placeholder="Select a CAPA" /></SelectTrigger>
                  <SelectContent>
                    {availableCAPAs.map((capa) => (
                      <SelectItem key={capa.id} value={capa.id}>{capa.title}</SelectItem>
                    ))}
                    {availableCAPAs.length === 0 && <SelectItem value="none" disabled>No available CAPAs</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
                <Button onClick={handleLinkCAPA} disabled={!selectedCAPAId}>Link CAPA</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size="sm" onClick={handleCreateCAPA} disabled={creatingCAPA}>
            <Plus className="h-4 w-4 mr-1" />Create CAPA
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-6 text-destructive">
            <AlertTriangle className="h-5 w-5 mr-2" /><span>{error}</span>
          </div>
        ) : relatedCAPAs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No CAPAs linked to this Non-Conformance</p>
            <p className="text-sm mt-1">Create a new CAPA or link an existing one</p>
          </div>
        ) : (
          <div className="space-y-4">
            {relatedCAPAs.map((capa) => (
              <div key={capa.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{capa.title}</h3>
                    <p className="text-sm text-muted-foreground">{capa.description}</p>
                  </div>
                  <Badge className={getStatusColor(capa.status)}>{capa.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
                  <div><span className="text-muted-foreground">Priority:</span> <span className="font-medium">{capa.priority}</span></div>
                  <div><span className="text-muted-foreground">Due:</span> <span className="font-medium">{capa.due_date ? new Date(capa.due_date).toLocaleDateString() : 'N/A'}</span></div>
                  <div><span className="text-muted-foreground">Created:</span> <span className="font-medium">{new Date(capa.created_at).toLocaleDateString()}</span></div>
                  <div><span className="text-muted-foreground">Assigned to:</span> <span className="font-medium">{capa.assigned_to || 'Unassigned'}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-end">
                  <Button variant="link" size="sm" asChild>
                    <a href={`/capa/${capa.id}`}>View CAPA</a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NCCAPAIntegration;

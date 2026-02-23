
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Calendar, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAudits } from '@/hooks/useAudits';
import { Audit, AuditStatus } from '@/types/audit';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { toast } from 'sonner';
import DashboardHeader from '@/components/DashboardHeader';

const InternalAudits = () => {
  const navigate = useNavigate();
  const { audits, loading, error, loadAudits } = useAudits();
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    loadAudits();
  }, [loadAudits]);

  const handleCreateAudit = () => {
    navigate('/audits/new');
  };

  const handleViewAudit = (auditId: string) => {
    navigate(`/audits/${auditId}`);
  };

  const getStatusColor = (status: AuditStatus) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'On Hold':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const isUpcoming = (audit: Audit) => {
    const today = new Date();
    const startDate = new Date(audit.startDate);
    return startDate > today && audit.status !== 'Completed' && audit.status !== 'Cancelled';
  };

  const isActive = (audit: Audit) => {
    return audit.status === 'In Progress' || audit.status === 'On Hold';
  };

  const isCompleted = (audit: Audit) => {
    return audit.status === 'Completed';
  };

  const upcomingAudits = audits.filter(isUpcoming);
  const activeAudits = audits.filter(isActive);
  const completedAudits = audits.filter(isCompleted);

  const renderAuditCard = (audit: Audit) => {
    return (
      <Card key={audit.id} className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{audit.title}</CardTitle>
            <Badge className={getStatusColor(audit.status as string)}>{audit.status}</Badge>
          </div>
          <CardDescription>
            {audit.auditType} Audit • {audit.findings || 0} Findings
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>Start: {formatDate(audit.startDate)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>Due: {formatDate(audit.dueDate)}</span>
            </div>
            {audit.department && (
              <div className="flex items-center col-span-2">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                <span>Department: {audit.department}</span>
              </div>
            )}
            {audit.assignedTo && (
              <div className="flex items-center col-span-2">
                <CheckCircle className="h-4 w-4 mr-2 text-gray-500" />
                <span>Assigned to: {audit.assignedTo}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="outline" size="sm" onClick={() => handleViewAudit(audit.id)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderAuditList = (auditList: Audit[]) => {
    if (loading) {
      return Array(3).fill(0).map((_, i) => (
        <Card key={i} className="mb-4">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Skeleton className="h-9 w-24" />
          </CardFooter>
        </Card>
      ));
    }

    if (auditList.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No audits found in this category.</p>
          <Button onClick={handleCreateAudit} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule Your First Audit
          </Button>
        </div>
      );
    }

    return auditList.map(renderAuditCard);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Internal Audits" 
        subtitle="Manage and track your internal audit program"
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Total Audits: {audits.length}
          </div>
          <div className="text-sm text-muted-foreground">
            Upcoming: {upcomingAudits.length}
          </div>
          <div className="text-sm text-muted-foreground">
            Active: {activeAudits.length}
          </div>
        </div>
        <Button onClick={handleCreateAudit}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Schedule New Audit
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error loading audits. Please try again.
        </div>
      )}

      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAudits.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeAudits.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedAudits.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Audits ({audits.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {renderAuditList(upcomingAudits)}
        </TabsContent>

        <TabsContent value="active">
          {renderAuditList(activeAudits)}
        </TabsContent>

        <TabsContent value="completed">
          {renderAuditList(completedAudits)}
        </TabsContent>

        <TabsContent value="all">
          {renderAuditList(audits)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternalAudits;

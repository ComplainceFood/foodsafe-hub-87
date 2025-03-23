
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrainingDashboard from '@/components/training/TrainingDashboard';
import TrainingRecords from '@/components/training/TrainingRecords';
import TrainingPlans from '@/components/training/TrainingPlans';
import CourseLibrary from '@/components/training/CourseLibrary';
import CompetencyAssessments from '@/components/training/CompetencyAssessments';
import ReportsAnalytics from '@/components/training/ReportsAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuditTraining } from '@/hooks/useAuditTraining';
import { AlertTriangle, BookOpen, CheckCircle2, Clock, Thermometer, AlertCircle, FileText, Users, Bug } from 'lucide-react';

const TrainingModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { trainings, loading } = useAuditTraining();
  
  // Filter only non-completed training from audits
  const auditTrainingTasks = trainings.filter(t => t.status !== 'completed');
  
  // Count critical and high priority tasks
  const criticalTasks = auditTrainingTasks.filter(t => t.priority === 'critical').length;
  const highPriorityTasks = auditTrainingTasks.filter(t => t.priority === 'high').length;
  
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'temperature-control':
        return <Thermometer className="h-5 w-5 text-blue-600" />;
      case 'allergen-control':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'hygiene-monitoring':
        return <Users className="h-5 w-5 text-green-600" />;
      case 'documentation':
        return <FileText className="h-5 w-5 text-yellow-600" />;
      case 'sanitization':
        return <AlertTriangle className="h-5 w-5 text-purple-600" />;
      case 'pest-control':
        return <Bug className="h-5 w-5 text-orange-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-blue-600" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title="Training Module" 
        subtitle="Manage employee training, competency and compliance certification." 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {auditTrainingTasks.length > 0 && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Audit-Related Training</AlertTitle>
            <AlertDescription className="text-amber-700">
              There {auditTrainingTasks.length === 1 ? 'is' : 'are'} {auditTrainingTasks.length} training task{auditTrainingTasks.length !== 1 ? 's' : ''} assigned from audit findings.
              {criticalTasks > 0 && ` ${criticalTasks} ${criticalTasks === 1 ? 'task requires' : 'tasks require'} immediate attention.`}
            </AlertDescription>
          </Alert>
        )}
        
        {auditTrainingTasks.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Audit-Related Training Tasks
              </CardTitle>
              <CardDescription>
                Training assignments based on audit findings and CAPAs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditTrainingTasks.map(task => (
                  <div key={task.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(task.category)}
                        <h4 className="font-medium">{task.courseTitle}</h4>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        {task.priority && (
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">From Audit #{task.auditId}</p>
                      <div className="flex items-center gap-1 mt-1 text-sm">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <span className={task.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                          Due: {task.dueDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab("plans")}
                      >
                        View Details
                      </Button>
                      {task.status === 'assigned' && (
                        <Button 
                          variant="default" 
                          size="sm"
                        >
                          Start Training
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in">
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="records">Training Records</TabsTrigger>
            <TabsTrigger value="plans">Training Plans</TabsTrigger>
            <TabsTrigger value="courses">Course Library</TabsTrigger>
            <TabsTrigger value="assessments">Competency Assessments</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <TrainingDashboard />
          </TabsContent>
          
          <TabsContent value="records">
            <TrainingRecords />
          </TabsContent>
          
          <TabsContent value="plans">
            <TrainingPlans />
          </TabsContent>
          
          <TabsContent value="courses">
            <CourseLibrary />
          </TabsContent>
          
          <TabsContent value="assessments">
            <CompetencyAssessments />
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportsAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TrainingModule;

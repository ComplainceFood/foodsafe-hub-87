
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, BookOpen } from 'lucide-react';

const UpcomingTrainingCard: React.FC = () => {
  // Sample upcoming training data - show only the next 3
  const upcomingTrainings = [
    { 
      id: '1', 
      title: 'GMP Refresher', 
      dueDate: 'May 14', 
      priority: 'High',
      participants: 12
    },
    { 
      id: '2', 
      title: 'ISO 9001:2015 Changes', 
      dueDate: 'May 22', 
      priority: 'Medium',
      participants: 8
    },
    { 
      id: '3', 
      title: 'HACCP Principles', 
      dueDate: 'May 30', 
      priority: 'High',
      participants: 15
    }
  ];
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <CalendarClock className="h-5 w-5 text-blue-500 mr-2" />
            Upcoming Training
          </CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <CardDescription>Training sessions in the next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingTrainings.map((training) => (
            <div key={training.id} className="flex items-center justify-between border-b pb-2 last:border-0">
              <div className="flex items-start space-x-3">
                <BookOpen className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">{training.title}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-muted-foreground">Due: {training.dueDate}</span>
                    <span className="text-xs text-muted-foreground">{training.participants} participants</span>
                  </div>
                </div>
              </div>
              <PriorityBadge priority={training.priority} />
            </div>
          ))}
          <Button variant="outline" className="w-full mt-2">
            View all scheduled training
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getColorClass = () => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getColorClass()}`}>
      {priority}
    </span>
  );
};

export default UpcomingTrainingCard;

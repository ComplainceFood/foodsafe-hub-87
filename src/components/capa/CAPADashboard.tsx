import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Pie, PieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { CAPAFilters, CAPAStats } from '@/types/capa';
import { getCAPAStats, fetchCAPAs } from '@/services/capaService';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface CAPADashboardProps {
  filters: CAPAFilters;
  searchQuery: string;
}

const CAPADashboard: React.FC<CAPADashboardProps> = ({ filters, searchQuery }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<CAPAStats | null>(null);
  const [capaList, setCAPAList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Generate colors for charts
  const statusColors = ['#3b82f6', '#8b5cf6', '#10b981', '#06b6d4'];
  const priorityColors = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];
  const sourceColors = ['#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4'];

  // Fetch CAPA stats
  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const statsData = await getCAPAStats();
      setStats({
        ...statsData,
        averageClosureTime: 0,
        effectivenessRating: {
          effective: 0,
          partiallyEffective: 0,
          notEffective: 0
        },
        fsma204ComplianceRate: 0
      });
      
      const capas = await fetchCAPAs({
        ...filters,
        searchQuery
      });
      setCAPAList(capas);
    } catch (error) {
      console.error('Error fetching CAPA statistics:', error);
      toast.error('Failed to load CAPA statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filters, searchQuery]);

  // Transform stats data for charts
  const statusData = stats ? [
    { name: 'Open', value: stats.byStatus.open },
    { name: 'In Progress', value: stats.byStatus['in-progress'] },
    { name: 'Closed', value: stats.byStatus.closed },
    { name: 'Verified', value: stats.byStatus.verified }
  ] : [];

  const priorityData = stats ? [
    { name: 'Critical', value: stats.byPriority.critical },
    { name: 'High', value: stats.byPriority.high },
    { name: 'Medium', value: stats.byPriority.medium },
    { name: 'Low', value: stats.byPriority.low }
  ] : [];

  const sourceData = stats ? [
    { name: 'Audit', value: stats.bySource.audit },
    { name: 'HACCP', value: stats.bySource.haccp },
    { name: 'Supplier', value: stats.bySource.supplier },
    { name: 'Complaint', value: stats.bySource.complaint },
    { name: 'Traceability', value: stats.bySource.traceability }
  ] : [];

  // Get monthly CAPA data for trends
  const getMonthlyTrendData = () => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    // Group CAPAs by month of creation
    const monthlyData: Record<string, { month: string, created: number, closed: number }> = {};
    
    // Initialize months
    for (let i = 0; i <= 5; i++) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      const monthYear = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      monthlyData[monthYear] = { month: monthYear, created: 0, closed: 0 };
    }
    
    // Fill in data
    capaList.forEach(capa => {
      const createdDate = new Date(capa.createdDate);
      const completedDate = capa.completedDate ? new Date(capa.completedDate) : null;
      
      // Only include data from the last 6 months
      if (createdDate >= sixMonthsAgo) {
        const monthYear = `${createdDate.toLocaleString('default', { month: 'short' })} ${createdDate.getFullYear()}`;
        if (monthlyData[monthYear]) {
          monthlyData[monthYear].created++;
        }
      }
      
      if (completedDate && completedDate >= sixMonthsAgo) {
        const monthYear = `${completedDate.toLocaleString('default', { month: 'short' })} ${completedDate.getFullYear()}`;
        if (monthlyData[monthYear]) {
          monthlyData[monthYear].closed++;
        }
      }
    });
    
    // Convert to array and sort by date
    return Object.values(monthlyData).reverse();
  };

  const monthlyTrendData = getMonthlyTrendData();

  // Get statistic cards
  const StatCard = ({ title, value, description, className = '' }: { title: string, value: number | string, description: string, className?: string }) => (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip p-2 bg-white border rounded shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
          {payload[1] && <p className="text-sm">{`${payload[1].name}: ${payload[1].value}`}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading dashboard data...</span>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchStats}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total CAPAs" 
              value={stats?.total || 0} 
              description="Total number of CAPAs"
            />
            <StatCard 
              title="Open CAPAs" 
              value={stats ? stats.byStatus.open + stats.byStatus['in-progress'] : 0} 
              description="CAPAs in progress or not started"
            />
            <StatCard 
              title="Overdue" 
              value={stats?.overdue || 0} 
              description="CAPAs past their due date"
              className={stats && stats.overdue > 0 ? "border-red-200 bg-red-50" : ""}
            />
            <StatCard 
              title="Closed Rate" 
              value={`${stats && stats.total > 0 ? Math.round((stats.byStatus.closed + stats.byStatus.verified) / stats.total * 100) : 0}%`} 
              description="Percentage of CAPAs that are closed"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Status Distribution</CardTitle>
                    <CardDescription>CAPAs by current status</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Priority Distribution</CardTitle>
                    <CardDescription>CAPAs by priority level</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={priorityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {priorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={priorityColors[index % priorityColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Source Distribution</CardTitle>
                    <CardDescription>CAPAs by origin source</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sourceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={sourceColors[index % sourceColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>CAPA Trends (6 Months)</CardTitle>
                  <CardDescription>Created vs Closed CAPAs by month</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyTrendData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        angle={-45} 
                        textAnchor="end" 
                        tick={{ fontSize: 12 }} 
                        height={70}
                      />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="created" 
                        name="Created" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="closed" 
                        name="Closed" 
                        stroke="#10b981" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>CAPAs by Status</CardTitle>
                    <CardDescription>Detailed breakdown by status</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statusData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={0} 
                          tick={{ fontSize: 12 }} 
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="value" 
                          name="Count" 
                          fill="#3b82f6"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>CAPAs by Priority</CardTitle>
                    <CardDescription>Detailed breakdown by priority</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={priorityData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={0} 
                          tick={{ fontSize: 12 }} 
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="value" 
                          name="Count" 
                          fill="#3b82f6"
                        >
                          {priorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={priorityColors[index % priorityColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default CAPADashboard;

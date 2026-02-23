
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/contexts/UserContext';
import { Building2, Plus, Users } from 'lucide-react';
import { Organization } from '@/types/organization';
import { fetchOrganizations } from '@/services/organizationService';
import { useForm } from 'react-hook-form';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import FacilitiesTab from '@/components/organizations/FacilitiesTab';

const organizationFormSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  description: z.string().optional(),
  contact_email: z.string().email("Invalid email address").optional().or(z.literal('')),
  contact_phone: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

const OrganizationManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();

  const orgForm = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: '',
      description: '',
      contact_email: '',
      contact_phone: '',
    }
  });

  useEffect(() => {
    if (user) {
      fetchOrganizationData();
    }
  }, [user]);

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      
      const organizationsData = await fetchOrganizations();
      
      console.log('Loaded organizations:', organizationsData);
      setOrganizations(organizationsData);
      
      if (organizationsData.length === 1) {
        setSelectedOrganization(organizationsData[0]);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load organizations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (values: OrganizationFormValues) => {
    try {
      setSubmitting(true);
      console.log('Creating organization with data:', values);
      
      const newOrg = await createOrganization({
        name: values.name,
        description: values.description || undefined,
        contact_email: values.contact_email || undefined,
        contact_phone: values.contact_phone || undefined,
      } as any);
      
      toast({
        title: 'Success',
        description: 'Organization created successfully!'
      });
      
      setCreateDialogOpen(false);
      orgForm.reset();
      fetchOrganizationData();
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: 'Error',
        description: 'Failed to create organization',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectOrganization = (org: Organization) => {
    setSelectedOrganization(org);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organization Management</h1>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>
                Add a new organization to the system.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...orgForm}>
              <form onSubmit={orgForm.handleSubmit(handleCreateOrganization)} className="space-y-4 py-2">
                <FormField
                  control={orgForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC Foods Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={orgForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Organic food producer"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={orgForm.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="contact@abcfoods.com"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={orgForm.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1 (555) 123-4567"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button variant="outline" type="button" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            {organizations.length === 0 ? (
              loading ? (
                <div className="text-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading organizations...</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-2 text-muted-foreground">No organizations found.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first organization
                  </Button>
                </div>
              )
            ) : (
              <ul className="space-y-2">
                {organizations.map((org) => (
                  <li key={org.id}>
                    <Button 
                      variant={selectedOrganization?.id === org.id ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => handleSelectOrganization(org)}
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      {org.name}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        
        <div className="md:col-span-3">
          {selectedOrganization ? (
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Organization Details</TabsTrigger>
                <TabsTrigger value="facilities">Facilities</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedOrganization.name}</CardTitle>
                    <CardDescription>Organization information and settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Description</Label>
                        <p className="text-muted-foreground">{selectedOrganization.description || 'No description provided'}</p>
                      </div>
                      
                      <div>
                        <Label>Organization Type</Label>
                        <p className="text-muted-foreground">Not specified</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label>Contact Information</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label className="text-sm">Email</Label>
                            <p className="text-muted-foreground">{selectedOrganization.contact_email || 'Not specified'}</p>
                          </div>
                          <div>
                            <Label className="text-sm">Phone</Label>
                            <p className="text-muted-foreground">{selectedOrganization.contact_phone || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-end">
                        <Button onClick={() => navigate(`/organization/edit/${selectedOrganization.id}`)}>
                          Edit Organization
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="facilities">
                {selectedOrganization && (
                  <FacilitiesTab organizationId={selectedOrganization.id} />
                )}
              </TabsContent>
              
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Manage users for {selectedOrganization.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <p className="mt-2 text-muted-foreground">User management will be implemented soon.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-4 text-lg text-muted-foreground">Select an organization to view details</p>
                {organizations.length === 0 && !loading && (
                  <Button variant="outline" className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first organization
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationManagement;

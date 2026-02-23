import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Department {
  id: string;
  name: string;
  description: string;
}

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);
  const [editedDepartment, setEditedDepartment] = useState({ name: '', description: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDepartment({ ...newDepartment, [name]: value });
  };

  const handleSubmit = () => {
    if (!newDepartment.name || !newDepartment.description) {
      toast.error('Please fill all fields');
      return;
    }
    const dept: Department = { id: uuidv4(), ...newDepartment };
    setDepartments([...departments, dept]);
    setNewDepartment({ name: '', description: '' });
    setIsDialogOpen(false);
    toast.success('Department created successfully');
  };

  const startEditing = (department: Department) => {
    setEditingDepartmentId(department.id);
    setEditedDepartment({ name: department.name, description: department.description });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedDepartment({ ...editedDepartment, [name]: value });
  };

  const updateDepartment = () => {
    setDepartments(departments.map(dept =>
      dept.id === editingDepartmentId ? { ...dept, ...editedDepartment } : dept
    ));
    setEditingDepartmentId(null);
    toast.success('Department updated successfully');
  };

  const confirmDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(dept => dept.id !== id));
      toast.success('Department deleted successfully');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Departments Management</CardTitle>
            <CardDescription>Manage departments within your organization</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Department</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
                <DialogDescription>Add a new department to the system</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" value={newDepartment.name} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input id="description" name="description" value={newDepartment.description} onChange={handleInputChange} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>Create Department</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Departments List</CardTitle>
          <CardDescription>View and manage existing departments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map(department =>
                editingDepartmentId === department.id ? (
                  <TableRow key={department.id}>
                    <TableCell><Input name="name" value={editedDepartment.name} onChange={handleEditInputChange} /></TableCell>
                    <TableCell><Input name="description" value={editedDepartment.description} onChange={handleEditInputChange} /></TableCell>
                    <TableCell className="text-right"><Button size="sm" onClick={updateDepartment}>Update</Button></TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.description}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => startEditing(department)}><Pencil className="h-4 w-4 mr-2" />Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => confirmDelete(department.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentManagement;

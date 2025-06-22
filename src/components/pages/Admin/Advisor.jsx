import React, { useState, useEffect } from 'react';

// Table components inline since they're not available in this environment
const Table = ({ children, ...props }) => (
  <table className="w-full caption-bottom text-sm" {...props}>{children}</table>
);
const TableHeader = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
);
const TableBody = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
);
const TableHead = ({ children, className = '', ...props }) => (
  <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${className}`} {...props}>
    {children}
  </th>
);
const TableRow = ({ children, className = '', ...props }) => (
  <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`} {...props}>
    {children}
  </tr>
);
const TableCell = ({ children, className = '', ...props }) => (
  <td className={`p-4 align-middle ${className}`} {...props}>{children}</td>
);

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users, Plus, Loader2 } from 'lucide-react';
import { axiosInstance } from '../../baseurl/axiosInstance';

const Advisor = () => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form and editing states
  const [editingAdvisor, setEditingAdvisor] = useState(null);
  const [advisorToDelete, setAdvisorToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Fetch all advisors on component mount
  useEffect(() => {
    fetchAdvisors();
  }, []);

  const fetchAdvisors = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/adv');
      setAdvisors(response.data.data.rows);
    } catch (error) {
      console.error('Error fetching advisors:', error);
      alert('Failed to fetch advisors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setActionLoading(true);
      const response = await axiosInstance.post('/create-adv', formData);
      
      // Add new advisor to the list
      setAdvisors(prev => [...prev, response.data]);
      
      // Reset form and close dialog
      setFormData({ name: '', email: '', phone: '' });
      setCreateDialogOpen(false);
      
      alert('Advisor created successfully!');
    } catch (error) {
      console.error('Error creating advisor:', error);
      alert('Failed to create advisor. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (advisor) => {
    setEditingAdvisor(advisor);
    setFormData({
      name: advisor.name,
      email: advisor.email,
      phone: advisor.phone
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setActionLoading(true);
      const response = await axiosInstance.put(`/adv/${editingAdvisor.adv_id}`, formData);
      
      // Update advisor in the list
      setAdvisors(advisors.map(advisor => 
        advisor.id === editingAdvisor.id 
          ? { ...advisor, ...response.data }
          : advisor
      ));
      
      // Reset states and close dialog
      setEditDialogOpen(false);
      setEditingAdvisor(null);
      setFormData({ name: '', email: '', phone: '' });
      
      alert('Advisor updated successfully!');
    } catch (error) {
      console.error('Error updating advisor:', error);
      alert('Failed to update advisor. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (advisor) => {
    setAdvisorToDelete(advisor);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      await axiosInstance.delete(`/adv/${advisorToDelete.id}`);
      
      // Remove advisor from the list
      setAdvisors(advisors.filter(advisor => advisor.id !== advisorToDelete.id));
      
      // Reset states and close dialog
      setDeleteDialogOpen(false);
      setAdvisorToDelete(null);
      
      alert('Advisor deleted successfully!');
    } catch (error) {
      console.error('Error deleting advisor:', error);
      alert('Failed to delete advisor. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetCreateForm = () => {
    setFormData({ name: '', email: '', phone: '' });
    setCreateDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading advisors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Advisors Management</h1>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Advisor
          </Button>
        </div>
        <p className="text-gray-600">Manage your real estate advisors and their contact information</p>
        <Badge variant="secondary" className="mt-2">
          {advisors.length} Total Advisors
        </Badge>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Advisor Name</TableHead>
              <TableHead className="font-semibold">Email Address</TableHead>
              <TableHead className="font-semibold">Phone Number</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advisors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No advisors found. Add your first advisor to get started.
                </TableCell>
              </TableRow>
            ) : (
              advisors.map((advisor) => (
                <TableRow key={advisor.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{advisor.name}</TableCell>
                  <TableCell className="text-blue-600">{advisor.email}</TableCell>
                  <TableCell className="text-gray-600">{advisor.phone}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(advisor)}
                        disabled={actionLoading}
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(advisor)}
                        disabled={actionLoading}
                        className="hover:bg-red-50 hover:border-red-300 text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Add New Advisor</DialogTitle>
            <DialogDescription>
              Enter the new advisor's information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Name</Label>
              <Input
                id="create-name"
                placeholder="Enter advisor name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={actionLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={actionLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-phone">Phone Number</Label>
              <Input
                id="create-phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={actionLoading}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={resetCreateForm}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={actionLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Advisor'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Edit Advisor</DialogTitle>
            <DialogDescription>
              Update the advisor's information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter advisor name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={actionLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={actionLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={actionLoading}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={actionLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the advisor
              <strong className="text-gray-900"> {advisorToDelete?.name}</strong> from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Advisor'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Advisor;
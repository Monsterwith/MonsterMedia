import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllUsers, updateUser } from '@/lib/api';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { PencilIcon, Loader2, UserIcon, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function UserManagement() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Query to get all users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: getAllUsers,
  });
  
  // Mutation to update user
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: { isVip?: boolean, isAdmin?: boolean } }) => 
      updateUser(id, data),
    onSuccess: () => {
      toast({
        title: "User updated",
        description: "User details have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: (error as Error).message || "Could not update user",
        variant: "destructive",
      });
    },
  });
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };
  
  const handleSaveUser = () => {
    if (!selectedUser) return;
    
    updateUserMutation.mutate({
      id: selectedUser.id,
      data: {
        isVip: selectedUser.isVip,
        isAdmin: selectedUser.isAdmin,
      },
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p>Loading users...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-destructive p-4 border border-destructive rounded-md">
        <p>Error loading users: {(error as Error).message}</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2" size={20} />
          User Management
        </CardTitle>
        <CardDescription>
          Manage user accounts and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{user.username}</span>
                      {user.isAdmin && (
                        <Badge variant="secondary" className="text-primary">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isVip ? (
                      <Badge className="vip-badge text-white">
                        VIP
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Standard
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <PencilIcon size={16} className="mr-1" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {users && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user permissions and status
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="py-4 space-y-6">
                <div className="flex items-center gap-4">
                  <UserIcon size={40} className="text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold">{selectedUser.username}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isVip">VIP Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Grant access to exclusive content
                      </p>
                    </div>
                    <Switch
                      id="isVip"
                      checked={selectedUser.isVip}
                      onCheckedChange={(checked) => 
                        setSelectedUser({ ...selectedUser, isVip: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isAdmin">Admin Privileges</Label>
                      <p className="text-sm text-muted-foreground">
                        Full access to admin panel and settings
                      </p>
                    </div>
                    <Switch
                      id="isAdmin"
                      checked={selectedUser.isAdmin}
                      onCheckedChange={(checked) => 
                        setSelectedUser({ ...selectedUser, isAdmin: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveUser}
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Shield, ShieldCheck, RefreshCw } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { authService } from '../utils/authService';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  created_at: string;
}

export function UserManagementPanel() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Check if current user is admin
      const isAdmin = await authService.isAdmin();
      if (!isAdmin) {
        toast.error('Only admins can view user management');
        return;
      }

      // Fetch all users from user_profiles table
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, first_name, last_name, is_admin, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
        return;
      }

      setUsers(data || []);
      console.log('✅ Loaded users:', data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId: string, userName: string) => {
    if (!confirm(`Promote ${userName} to admin?`)) return;

    try {
      // Check if current user is admin
      const isAdmin = await authService.isAdmin();
      if (!isAdmin) {
        toast.error('Only admins can promote users');
        return;
      }

      // Update user profile to set is_admin to true
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_admin: true })
        .eq('id', userId);

      if (error) {
        console.error('Error promoting user:', error);
        toast.error(error.message || 'Failed to promote user');
        return;
      }

      toast.success(`${userName} promoted to admin!`);
      loadUsers(); // Reload the list
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and admin permissions</CardDescription>
          </div>
          <Button onClick={loadUsers} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {isLoading ? 'Loading users...' : 'No users found'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    {user.first_name || ''} {user.last_name || ''}
                  </TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <Badge variant="default" className="bg-purple-500">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary">User</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {!user.is_admin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handlePromoteToAdmin(
                            user.id,
                            `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'User'
                          )
                        }
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Make Admin
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from './UserManagement';
import VipRequests from './VipRequests';
import ThemeSettings from './ThemeSettings';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminPanelProps {
  defaultTab?: string;
}

export default function AdminPanel({ defaultTab = 'users' }: AdminPanelProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <Card className="my-8 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Shield size={20} />
            Access Denied
          </CardTitle>
          <CardDescription>
            You don't have permission to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This area is restricted to administrators only. If you believe this is a mistake, please contact support.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto my-8">
      <div className="flex items-center mb-6">
        <Shield className="text-accent mr-2" size={24} />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">
            Users
          </TabsTrigger>
          <TabsTrigger value="vip-requests">
            VIP Requests
          </TabsTrigger>
          <TabsTrigger value="theme">
            Theme Settings
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="users" className="mt-0">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="vip-requests" className="mt-0">
            <VipRequests />
          </TabsContent>
          
          <TabsContent value="theme" className="mt-0">
            <ThemeSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

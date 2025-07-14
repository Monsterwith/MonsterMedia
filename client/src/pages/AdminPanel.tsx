import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Crown, Settings, UserCheck, UserX, Shield, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  email: string;
  isVip: boolean;
  isAdmin: boolean;
  createdAt: string;
}

interface VipRequest {
  id: number;
  userId: number;
  email: string;
  reason: string;
  status: string;
  createdAt: string;
  user?: User;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  const usersQuery = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: () => apiRequest("/api/admin/users"),
  });

  // Fetch VIP requests
  const vipRequestsQuery = useQuery({
    queryKey: ["/api/admin/vip-requests"],
    queryFn: () => apiRequest("/api/admin/vip-requests"),
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (data: { userId: number; updates: Partial<User> }) =>
      apiRequest(`/api/admin/users/${data.userId}`, {
        method: "PATCH",
        body: JSON.stringify(data.updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success!",
        description: "User updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    },
  });

  // Update VIP request mutation
  const updateVipRequestMutation = useMutation({
    mutationFn: (data: { requestId: number; status: string }) =>
      apiRequest(`/api/admin/vip-requests/${data.requestId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: data.status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vip-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success!",
        description: "VIP request updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update VIP request",
        variant: "destructive",
      });
    },
  });

  const handlePromoteUser = (userId: number, isAdmin: boolean) => {
    updateUserMutation.mutate({
      userId,
      updates: { isAdmin: !isAdmin },
    });
  };

  const handleToggleVip = (userId: number, isVip: boolean) => {
    updateUserMutation.mutate({
      userId,
      updates: { isVip: !isVip },
    });
  };

  const handleVipRequest = (requestId: number, status: string) => {
    updateVipRequestMutation.mutate({ requestId, status });
  };

  const filteredUsers = usersQuery.data?.filter((user: User) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toString().includes(searchTerm)
  ) || [];

  const pendingVipRequests = vipRequestsQuery.data?.filter(
    (request: VipRequest) => request.status === "pending"
  ) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users, VIP requests, and system settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-semibold">Administrator</span>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="vip-requests" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            VIP Requests
            {pendingVipRequests.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingVipRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <div className="flex items-center gap-4">
                <Label htmlFor="search">Search Users:</Label>
                <Input
                  id="search"
                  placeholder="Search by username, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user: User) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                          ID:{user.id}
                        </span>
                        <span className="font-semibold">{user.username}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                      <div className="flex gap-2">
                        {user.isAdmin && (
                          <Badge variant="destructive">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {user.isVip && (
                          <Badge variant="default">
                            <Crown className="h-3 w-3 mr-1" />
                            VIP
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={user.isVip ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleVip(user.id, user.isVip)}
                        disabled={updateUserMutation.isPending}
                      >
                        {user.isVip ? (
                          <>
                            <UserX className="h-4 w-4 mr-1" />
                            Remove VIP
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-1" />
                            Grant VIP
                          </>
                        )}
                      </Button>
                      <Button
                        variant={user.isAdmin ? "destructive" : "secondary"}
                        size="sm"
                        onClick={() => handlePromoteUser(user.id, user.isAdmin)}
                        disabled={updateUserMutation.isPending || user.id === 1}
                      >
                        {user.isAdmin ? "Demote" : "Promote"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VIP Requests */}
        <TabsContent value="vip-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VIP Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVipRequests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No pending VIP requests
                  </p>
                ) : (
                  pendingVipRequests.map((request: VipRequest) => (
                    <div
                      key={request.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Request #{request.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {request.email} • {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">{request.status}</Badge>
                      </div>
                      <p className="text-sm">{request.reason}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleVipRequest(request.id, "approved")}
                          disabled={updateVipRequestMutation.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleVipRequest(request.id, "rejected")}
                          disabled={updateVipRequestMutation.isPending}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Management */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>External Content Sources</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage external content integration for your platform
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Music & Videos</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    YouTube integration for music and video content
                  </p>
                  <Badge variant="outline">YouTube API</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Anime</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    9animetv.to integration for anime content
                  </p>
                  <Badge variant="outline">9anime</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Manga</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Multiple manga sources for comprehensive coverage
                  </p>
                  <Badge variant="outline">Multiple Sources</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Backup Sources</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Fallback sources when primary sites are offline
                  </p>
                  <Badge variant="outline">Auto-Fallback</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Platform Name</Label>
                  <Input defaultValue="MONSTERWITH" className="mt-1" />
                </div>
                <div>
                  <Label>Default User Role</Label>
                  <Select defaultValue="user">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
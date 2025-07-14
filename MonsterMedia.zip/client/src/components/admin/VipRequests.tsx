import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getVipRequests, updateVipRequestStatus } from '@/lib/api';
import { VipRequest } from '@/lib/types';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, TicketIcon } from 'lucide-react';

export default function VipRequests() {
  const { toast } = useToast();
  const [activeStatus, setActiveStatus] = useState<string>('pending');
  
  // Query to get VIP requests
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['/api/admin/vip-requests', activeStatus],
    queryFn: () => getVipRequests(activeStatus),
  });
  
  // Mutation to update VIP request status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: 'approved' | 'rejected' }) => 
      updateVipRequestStatus(id, status),
    onSuccess: () => {
      toast({
        title: "Request updated",
        description: "VIP request status has been updated successfully.",
      });
      // Invalidate both VIP requests and users queries to reflect the updated data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vip-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: (error as Error).message || "Could not update request status",
        variant: "destructive",
      });
    },
  });
  
  const handleApprove = (requestId: number) => {
    updateStatusMutation.mutate({ id: requestId, status: 'approved' });
  };
  
  const handleReject = (requestId: number) => {
    updateStatusMutation.mutate({ id: requestId, status: 'rejected' });
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p>Loading VIP requests...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-destructive p-4 border border-destructive rounded-md">
        <p>Error loading VIP requests: {(error as Error).message}</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TicketIcon className="mr-2" size={20} />
          VIP Access Requests
        </CardTitle>
        <CardDescription>
          Review and manage requests for VIP access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatus('pending')}
          >
            Pending
          </Button>
          <Button
            variant={activeStatus === 'approved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatus('approved')}
          >
            Approved
          </Button>
          <Button
            variant={activeStatus === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatus('rejected')}
          >
            Rejected
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                {activeStatus === 'pending' && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests && requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{formatDate(request.createdAt)}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {request.reason || "No reason provided"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.status === 'pending' ? (
                      <Badge variant="outline">Pending</Badge>
                    ) : request.status === 'approved' ? (
                      <Badge variant="success" className="bg-green-600">Approved</Badge>
                    ) : (
                      <Badge variant="destructive">Rejected</Badge>
                    )}
                  </TableCell>
                  {activeStatus === 'pending' && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-500 hover:text-green-700 hover:bg-green-100/10"
                          onClick={() => handleApprove(request.id)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <CheckCircle size={16} />
                          <span className="ml-1">Approve</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleReject(request.id)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <XCircle size={16} />
                          <span className="ml-1">Reject</span>
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              
              {requests && requests.length === 0 && (
                <TableRow>
                  <TableCell 
                    colSpan={activeStatus === 'pending' ? 5 : 4} 
                    className="text-center py-8"
                  >
                    No {activeStatus} VIP requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

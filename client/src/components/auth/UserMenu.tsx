import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { ChevronDown, LogOut, User as UserIcon, Download, Heart, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [, navigate] = useLocation();
  const { setUser } = useAuth();
  const { toast } = useToast();
  
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate('/');
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: (error as Error).message || "Could not log out",
        variant: "destructive",
      });
    },
  });
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 px-2 py-1 h-auto">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{user.username}</span>
          {user.isVip && (
            <span className="hidden md:inline vip-badge text-xs px-2 py-0.5 rounded-full text-white">
              VIP
            </span>
          )}
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/downloads">
          <DropdownMenuItem className="cursor-pointer">
            <Download className="mr-2 h-4 w-4" />
            <span>My Downloads</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/favorites">
          <DropdownMenuItem className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Favorites</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        
        {!user.isVip && (
          <>
            <DropdownMenuSeparator />
            <Link href="/profile/vip">
              <DropdownMenuItem className="cursor-pointer">
                <span className="vip-badge text-xs px-2 py-0.5 rounded-full text-white mr-2">
                  VIP
                </span>
                <span>Get VIP Access</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}

        {user.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <Link href="/profile/admin">
              <DropdownMenuItem className="cursor-pointer text-accent">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

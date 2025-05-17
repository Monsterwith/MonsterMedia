import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { register } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export default function SignupForm({ onSuccess, onLoginClick }: SignupFormProps) {
  const { setUser } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const signupMutation = useMutation({
    mutationFn: (data: Omit<SignupFormValues, 'confirmPassword'>) => register(data),
    onSuccess: (user) => {
      setUser(user);
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: (error as Error).message || "Could not create account",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: SignupFormValues) => {
    const { confirmPassword, ...userData } = data;
    signupMutation.mutate(userData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Choose a username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Create a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? "Creating account..." : "Create Account"}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <a 
            href="#" 
            className="text-primary hover:text-secondary"
            onClick={(e) => {
              e.preventDefault();
              onLoginClick?.();
            }}
          >
            Login
          </a>
        </div>
      </form>
    </Form>
  );
}

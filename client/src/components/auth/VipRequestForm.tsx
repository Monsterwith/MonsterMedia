import { useMutation } from '@tanstack/react-query';
import { requestVip } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'wouter';

const vipRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  reason: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms',
  }),
});

type VipRequestFormValues = z.infer<typeof vipRequestSchema>;

interface VipRequestFormProps {
  onSuccess?: () => void;
  defaultEmail?: string;
}

export default function VipRequestForm({ onSuccess, defaultEmail = '' }: VipRequestFormProps) {
  const { toast } = useToast();
  
  const form = useForm<VipRequestFormValues>({
    resolver: zodResolver(vipRequestSchema),
    defaultValues: {
      email: defaultEmail,
      reason: '',
      termsAccepted: false,
    },
  });
  
  const vipRequestMutation = useMutation({
    mutationFn: (data: { email: string, reason?: string }) => requestVip(data),
    onSuccess: () => {
      toast({
        title: "VIP request submitted",
        description: "Your request has been submitted and will be reviewed by an admin.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Request failed",
        description: (error as Error).message || "Could not submit VIP request",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: VipRequestFormValues) => {
    const { termsAccepted, ...requestData } = data;
    vipRequestMutation.mutate(requestData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for VIP Request</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Why do you want VIP access? (optional)" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Tell us why you're interested in VIP access
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the <Link href="/terms"><a className="text-primary">Terms of Service</a></Link> and understand that VIP approval is at the discretion of the admin.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={vipRequestMutation.isPending}
        >
          {vipRequestMutation.isPending ? "Submitting..." : "Submit Request"}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          For any questions, contact admin at{' '}
          <a 
            href="mailto:admin@monsterwith.com" 
            className="text-primary hover:text-secondary"
          >
            admin@monsterwith.com
          </a>
        </div>
      </form>
    </Form>
  );
}

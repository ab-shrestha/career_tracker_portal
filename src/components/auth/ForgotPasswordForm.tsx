
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToSignIn }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await resetPassword(email);
    
    if (!error) {
      setIsSubmitted(true);
    }
    
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Check your email</h3>
        <p className="text-muted-foreground">
          We've sent a password reset link to your email address.
        </p>
        <Button type="button" onClick={onBackToSignIn} className="w-full">
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Sending link...' : 'Send reset link'}
      </Button>
      
      <Button type="button" variant="ghost" onClick={onBackToSignIn} className="w-full">
        Back to sign in
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;

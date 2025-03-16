
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignInFormProps {
  onSignUpClick: () => void;
  onForgotPasswordClick: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSignUpClick, onForgotPasswordClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      // Successful login will be handled by the auth state change
      setEmail('');
      setPassword('');
    }
    
    setIsLoading(false);
  };

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
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      
      <Button 
        type="button" 
        variant="link" 
        className="px-0" 
        onClick={onForgotPasswordClick}
      >
        Forgot password?
      </Button>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
      
      <div className="text-center mt-4">
        <span className="text-muted-foreground">Don't have an account?</span>{' '}
        <Button type="button" variant="link" className="px-1" onClick={onSignUpClick}>
          Sign up
        </Button>
      </div>
    </form>
  );
};

export default SignInForm;

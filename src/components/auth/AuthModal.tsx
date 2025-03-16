
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthView = 'signIn' | 'signUp' | 'forgotPassword';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: AuthView;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultView = 'signIn',
}) => {
  const [currentView, setCurrentView] = useState<AuthView>(defaultView);

  const handleViewChange = (view: AuthView) => {
    setCurrentView(view);
  };

  const getTitle = () => {
    switch (currentView) {
      case 'signIn':
        return 'Sign In';
      case 'signUp':
        return 'Create an Account';
      case 'forgotPassword':
        return 'Reset Password';
      default:
        return 'Authentication';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        {currentView === 'signIn' && (
          <SignInForm
            onSignUpClick={() => handleViewChange('signUp')}
            onForgotPasswordClick={() => handleViewChange('forgotPassword')}
          />
        )}
        {currentView === 'signUp' && (
          <SignUpForm onSignInClick={() => handleViewChange('signIn')} />
        )}
        {currentView === 'forgotPassword' && (
          <ForgotPasswordForm onBackToSignIn={() => handleViewChange('signIn')} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

// ===================================================================
// ACCESSIBLE COMPONENTS DEMO - Interactive showcase
// ===================================================================

import React, { useState } from 'react';
import {
  Button,
  FormField,
  Input,
  Alert,
  Modal,
  ToastProvider,
  useToast,
} from './accessible-components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

const AccessibleComponentsDemo: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputState, setInputState] = useState<'default' | 'valid' | 'invalid' | 'disabled'>('default');
  const { addToast } = useToast();

  const handleButtonClick = (variant: string) => {
    addToast({
      type: 'success',
      title: `${variant} button clicked!`,
      message: 'This demonstrates the accessible button component.',
      duration: 3000,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Simulate validation
    if (value.length === 0) {
      setInputState('default');
    } else if (value.length < 3) {
      setInputState('invalid');
    } else {
      setInputState('valid');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Accessible Components Demo</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Interactive showcase of fully accessible React components with proper ARIA labels, 
          keyboard navigation, focus management, and screen reader support.
        </p>
      </div>

      {/* Button Components */}
      <Card>
        <CardHeader>
          <CardTitle>Button Components</CardTitle>
          <CardDescription>
            Accessible buttons with different variants, loading states, and keyboard navigation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button
              variant={{ variant: 'primary', size: 'md' }}
              onClick={() => handleButtonClick('Primary')}
            >
              Primary Button
            </Button>
            
            <Button
              variant={{ variant: 'secondary', size: 'md' }}
              onClick={() => handleButtonClick('Secondary')}
            >
              Secondary Button
            </Button>
            
            <Button
              variant={{ variant: 'outline', size: 'md' }}
              onClick={() => handleButtonClick('Outline')}
            >
              Outline Button
            </Button>
            
            <Button
              variant={{ variant: 'ghost', size: 'md' }}
              onClick={() => handleButtonClick('Ghost')}
            >
              Ghost Button
            </Button>
            
            <Button
              variant={{ variant: 'destructive', size: 'md' }}
              onClick={() => handleButtonClick('Destructive')}
            >
              Destructive Button
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button
              variant={{ variant: 'primary', size: 'sm' }}
              onClick={() => handleButtonClick('Small')}
            >
              Small Button
            </Button>
            
            <Button
              variant={{ variant: 'primary', size: 'lg' }}
              onClick={() => handleButtonClick('Large')}
            >
              Large Button
            </Button>
            
            <Button
              variant={{ variant: 'primary', size: 'md' }}
              isLoading={true}
              loadingText="Loading..."
            >
              Loading Button
            </Button>
            
            <Button
              variant={{ variant: 'primary', size: 'md' }}
              disabled
            >
              Disabled Button
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Components */}
      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
          <CardDescription>
            Accessible form fields with proper labeling, validation states, and error messaging.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            label="Username"
            id="username"
            required
            hint="Enter your username (minimum 3 characters)"
            error={inputState === 'invalid' ? 'Username must be at least 3 characters' : undefined}
          >
            <Input
              value={inputValue}
              onChange={handleInputChange}
              state={{ state: inputState }}
              placeholder="Enter username"
              fullWidth
            />
          </FormField>
          
          <FormField
            label="Email Address"
            id="email"
            required
            hint="We'll never share your email with anyone else"
          >
            <Input
              type="email"
              state={{ state: 'default' }}
              placeholder="Enter email"
              fullWidth
            />
          </FormField>
          
          <FormField
            label="Password"
            id="password"
            required
          >
            <Input
              type="password"
              state={{ state: 'default' }}
              placeholder="Enter password"
              fullWidth
            />
          </FormField>
          
          <FormField
            label="Disabled Field"
            id="disabled"
          >
            <Input
              state={{ state: 'disabled' }}
              value="This field is disabled"
              fullWidth
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Alert Components */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Components</CardTitle>
          <CardDescription>
            Accessible alert notifications with different types and dismiss functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert
            variant={{ type: 'info' }}
            title="Information"
            onDismiss={() => addToast({ type: 'info', title: 'Alert dismissed' })}
          >
            This is an informational alert with dismiss functionality.
          </Alert>
          
          <Alert
            variant={{ 
              type: 'success', 
              action: { 
                label: 'View Details', 
                onClick: () => addToast({ type: 'success', title: 'Success action clicked' }) 
              } 
            }}
            title="Success!"
          >
            Your action completed successfully. You can view more details.
          </Alert>
          
          <Alert
            variant={{ type: 'warning' }}
            title="Warning"
          >
            Please review your settings before proceeding.
          </Alert>
          
          <Alert
            variant={{ 
              type: 'error', 
              retry: () => addToast({ type: 'info', title: 'Retrying...' }) 
            }}
            title="Error Occurred"
          >
            Something went wrong. Please try again.
          </Alert>
        </CardContent>
      </Card>

      {/* Modal Component */}
      <Card>
        <CardHeader>
          <CardTitle>Modal Component</CardTitle>
          <CardDescription>
            Accessible modal dialog with focus trap, keyboard navigation, and proper ARIA attributes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant={{ variant: 'primary', size: 'md' }}
            onClick={() => setModalOpen(true)}
          >
            Open Modal
          </Button>
          
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Accessible Modal Dialog"
            size="md"
          >
            <div className="space-y-4">
              <p>
                This is an accessible modal dialog with proper focus management, 
                keyboard navigation, and ARIA attributes.
              </p>
              
              <FormField
                label="Modal Input"
                id="modal-input"
                hint="Try tabbing through the modal elements"
              >
                <Input
                  placeholder="Focus trap demonstration"
                  fullWidth
                />
              </FormField>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant={{ variant: 'outline', size: 'md' }}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant={{ variant: 'primary', size: 'md' }}
                  onClick={() => {
                    addToast({ 
                      type: 'success', 
                      title: 'Modal action completed!',
                      message: 'The modal action was successful.' 
                    });
                    setModalOpen(false);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Modal>
        </CardContent>
      </Card>

      {/* Toast Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>
            Accessible toast notifications that appear in the top-right corner.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant={{ variant: 'primary', size: 'md' }}
              onClick={() => addToast({
                type: 'success',
                title: 'Success Toast',
                message: 'This is a success notification.',
              })}
            >
              Show Success Toast
            </Button>
            
            <Button
              variant={{ variant: 'secondary', size: 'md' }}
              onClick={() => addToast({
                type: 'info',
                title: 'Info Toast',
                message: 'This is an informational notification.',
              })}
            >
              Show Info Toast
            </Button>
            
            <Button
              variant={{ variant: 'outline', size: 'md' }}
              onClick={() => addToast({
                type: 'warning',
                title: 'Warning Toast',
                message: 'This is a warning notification.',
              })}
            >
              Show Warning Toast
            </Button>
            
            <Button
              variant={{ variant: 'destructive', size: 'md' }}
              onClick={() => addToast({
                type: 'error',
                title: 'Error Toast',
                message: 'This is an error notification.',
              })}
            >
              Show Error Toast
            </Button>
            
            <Button
              variant={{ variant: 'ghost', size: 'md' }}
              onClick={() => addToast({
                type: 'success',
                title: 'Interactive Toast',
                message: 'This toast has an action button.',
                action: {
                  label: 'Undo',
                  onClick: () => addToast({ type: 'info', title: 'Action clicked!' })
                }
              })}
            >
              Show Interactive Toast
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Features */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Features</CardTitle>
          <CardDescription>
            Summary of accessibility features implemented in these components.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Keyboard Navigation</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Tab/Shift+Tab for focus navigation</li>
                <li>• Enter/Space for button activation</li>
                <li>• Escape to close modals and alerts</li>
                <li>• Arrow keys for menu navigation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Screen Reader Support</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Proper ARIA labels and roles</li>
                <li>• Live regions for dynamic content</li>
                <li>• Descriptive error messages</li>
                <li>• Loading state announcements</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Focus Management</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Focus trap in modals</li>
                <li>• Focus restoration on close</li>
                <li>• Visible focus indicators</li>
                <li>• Skip to content links</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Visual Design</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• High contrast color ratios</li>
                <li>• Touch-friendly target sizes</li>
                <li>• Reduced motion support</li>
                <li>• Dark mode compatibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Wrapper component with ToastProvider
const AccessibleComponentsDemoWithProvider: React.FC = () => {
  return (
    <ToastProvider>
      <AccessibleComponentsDemo />
    </ToastProvider>
  );
};

export default AccessibleComponentsDemoWithProvider;
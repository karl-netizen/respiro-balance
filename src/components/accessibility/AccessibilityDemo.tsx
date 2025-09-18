// ===================================================================
// ACCESSIBILITY DEMO - Interactive showcase
// ===================================================================

import React, { useState } from 'react';
import {
  A11yButton,
  A11yFormField,
  A11yInput,
  A11yAlert,
  A11yModal,
  A11yToastProvider,
  useA11yToast,
} from './AccessibleComponents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayIcon, HeartIcon, ClockIcon } from 'lucide-react';

const AccessibilityDemoContent: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputState, setInputState] = useState<'default' | 'valid' | 'invalid' | 'disabled'>('default');
  const { addToast } = useA11yToast();

  const handleButtonClick = (variant: string) => {
    addToast({
      type: 'success',
      title: `${variant} button clicked!`,
      message: 'This demonstrates the accessible button component with proper ARIA labels and keyboard navigation.',
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
        <h1 className="text-4xl font-bold text-foreground">Accessibility Components Demo</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Interactive showcase of fully accessible React components with proper ARIA labels, 
          keyboard navigation, focus management, screen reader support, and seamless design system integration.
        </p>
      </div>

      {/* Button Components */}
      <Card>
        <CardHeader>
          <CardTitle>Accessible Button Components</CardTitle>
          <CardDescription>
            Buttons with full keyboard navigation, ARIA labels, loading states, and proper focus management.
            Try navigating with Tab and activating with Enter or Space.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <A11yButton
              variant="primary"
              size="md"
              onClick={() => handleButtonClick('Primary')}
              ariaLabel="Primary action button"
            >
              Primary Button
            </A11yButton>
            
            <A11yButton
              variant="secondary"
              size="md"
              onClick={() => handleButtonClick('Secondary')}
              leftIcon={<HeartIcon size={16} />}
            >
              With Icon
            </A11yButton>
            
            <A11yButton
              variant="outline"
              size="md"
              onClick={() => handleButtonClick('Outline')}
              rightIcon={<ClockIcon size={16} />}
            >
              Outline Button
            </A11yButton>
            
            <A11yButton
              variant="ghost"
              size="md"
              onClick={() => handleButtonClick('Ghost')}
            >
              Ghost Button
            </A11yButton>
            
            <A11yButton
              variant="destructive"
              size="md"
              onClick={() => handleButtonClick('Destructive')}
            >
              Destructive
            </A11yButton>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <A11yButton
              variant="primary"
              size="sm"
              onClick={() => handleButtonClick('Small')}
            >
              Small
            </A11yButton>
            
            <A11yButton
              variant="primary"
              size="lg"
              onClick={() => handleButtonClick('Large')}
            >
              Large Button
            </A11yButton>
            
            <A11yButton
              variant="primary"
              size="icon"
              onClick={() => handleButtonClick('Icon')}
              ariaLabel="Play media"
            >
              <PlayIcon size={16} />
            </A11yButton>
            
            <A11yButton
              variant="primary"
              size="md"
              isLoading={true}
              loadingText="Processing..."
              ariaLabel="Loading button demonstration"
            >
              Loading Button
            </A11yButton>
            
            <A11yButton
              variant="primary"
              size="md"
              disabled
              ariaLabel="Disabled button demonstration"
            >
              Disabled
            </A11yButton>
          </div>
        </CardContent>
      </Card>

      {/* Form Components */}
      <Card>
        <CardHeader>
          <CardTitle>Accessible Form Components</CardTitle>
          <CardDescription>
            Form fields with proper labeling, validation states, error messaging, and ARIA attributes.
            Screen readers will announce field requirements and validation errors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <A11yFormField
            label="Username"
            id="username"
            required
            hint="Enter your username (minimum 3 characters)"
            error={inputState === 'invalid' ? 'Username must be at least 3 characters long' : undefined}
          >
            <A11yInput
              value={inputValue}
              onChange={handleInputChange}
              state={inputState}
              placeholder="Enter username"
              fullWidth
            />
          </A11yFormField>
          
          <A11yFormField
            label="Email Address"
            id="email"
            required
            hint="We'll never share your email with anyone else"
          >
            <A11yInput
              type="email"
              state="default"
              placeholder="Enter email address"
              fullWidth
            />
          </A11yFormField>
          
          <A11yFormField
            label="Password"
            id="password"
            required
            hint="Must be at least 8 characters"
          >
            <A11yInput
              type="password"
              state="default"
              placeholder="Enter password"
              fullWidth
            />
          </A11yFormField>
          
          <A11yFormField
            label="Valid Input Example"
            id="valid-input"
          >
            <A11yInput
              state="valid"
              value="This input shows a valid state"
              fullWidth
              readOnly
            />
          </A11yFormField>
          
          <A11yFormField
            label="Disabled Field"
            id="disabled"
          >
            <A11yInput
              state="disabled"
              value="This field is disabled"
              fullWidth
            />
          </A11yFormField>
        </CardContent>
      </Card>

      {/* Alert Components */}
      <Card>
        <CardHeader>
          <CardTitle>Accessible Alert Components</CardTitle>
          <CardDescription>
            Alert notifications with proper ARIA roles, live regions, and dismiss functionality.
            Screen readers will announce these alerts automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <A11yAlert
            type="info"
            title="Information Alert"
            onDismiss={() => addToast({ type: 'info', title: 'Info alert dismissed' })}
          >
            This is an informational alert with dismiss functionality. It uses proper ARIA roles and live regions.
          </A11yAlert>
          
          <A11yAlert
            type="success"
            title="Success Alert"
            action={{ 
              label: 'View Details', 
              onClick: () => addToast({ type: 'success', title: 'Success action clicked' }) 
            }}
          >
            Your action completed successfully! This alert includes an interactive action button.
          </A11yAlert>
          
          <A11yAlert
            type="warning"
            title="Warning Alert"
          >
            Please review your settings before proceeding. This is a non-dismissible warning.
          </A11yAlert>
          
          <A11yAlert
            type="error"
            title="Error Alert"
            action={{ 
              label: 'Retry', 
              onClick: () => addToast({ type: 'info', title: 'Retrying operation...' }) 
            }}
          >
            Something went wrong with your request. Please try again or contact support.
          </A11yAlert>
        </CardContent>
      </Card>

      {/* Modal Component */}
      <Card>
        <CardHeader>
          <CardTitle>Accessible Modal Dialog</CardTitle>
          <CardDescription>
            Modal dialog with focus trap, keyboard navigation, proper ARIA attributes, and focus restoration.
            Try pressing Tab to navigate through focusable elements, and Escape to close.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <A11yButton
            variant="primary"
            size="md"
            onClick={() => setModalOpen(true)}
          >
            Open Accessible Modal
          </A11yButton>
          
          <A11yModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Accessible Modal Dialog"
            size="md"
          >
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This is an accessible modal dialog with proper focus management, 
                keyboard navigation, and ARIA attributes. Notice how:
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Focus is automatically moved to the modal when opened</li>
                <li>Tab navigation is trapped within the modal</li>
                <li>Escape key closes the modal</li>
                <li>Focus returns to the trigger button when closed</li>
                <li>Background is properly hidden from screen readers</li>
              </ul>
              
              <A11yFormField
                label="Modal Input Field"
                id="modal-input"
                hint="Try tabbing through all focusable elements"
              >
                <A11yInput
                  placeholder="Focus trap demonstration"
                  fullWidth
                />
              </A11yFormField>
              
              <div className="flex gap-2 justify-end pt-4">
                <A11yButton
                  variant="outline"
                  size="md"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </A11yButton>
                <A11yButton
                  variant="primary"
                  size="md"
                  onClick={() => {
                    addToast({ 
                      type: 'success', 
                      title: 'Modal action completed!',
                      message: 'The modal demonstrated proper accessibility features.' 
                    });
                    setModalOpen(false);
                  }}
                >
                  Confirm Action
                </A11yButton>
              </div>
            </div>
          </A11yModal>
        </CardContent>
      </Card>

      {/* Toast Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Accessible Toast Notifications</CardTitle>
          <CardDescription>
            Toast notifications with ARIA live regions that appear in the top-right corner.
            Screen readers will announce these notifications automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <A11yButton
              variant="primary"
              size="md"
              onClick={() => addToast({
                type: 'success',
                title: 'Success Notification',
                message: 'This is a success toast with proper ARIA live regions.',
              })}
            >
              Show Success Toast
            </A11yButton>
            
            <A11yButton
              variant="secondary"
              size="md"
              onClick={() => addToast({
                type: 'info',
                title: 'Information Toast',
                message: 'This provides helpful information to the user.',
              })}
            >
              Show Info Toast
            </A11yButton>
            
            <A11yButton
              variant="outline"
              size="md"
              onClick={() => addToast({
                type: 'warning',
                title: 'Warning Notification',
                message: 'This warns about a potential issue.',
              })}
            >
              Show Warning Toast
            </A11yButton>
            
            <A11yButton
              variant="destructive"
              size="md"
              onClick={() => addToast({
                type: 'error',
                title: 'Error Notification',
                message: 'This indicates an error has occurred.',
              })}
            >
              Show Error Toast
            </A11yButton>
            
            <A11yButton
              variant="ghost"
              size="md"
              onClick={() => addToast({
                type: 'success',
                title: 'Interactive Toast',
                message: 'This toast includes an action button.',
                action: {
                  label: 'Undo Action',
                  onClick: () => addToast({ type: 'info', title: 'Action was undone!' })
                }
              })}
            >
              Interactive Toast
            </A11yButton>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Features Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Features Implemented</CardTitle>
          <CardDescription>
            Comprehensive overview of accessibility features built into these components.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Keyboard Navigation</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Tab/Shift+Tab for focus navigation</li>
                <li>• Enter/Space for button activation</li>
                <li>• Escape to close modals and alerts</li>
                <li>• Arrow keys for component navigation</li>
                <li>• Focus traps in modal dialogs</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Screen Reader Support</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Proper ARIA labels and roles</li>
                <li>• Live regions for dynamic content</li>
                <li>• Descriptive error messages</li>
                <li>• Loading state announcements</li>
                <li>• Form field associations</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Focus Management</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Focus trap in modal dialogs</li>
                <li>• Focus restoration on close</li>
                <li>• Visible focus indicators</li>
                <li>• Logical tab order</li>
                <li>• Skip to content support</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Visual Design</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• High contrast color ratios</li>
                <li>• Touch-friendly target sizes</li>
                <li>• Reduced motion support</li>
                <li>• Dark mode compatibility</li>
                <li>• Semantic color meanings</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Form Accessibility</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Required field indicators</li>
                <li>• Error state communication</li>
                <li>• Help text associations</li>
                <li>• Validation feedback</li>
                <li>• Label-input relationships</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Interactive Feedback</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Loading state indicators</li>
                <li>• Success confirmations</li>
                <li>• Error notifications</li>
                <li>• Hover and focus states</li>
                <li>• Animation preferences</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Testing</CardTitle>
          <CardDescription>
            How to test these components for accessibility compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Manual Testing</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>1. Navigate using only the keyboard (Tab, Shift+Tab, Enter, Space, Escape)</li>
                <li>2. Test with screen readers (NVDA, JAWS, VoiceOver)</li>
                <li>3. Verify focus indicators are clearly visible</li>
                <li>4. Check color contrast ratios meet WCAG standards</li>
                <li>5. Test with browser zoom up to 200%</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Automated Testing</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Use axe-core for accessibility violations</li>
                <li>• Lighthouse accessibility audit</li>
                <li>• Jest with jest-axe for unit tests</li>
                <li>• Playwright for end-to-end testing</li>
                <li>• Color contrast analyzers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Wrapper component with Toast Provider
const AccessibilityDemo: React.FC = () => {
  return (
    <A11yToastProvider>
      <AccessibilityDemoContent />
    </A11yToastProvider>
  );
};

export default AccessibilityDemo;
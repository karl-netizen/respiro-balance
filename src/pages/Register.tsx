import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(
    localStorage.getItem('respiro-demo-mode') === 'true'
  );
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleDemoToggle = (checked: boolean) => {
    setIsDemo(checked);
    localStorage.setItem('respiro-demo-mode', checked.toString());
    toast.success(`Switched to ${checked ? 'Demo' : 'Live'} Mode`, {
      description: checked ? "Ready for instant demo access" : "Ready for real account creation"
    });
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    toast.success("Welcome to Demo Mode!", {
      description: "Accessing premium features with sample data"
    });
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signUp(email, password, {
        data: {
          full_name: fullName,
        },
        redirectTo: `${window.location.origin}/dashboard`,
      });

      toast.success("Account created! Check your email to verify.");
      navigate('/login');
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {/* DEMO/LIVE MODE TOGGLE */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-700">Mode:</span>
                  <Badge 
                    variant={isDemo ? "default" : "secondary"} 
                    className={`text-xs ${isDemo ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {isDemo ? "🎭 DEMO" : "🔐 LIVE"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium transition-colors ${!isDemo ? "text-blue-600" : "text-gray-500"}`}>
                    Live
                  </span>
                  <Switch
                    checked={isDemo}
                    onCheckedChange={handleDemoToggle}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className={`text-sm font-medium transition-colors ${isDemo ? "text-blue-600" : "text-gray-500"}`}>
                    Demo
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                {isDemo 
                  ? "🎭 Demo mode: Instant access with premium features and sample meditation data. Perfect for testing and presentations!"
                  : "🔐 Live mode: Create a real account with email verification and personal progress tracking."
                }
              </p>
              
              {/* DEMO LOGIN BUTTON - Only show in demo mode */}
              {isDemo && (
                <Button
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  {isLoading ? "Entering Demo..." : "🎭 Enter Demo Mode - Instant Access"}
                </Button>
              )}
            </div>

            {/* EXISTING "Create Account" FORM - Only show in Live mode */}
            {!isDemo && (
              <div>
                <CardHeader className="text-center px-0 pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
                  <p className="text-gray-600">Join Respiro Balance and start your wellness journey</p>
                </CardHeader>
                
                {error && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <TouchFriendlyButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </TouchFriendlyButton>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;

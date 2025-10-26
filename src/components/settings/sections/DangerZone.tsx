
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const DangerZone = () => {
  const [confirmDeletion, setConfirmDeletion] = useState('');

  const handleDeleteAccount = () => {
    if (confirmDeletion === 'DELETE') {
      // Mock deletion - in real implementation, this would call an API
      toast.success("Account deletion initiated. You will receive an email confirmation.");
      setConfirmDeletion('');
    } else {
      toast.error("Please type DELETE to confirm account deletion");
    }
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 mb-4">
            <strong>Warning:</strong> Account deletion is permanent and cannot be undone. This will immediately delete all your data including meditation history, progress, achievements, and preferences.
          </p>
          <div className="space-y-3">
            <div>
              <Label htmlFor="confirm-deletion">Type "DELETE" to confirm</Label>
              <Input
                id="confirm-deletion"
                value={confirmDeletion}
                onChange={(e) => setConfirmDeletion(e.target.value)}
                placeholder="Type DELETE here"
                className="mt-1"
              />
            </div>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={confirmDeletion !== 'DELETE'}
              className="w-full"
            >
              Delete My Account Permanently
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZone;

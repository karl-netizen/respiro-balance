
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const DataManagement = () => {
  const handleExportData = (format: 'json' | 'csv') => {
    // Mock data export - in real implementation, this would call an API
    const mockData = {
      profile: { email: 'user@example.com', firstName: 'User', lastName: 'Name' },
      sessions: 127,
      focusTime: 42,
      streak: 7,
      achievements: 15,
      exportDate: new Date().toISOString()
    };

    const dataStr = format === 'json' 
      ? JSON.stringify(mockData, null, 2)
      : Object.entries(mockData).map(([key, value]) => `${key},${value}`).join('\n');
    
    const blob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `respiro-data.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Data exported as ${format.toUpperCase()}`);
  };

  const handleResetProgress = () => {
    // Mock reset - in real implementation, this would call an API
    toast.success("Progress reset successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Management
        </CardTitle>
        <CardDescription>
          Export your data or manage your account progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Export Your Data</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Download a complete copy of your meditation and focus session history, achievements, and progress metrics.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExportData('json')}>
              <Download className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>
            <Button variant="outline" onClick={() => handleExportData('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3">Progress Management</h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All Progress
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset All Progress</DialogTitle>
                <DialogDescription>
                  This will permanently delete all your meditation sessions, focus data, achievements, and streaks. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={handleResetProgress}>
                  Reset Progress
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataManagement;

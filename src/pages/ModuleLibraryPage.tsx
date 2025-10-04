import { ModuleLibrary } from '@/components/modules/ModuleLibrary';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from 'react-error-boundary';
import { Card, CardContent } from '@/components/ui/card';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-5xl">⚠️</div>
            <h2 className="text-2xl font-bold">Module Library Error</h2>
            <p className="text-muted-foreground">
              {error.message}
            </p>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto text-left">
              {error.stack}
            </pre>
            <Button onClick={resetErrorBoundary} className="w-full">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ModuleLibraryPage() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => navigate('/dashboard')}
    >
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <ModuleLibrary />
        </div>
      </div>
    </ErrorBoundary>
  );
}

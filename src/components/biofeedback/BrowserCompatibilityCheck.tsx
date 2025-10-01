import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Copy, Chrome, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface BrowserInfo {
  name: string;
  supported: boolean;
}

export const BrowserCompatibilityCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo>({ name: 'Unknown', supported: false });

  const detectBrowser = (): BrowserInfo => {
    const userAgent = navigator.userAgent.toLowerCase();
    const info: BrowserInfo = { name: 'Unknown', supported: false };

    if (userAgent.includes('messenger')) {
      info.name = 'Facebook Messenger In-App Browser';
    } else if (userAgent.includes('instagram')) {
      info.name = 'Instagram In-App Browser';
    } else if (userAgent.includes('snapchat')) {
      info.name = 'Snapchat In-App Browser';
    } else if (userAgent.includes('twitter') || userAgent.includes('twitterandroid')) {
      info.name = 'Twitter In-App Browser';
    } else if (userAgent.includes('linkedin')) {
      info.name = 'LinkedIn In-App Browser';
    } else if (userAgent.includes('fbav') || userAgent.includes('fban')) {
      info.name = 'Facebook In-App Browser';
    } else if (userAgent.includes('whatsapp')) {
      info.name = 'WhatsApp In-App Browser';
    } else if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      info.name = 'Google Chrome';
      info.supported = true;
    } else if (userAgent.includes('edg')) {
      info.name = 'Microsoft Edge';
      info.supported = true;
    } else if (userAgent.includes('opera') || userAgent.includes('opr')) {
      info.name = 'Opera';
      info.supported = true;
    } else if (userAgent.includes('firefox')) {
      info.name = 'Firefox';
      info.supported = false;
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      info.name = 'Safari';
      info.supported = false;
    }

    return info;
  };

  const checkBluetoothSupport = () => {
    const browser = detectBrowser();
    const hasBluetoothAPI = 'bluetooth' in navigator;
    
    setBrowserInfo(browser);
    setIsSupported(hasBluetoothAPI && browser.supported);
  };

  useEffect(() => {
    checkBluetoothSupport();
  }, []);

  const copyCurrentUrl = async () => {
    const url = window.location.href;
    
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const openInChrome = () => {
    const url = window.location.href;
    window.location.href = 'googlechrome://' + url.replace(/^https?:\/\//, '');
    
    setTimeout(() => {
      toast.info('If Chrome didn\'t open, please copy the URL and open it manually');
    }, 1000);
  };

  const openInEdge = () => {
    const url = window.location.href;
    window.location.href = 'microsoft-edge:' + url;
    
    setTimeout(() => {
      toast.info('If Edge didn\'t open, please copy the URL and open it manually');
    }, 1000);
  };

  if (isSupported === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary via-primary-glow to-accent">
        <div className="max-w-lg w-full">
          <Card className="shadow-elegant">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Bluetooth Not Supported</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Your browser doesn't support Web Bluetooth API.
              </p>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                <p className="text-sm">
                  <strong className="text-warning">Current Browser:</strong> {browserInfo.name}
                </p>
              </div>

              <div className="bg-info/10 border-l-4 border-info rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-info flex items-center gap-2">
                  📱 How to Open in Supported Browser:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Copy the URL from the address bar</li>
                  <li>Open Chrome or Edge browser</li>
                  <li>Paste the URL and press Enter</li>
                  <li>Allow Bluetooth permissions when prompted</li>
                </ol>
              </div>

              <Button onClick={copyCurrentUrl} className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy URL to Clipboard
              </Button>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Supported Browsers:</h3>
                <div className="space-y-2">
                  <Button variant="outline" onClick={openInChrome} className="w-full justify-start">
                    <Chrome className="h-4 w-4 mr-2" />
                    Google Chrome
                  </Button>
                  <Button variant="outline" onClick={openInEdge} className="w-full justify-start">
                    <Chrome className="h-4 w-4 mr-2" />
                    Microsoft Edge
                  </Button>
                  <Button variant="outline" onClick={copyCurrentUrl} className="w-full justify-start">
                    <Chrome className="h-4 w-4 mr-2" />
                    Opera Browser
                  </Button>
                </div>
              </div>

              <Button variant="secondary" onClick={checkBluetoothSupport} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

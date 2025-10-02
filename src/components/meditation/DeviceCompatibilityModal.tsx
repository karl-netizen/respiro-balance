import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Clock, CheckCircle, Info } from 'lucide-react';

interface DeviceCompatibilityModalProps {
  onClose: () => void;
}

export const DeviceCompatibilityModal: React.FC<DeviceCompatibilityModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" 
      onClick={onClose}
    >
      <Card 
        className="max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">Device Compatibility Guide</h2>
            <button 
              onClick={onClose} 
              className="text-muted-foreground hover:text-foreground text-2xl"
            >
              ×
            </button>
          </div>

          {/* Real-time Bluetooth Devices */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-success" size={24} />
              <h3 className="text-xl font-bold">Real-Time Bluetooth Devices</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              These devices connect directly via Bluetooth for instant heart rate updates:
            </p>
            
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              {[
                { name: 'Polar H10', price: '$90', rating: '⭐ Best for accuracy' },
                { name: 'Polar H9', price: '$60', rating: '⭐ Budget friendly' },
                { name: 'Garmin HRM-Dual', price: '$70', rating: '⭐ Dual connectivity' },
                { name: 'Wahoo TICKR', price: '$50', rating: '⭐ Popular choice' },
                { name: 'CooSpo H6', price: '$30', rating: '⭐ Most affordable' },
                { name: 'Suunto Smart Sensor', price: '$80', rating: '⭐ Premium quality' }
              ].map((device, i) => (
                <div key={i} className="bg-success/10 border-2 border-success/20 rounded-lg p-4">
                  <div className="font-semibold">{device.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {device.price} • {device.rating}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-success/10 p-4 rounded-lg">
              <div className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle size={18} />
                Why Choose Bluetooth?
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Instant heart rate updates (no delay)</li>
                <li>Perfect for meditation and breathing exercises</li>
                <li>No account or app required</li>
                <li>Most chest straps are very accurate</li>
              </ul>
            </div>
          </div>

          {/* Fitbit Devices */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-primary" size={24} />
              <h3 className="text-xl font-bold">Fitbit Devices (API Sync)</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Fitbit devices sync through the Fitbit app with a slight delay:
            </p>
            
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              {[
                'Fitbit Inspire 2/3',
                'Fitbit Charge 5/6',
                'Fitbit Versa 3/4',
                'Fitbit Sense 1/2'
              ].map((device, i) => (
                <div key={i} className="bg-primary/10 border-2 border-primary/20 rounded-lg p-4">
                  <div className="font-semibold">{device}</div>
                  <div className="text-sm text-muted-foreground">
                    API Sync • ~15-30s delay
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-warning/10 border-l-4 border-warning p-4 rounded">
              <div className="font-semibold mb-2 flex items-center gap-2">
                <Info size={18} />
                Important Note
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fitbit requires official app sync (15-30 second delay)</li>
                <li>• Requires Fitbit account and OAuth authentication</li>
                <li>• Not ideal for real-time meditation guidance</li>
                <li>• Good for session tracking and history</li>
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-3">💡 Our Recommendation</h3>
            <p className="text-muted-foreground mb-3">
              For the best meditation experience with real-time breathing guidance, we recommend a{' '}
              <strong>Bluetooth chest strap</strong> like the Polar H10 or CooSpo H6.
            </p>
            <div className="bg-card p-4 rounded-lg">
              <div className="font-semibold mb-2">Why chest straps?</div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>More accurate than wrist-based monitors</li>
                <li>Instant real-time data (no delay)</li>
                <li>Better for detecting HRV and meditation states</li>
                <li>Affordable ($30-90)</li>
              </ul>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="w-full mt-6"
          >
            Got it, thanks!
          </Button>
        </div>
      </Card>
    </div>
  );
};

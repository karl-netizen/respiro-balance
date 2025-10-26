import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Bluetooth, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Zap,
  BookOpen,
  BarChart,
  Lock,
  Rocket,
  HelpCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SetupGuidePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
            <Heart size={48} />
            Respiro Balance - Complete Setup Guide
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Heart rate meditation monitor with real-time biofeedback
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/meditation-monitor')}
            >
              Start Now <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 hover:bg-white/20"
            >
              Watch Demo <ExternalLink className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Quick Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={24} />
              Quick Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="#compatibility" className="p-4 bg-accent/50 rounded-lg hover:bg-accent transition">
                <div className="font-semibold mb-1">📱 Device Compatibility</div>
                <div className="text-sm text-muted-foreground">Find your device</div>
              </a>
              <a href="#quickstart" className="p-4 bg-accent/50 rounded-lg hover:bg-accent transition">
                <div className="font-semibold mb-1">🚀 Quick Start</div>
                <div className="text-sm text-muted-foreground">Setup in 5 minutes</div>
              </a>
              <a href="#troubleshooting" className="p-4 bg-accent/50 rounded-lg hover:bg-accent transition">
                <div className="font-semibold mb-1">🔧 Troubleshooting</div>
                <div className="text-sm text-muted-foreground">Common issues</div>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Device Compatibility */}
        <div id="compatibility">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Bluetooth size={32} />
            Device Compatibility
          </h2>

          <Tabs defaultValue="bluetooth" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bluetooth">
                <Zap className="mr-2" size={16} />
                Bluetooth (Recommended)
              </TabsTrigger>
              <TabsTrigger value="fitbit">
                <Clock className="mr-2" size={16} />
                Fitbit API
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bluetooth" className="space-y-4">
              <Card className="border-success/50">
                <CardHeader>
                  <CardTitle className="text-success flex items-center gap-2">
                    <CheckCircle size={24} />
                    Recommended: Bluetooth Heart Rate Monitors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-success/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Why Bluetooth Chest Straps?</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="mt-0.5 text-success flex-shrink-0" />
                        <span><strong>Real-time data</strong> - No delay, perfect for breathing exercises</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="mt-0.5 text-success flex-shrink-0" />
                        <span><strong>High accuracy</strong> - More accurate than wrist monitors (95-99%)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="mt-0.5 text-success flex-shrink-0" />
                        <span><strong>Better HRV detection</strong> - Essential for meditation analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={16} className="mt-0.5 text-success flex-shrink-0" />
                        <span><strong>No account needed</strong> - Direct connection via Web Bluetooth</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Premium Options ($70-90)</h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      {[
                        { name: 'Polar H10', price: '$90', desc: 'Medical-grade accuracy, best overall' },
                        { name: 'Garmin HRM-Dual', price: '$70', desc: 'Dual Bluetooth/ANT+' },
                        { name: 'Suunto Smart Sensor', price: '$80', desc: 'Premium build quality' }
                      ].map((device, i) => (
                        <Card key={i} className="bg-accent/30">
                          <CardContent className="p-4">
                            <div className="font-semibold">{device.name}</div>
                            <div className="text-primary font-bold">{device.price}</div>
                            <div className="text-sm text-muted-foreground mt-1">{device.desc}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Budget-Friendly Options ($30-60)</h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      {[
                        { name: 'CooSpo H6', price: '$30', desc: 'Best value' },
                        { name: 'Polar H9', price: '$60', desc: 'Affordable Polar quality' },
                        { name: 'Wahoo TICKR', price: '$50', desc: 'Popular choice' }
                      ].map((device, i) => (
                        <Card key={i} className="bg-accent/30">
                          <CardContent className="p-4">
                            <div className="font-semibold">{device.name}</div>
                            <div className="text-primary font-bold">{device.price}</div>
                            <div className="text-sm text-muted-foreground mt-1">{device.desc}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fitbit" className="space-y-4">
              <Card className="border-warning/50">
                <CardHeader>
                  <CardTitle className="text-warning flex items-center gap-2">
                    <AlertCircle size={24} />
                    Fitbit Devices (API Sync - 15-30s Delay)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-warning/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Important Limitations</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Clock size={16} className="mt-0.5 text-warning flex-shrink-0" />
                        <span><strong>15-30 second sync delay</strong> - Not ideal for real-time meditation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock size={16} className="mt-0.5 text-warning flex-shrink-0" />
                        <span><strong>Requires Fitbit account</strong> - OAuth authentication needed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 text-warning flex-shrink-0" />
                        <span><strong>Complex setup</strong> - API keys and developer account required</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Compatible Models</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        'Fitbit Inspire 2 & 3',
                        'Fitbit Charge 5 & 6',
                        'Fitbit Versa 3 & 4',
                        'Fitbit Sense 1 & 2'
                      ].map((device, i) => (
                        <div key={i} className="bg-accent/30 p-3 rounded-lg">
                          <div className="font-semibold">{device}</div>
                          <div className="text-xs text-muted-foreground">API Sync • ~15-30s delay</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Info size={18} />
                        Why the Delay?
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Fitbit uses proprietary Bluetooth protocols and doesn't broadcast standard Heart Rate Service (0x180D). 
                        Data must sync through Fitbit app first, then accessed via Web API.
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Start Guide */}
        <div id="quickstart">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Rocket size={32} />
            Quick Start Guide
          </h2>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Option 1: Bluetooth Device (Recommended)</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Prepare Your Device</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Wear chest strap (wet sensors with water)</li>
                        <li>• Turn on device (if it has a button)</li>
                        <li>• Device should enter pairing mode automatically</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Open Respiro Balance</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Use Chrome, Edge, or Opera browser</li>
                        <li>• Ensure HTTPS (required for Bluetooth)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Connect</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Click "Connect Device" button</li>
                        <li>• Select "Bluetooth Device"</li>
                        <li>• Choose your device from the list</li>
                        <li>• Grant Bluetooth permission</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Start Meditating</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Click "Start Session"</li>
                        <li>• Follow real-time breathing guidance</li>
                        <li>• Track your meditation state</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full md:w-auto"
                  onClick={() => navigate('/meditation-monitor')}
                >
                  Try It Now <ArrowRight className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Browser Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-success flex items-center gap-2">
                  <CheckCircle size={20} />
                  Supported Browsers
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">✓</Badge>
                    Google Chrome (recommended)
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">✓</Badge>
                    Microsoft Edge
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">✓</Badge>
                    Opera Browser
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-destructive flex items-center gap-2">
                  <AlertCircle size={20} />
                  Not Supported
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="border-destructive text-destructive">✗</Badge>
                    Safari (no Web Bluetooth)
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="border-destructive text-destructive">✗</Badge>
                    Firefox (limited support)
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="border-destructive text-destructive">✗</Badge>
                    In-app browsers
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Understanding Meditation States */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart size={24} />
              Understanding Meditation States
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { state: 'Warming Up', color: 'bg-muted', desc: 'Initial phase, establishing baseline' },
                { state: 'Focused', color: 'bg-green-500/20', desc: 'Steady heart rate, good attention' },
                { state: 'Relaxed', color: 'bg-blue-500/20', desc: 'Decreasing HR, good HRV' },
                { state: 'Deep Meditation', color: 'bg-purple-500/20', desc: 'Low HR, high HRV, perfect state!' },
                { state: 'Active', color: 'bg-orange-500/20', desc: 'Elevated HR, may need refocusing' }
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-lg ${item.color}`}>
                  <div className="font-semibold">{item.state}</div>
                  <div className="text-sm text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <div id="troubleshooting">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <HelpCircle size={32} />
            Troubleshooting
          </h2>

          <Tabs defaultValue="bluetooth-issues">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bluetooth-issues">Bluetooth</TabsTrigger>
              <TabsTrigger value="browser-issues">Browser</TabsTrigger>
              <TabsTrigger value="fitbit-issues">Fitbit</TabsTrigger>
            </TabsList>

            <TabsContent value="bluetooth-issues">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Device Not Found</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>✓ Ensure device is on and in pairing mode</li>
                      <li>✓ Check device is within 10 meters</li>
                      <li>✓ Unpair from other devices first</li>
                      <li>✓ Try wetting chest strap sensors</li>
                      <li>✓ Replace battery if needed</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Connection Drops</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>✓ Move closer to computer/phone</li>
                      <li>✓ Check for interference (microwaves, WiFi routers)</li>
                      <li>✓ Ensure device battery isn't low</li>
                      <li>✓ Refresh browser and reconnect</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">No Heart Rate Data</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>✓ Ensure chest strap is snug but comfortable</li>
                      <li>✓ Wet the sensors with water or saliva</li>
                      <li>✓ Verify device is properly worn</li>
                      <li>✓ Check battery level</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="browser-issues">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">"Bluetooth Not Supported" Error</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>✓ Use Chrome, Edge, or Opera</li>
                      <li>✓ Close in-app browser, open in system browser</li>
                      <li>✓ Ensure HTTPS (required for Bluetooth)</li>
                      <li>✓ Update browser to latest version</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Can't Find Device</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>✓ Grant Bluetooth permissions when prompted</li>
                      <li>✓ Enable Bluetooth on computer/phone</li>
                      <li>✓ Check browser has Bluetooth access in system settings</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fitbit-issues">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Authentication Failed</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>✓ Verify Client ID is correct</li>
                      <li>✓ Check redirect URI matches exactly</li>
                      <li>✓ Ensure Fitbit account is active</li>
                      <li>✓ Grant all requested permissions</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">No Data Updating</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>✓ Ensure Fitbit device synced recently</li>
                      <li>✓ Check Fitbit app is syncing</li>
                      <li>✓ Verify heart rate permission granted</li>
                      <li>✓ Wait 30 seconds for sync cycle</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                q: 'Can I use my Apple Watch?',
                a: 'Not directly via Bluetooth. Apple Watch uses proprietary protocols. You\'d need to use HealthKit API on iOS.'
              },
              {
                q: 'Why not Fitbit via Bluetooth?',
                a: 'Fitbit uses custom encrypted Bluetooth that only works with their official app. You must use their Web API.'
              },
              {
                q: 'Is a chest strap uncomfortable?',
                a: 'Modern straps are lightweight and comfortable. You\'ll forget you\'re wearing it after a few minutes.'
              },
              {
                q: 'How accurate are chest straps vs. wrist monitors?',
                a: 'Chest straps are significantly more accurate (95-99% vs 85-90%) because they directly measure electrical heart activity.'
              },
              {
                q: 'Do I need an account?',
                a: 'No for Bluetooth devices. Yes for Fitbit API.'
              },
              {
                q: 'Does this work on mobile?',
                a: 'Yes! Chrome on Android fully supports Web Bluetooth. iOS Safari does not support Web Bluetooth.'
              }
            ].map((faq, i) => (
              <div key={i} className="border-b pb-4 last:border-0">
                <h4 className="font-semibold mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ready to Start */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-8 text-center">
            <Heart className="mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-2">
              Ready to Begin Your Meditation Journey?
            </h2>
            <p className="opacity-90 mb-6">
              Connect your device and start your first session
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/meditation-monitor')}
            >
              Start Now <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupGuidePage;

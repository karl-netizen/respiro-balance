
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Navigate } from 'react-router-dom';
import ExpertDirectory from '@/components/premium-plus/ExpertDirectory';
import SessionBooking from '@/components/premium-plus/SessionBooking';
import BiofeedbackCoaching from '@/components/premium-plus/BiofeedbackCoaching';
import MasterclassSystem from '@/components/premium-plus/MasterclassSystem';
import WhiteLabelCustomization from '@/components/premium-plus/WhiteLabelCustomization';
import ComprehensiveWellnessDashboard from '@/components/premium-plus/ComprehensiveWellnessDashboard';
import { Expert } from '@/types/experts';

const PremiumPlusPage: React.FC = () => {
  const { currentTier } = useFeatureAccess();
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  // Redirect if not Premium Plus user
  if (currentTier !== 'premium_plus') {
    return <Navigate to="/subscription" />;
  }

  const handleBookSession = (expert: Expert) => {
    setSelectedExpert(expert);
    setShowBooking(true);
  };

  const handleBookingComplete = (bookingDetails: any) => {
    console.log('Booking completed:', bookingDetails);
    // Handle booking completion
  };

  const handleBookingClose = () => {
    setSelectedExpert(null);
    setShowBooking(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Premium Plus Features
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Access our most advanced features including expert sessions, biofeedback coaching, 
              exclusive masterclasses, and comprehensive wellness tracking.
            </p>
          </div>

          <Tabs defaultValue="experts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="experts">Expert Sessions</TabsTrigger>
              <TabsTrigger value="biofeedback">Biofeedback</TabsTrigger>
              <TabsTrigger value="masterclass">Masterclasses</TabsTrigger>
              <TabsTrigger value="wellness">Wellness Hub</TabsTrigger>
              <TabsTrigger value="whitelabel">White-label</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="experts">
              <ExpertDirectory onBookSession={handleBookSession} />
            </TabsContent>

            <TabsContent value="biofeedback">
              <BiofeedbackCoaching />
            </TabsContent>

            <TabsContent value="masterclass">
              <MasterclassSystem />
            </TabsContent>

            <TabsContent value="wellness">
              <ComprehensiveWellnessDashboard />
            </TabsContent>

            <TabsContent value="whitelabel">
              <WhiteLabelCustomization />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">Advanced Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Comprehensive analytics and reporting features are in development.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Session Booking Modal */}
      {selectedExpert && (
        <SessionBooking
          expert={selectedExpert}
          isOpen={showBooking}
          onClose={handleBookingClose}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
};

export default PremiumPlusPage;

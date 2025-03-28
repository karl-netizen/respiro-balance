
import { Helmet } from 'react-helmet';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ClockIcon } from "lucide-react";

const TimeManagement = () => {
  return (
    <>
      <Helmet>
        <title>Time Management | Respiro Balance</title>
        <meta name="description" content="Manage your time effectively with the 1000-Hour Method" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center max-w-lg px-4">
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <ClockIcon className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Time Management Coming Soon</h1>
            <p className="text-lg text-muted-foreground mb-6">
              We're working on building powerful time management tools to help you balance your work and life more effectively.
            </p>
            <Button size="lg" variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TimeManagement;

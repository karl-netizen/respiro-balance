
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TimeManagementCenter from "@/components/time-management/TimeManagementCenter";

const TimeManagement = () => {
  return (
    <>
      <Helmet>
        <title>Time Management | Respiro Balance</title>
        <meta name="description" content="Manage your time effectively with the 1000-Hour Method" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-24">
          <TimeManagementCenter />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TimeManagement;


import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16 px-4">
        <div className="max-w-4xl mx-auto prose">
          <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
          
          <p className="lead">
            At Respiro Balance, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>
          
          <h2>Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when registering for an account, creating or modifying your profile, setting preferences, or signing up for features or services.
          </p>
          <p>
            This may include:
          </p>
          <ul>
            <li>Personal information such as your name and email address</li>
            <li>Account credentials</li>
            <li>Profile information</li>
            <li>Usage data and preferences</li>
            <li>Biometric data (if you choose to connect with wearable devices)</li>
          </ul>
          
          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Personalize your experience</li>
            <li>Monitor and analyze trends, usage, and activities</li>
          </ul>
          
          <h2>Data Storage and Security</h2>
          <p>
            We use commercially reasonable safeguards to help keep the information collected secure and take reasonable steps to verify your identity before granting you access to your account.
          </p>
          
          <h2>Third-Party Services</h2>
          <p>
            Our application may contain links to third-party websites and services. We are not responsible for the practices employed by these third parties, and we encourage you to read their privacy policies.
          </p>
          
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@respirobalance.com.
          </p>
          
          <p className="text-sm text-muted-foreground text-center mt-10">
            Last Updated: June 15, 2023
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPage;

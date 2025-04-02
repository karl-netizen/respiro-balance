
import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Printer, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMeditationStats } from './useMeditationStats';
import { useAuth } from "@/hooks/useAuth";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ShareableReport = () => {
  const { meditationStats } = useMeditationStats();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('meditation-progress-report.pdf');
      
      toast({
        title: "PDF Generated",
        description: "Your progress report has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateImage = async () => {
    if (!reportRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      // Create a temporary link to download the image
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'meditation-progress-report.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Image Generated",
        description: "Your progress report image has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image",
        variant: "destructive",
      });
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const printReport = () => {
    window.print();
  };
  
  const shareReport = async () => {
    if (!reportRef.current) return;
    
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      if (navigator.share) {
        const blob = await (await fetch(imgData)).blob();
        const file = new File([blob], 'meditation-progress.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My Meditation Progress',
          text: 'Check out my meditation progress with Respiro Balance!',
          files: [file],
        });
        
        toast({
          title: "Shared",
          description: "Your progress report has been shared",
        });
      } else {
        // Fallback if Web Share API is not available
        navigator.clipboard.writeText('Check out my meditation progress with Respiro Balance!');
        toast({
          title: "Link Copied",
          description: "Share link copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share report",
        variant: "destructive",
      });
      console.error("Error sharing report:", error);
    }
  };
  
  // Format date for the report
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progress Report</CardTitle>
          <CardDescription>
            Generate and share your meditation progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generatePDF} disabled={isGenerating}>
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button onClick={generateImage} disabled={isGenerating} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Save as Image
            </Button>
            <Button onClick={printReport} disabled={isGenerating} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={shareReport} disabled={isGenerating} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Hidden report content for export */}
      <div className="hidden">
        <div ref={reportRef} className="bg-white p-8 max-w-3xl mx-auto" style={{ width: '800px', fontFamily: 'Arial, sans-serif' }}>
          <div className="text-center mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold text-primary mb-2">Respiro Balance</h1>
            <h2 className="text-xl">Meditation Progress Report</h2>
            <p className="text-sm text-gray-500">Generated on {formatDate()}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">User Progress Summary</h3>
            <p className="text-sm mb-4">
              This report provides an overview of your meditation journey and the benefits you've experienced.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold text-sm mb-1">Total Sessions</h4>
                <p className="text-2xl font-bold">{meditationStats.totalSessions}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold text-sm mb-1">Total Minutes</h4>
                <p className="text-2xl font-bold">{meditationStats.totalMinutes}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold text-sm mb-1">Current Streak</h4>
                <p className="text-2xl font-bold">{meditationStats.streak} days</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Progress Metrics</h3>
            
            <div className="space-y-4 mb-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">Weekly Goal Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${(meditationStats.weeklyCompleted / meditationStats.weeklyGoal) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {meditationStats.weeklyCompleted} of {meditationStats.weeklyGoal} sessions completed this week
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-1">Consistency Score</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${(meditationStats.streak / 10) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((meditationStats.streak / 10) * 100)}% consistency based on your current streak
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Wellbeing Impact</h3>
            <p className="text-sm mb-3">
              Here's how meditation has impacted your wellbeing metrics:
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold text-sm mb-1">Focus Improvement</h4>
                <p className="text-lg font-bold">
                  {meditationStats.focusCorrelation.withMeditation - meditationStats.focusCorrelation.withoutMeditation}%
                </p>
                <p className="text-xs text-gray-500">
                  Improvement on meditation days vs. non-meditation days
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold text-sm mb-1">Stress Reduction</h4>
                <p className="text-lg font-bold">
                  {meditationStats.moodCorrelation.withMeditation - meditationStats.moodCorrelation.withoutMeditation}%
                </p>
                <p className="text-xs text-gray-500">
                  Stress reduction on meditation days vs. non-meditation days
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Achievement Progress</h3>
            <p className="text-sm mb-3">
              You've unlocked {meditationStats.achievementProgress.unlocked} of {meditationStats.achievementProgress.total} achievements.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-500 h-2.5 rounded-full" 
                style={{ width: `${(meditationStats.achievementProgress.unlocked / meditationStats.achievementProgress.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((meditationStats.achievementProgress.unlocked / meditationStats.achievementProgress.total) * 100)}% of achievements unlocked
            </p>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-12 pt-4 border-t">
            <p>
              This report was generated by Respiro Balance - Your partner in mindfulness and wellbeing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareableReport;

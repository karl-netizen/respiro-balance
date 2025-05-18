
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from "sonner";
import { MeditationStats } from '@/components/progress/types/meditationStats';

export const useReportExport = (meditationStats: MeditationStats) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Function to make the report content visible for capture
  const prepareReportForCapture = () => {
    if (!contentRef.current) {
      toast.error("Could not generate report. Please try again.");
      return false;
    }
    
    contentRef.current.style.display = 'block';
    contentRef.current.style.position = 'fixed';
    contentRef.current.style.zIndex = '-1000';
    
    return true;
  };
  
  // Function to hide the report content after capture
  const hideReportAfterCapture = () => {
    if (contentRef.current) {
      contentRef.current.style.display = 'none';
    }
  };
  
  // Function to capture report as canvas
  const captureReport = async () => {
    if (!prepareReportForCapture()) return null;
    
    try {
      const canvas = await html2canvas(contentRef.current!, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      hideReportAfterCapture();
      return canvas;
    } catch (error) {
      console.error("Error capturing report:", error);
      hideReportAfterCapture();
      return null;
    }
  };
  
  // Function to export the report as PDF
  const exportAsPDF = async () => {
    toast.info("Generating PDF...");
    
    const canvas = await captureReport();
    if (!canvas) {
      toast.error("Failed to generate PDF. Please try again.");
      return;
    }
    
    try {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`meditation_progress_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success("PDF Downloaded Successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };
  
  // Function to export the report as an image
  const exportAsImage = async () => {
    toast.info("Generating image...");
    
    const canvas = await captureReport();
    if (!canvas) {
      toast.error("Failed to generate image. Please try again.");
      return;
    }
    
    try {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `meditation_progress_${new Date().toISOString().split('T')[0]}.png`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Image Downloaded Successfully");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    }
  };
  
  // Function to print the report
  const printReport = async () => {
    toast.info("Preparing to print...");
    
    const canvas = await captureReport();
    if (!canvas) {
      toast.error("Failed to prepare print. Please try again.");
      return;
    }
    
    try {
      const imgData = canvas.toDataURL('image/png');
      
      // Create a new window and document for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Pop-up blocked. Please allow pop-ups to print.");
        return;
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Meditation Progress Report</title>
          </head>
          <body style="margin: 0; padding: 0;">
            <img src="${imgData}" style="width: 100%;" />
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for image to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        toast.success("Print dialog opened");
      }, 500);
    } catch (error) {
      console.error("Error printing report:", error);
      toast.error("Failed to print report. Please try again.");
    }
  };
  
  // Function to share the report
  const shareReport = () => {
    // Check if the Web Share API is available
    if (navigator.share) {
      toast.info("Sharing your progress report...");
      
      // Generate a shareable title and text
      const shareData = {
        title: 'My Meditation Progress Report',
        text: `Check out my meditation stats: ${meditationStats.totalSessions} sessions, ${meditationStats.totalMinutes} minutes meditated, and ${meditationStats.streak} day streak!`,
        url: window.location.href,
      };
      
      navigator.share(shareData)
        .then(() => toast.success("Shared successfully"))
        .catch((error) => {
          console.error("Error sharing:", error);
          toast.error("Could not share report. Please try again.");
        });
    } else {
      // Fallback for browsers that don't support the Web Share API
      toast.info("Copying share link to clipboard...");
      
      // In a real app, you'd generate a shareable URL
      const dummyShareableLink = window.location.href;
      
      navigator.clipboard.writeText(dummyShareableLink)
        .then(() => toast.success("Link copied to clipboard"))
        .catch(() => toast.error("Could not copy to clipboard"));
    }
  };
  
  return {
    contentRef,
    exportAsPDF,
    exportAsImage,
    printReport,
    shareReport
  };
};

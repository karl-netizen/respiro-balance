
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from "sonner";
import { MeditationStats } from '@/components/progress/types/meditationStats';

export const useReportExport = (meditationStats: MeditationStats) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Function to make the report content visible for capture
  const prepareReportForCapture = async () => {
    if (!contentRef.current) {
      console.error("Content ref is null");
      toast.error("Could not find report content. Please try again.");
      return false;
    }
    
    try {
      // Make content visible in a better way
      const element = contentRef.current;
      element.style.display = 'block';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '0';
      element.style.zIndex = '1000';
      element.style.backgroundColor = '#ffffff';
      element.style.width = '800px';
      element.style.minHeight = '600px';
      
      // Wait for any async content to load (charts, etc.)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("Report prepared for capture", {
        width: element.offsetWidth,
        height: element.offsetHeight,
        display: element.style.display
      });
      
      return true;
    } catch (error) {
      console.error("Error preparing report for capture:", error);
      toast.error("Failed to prepare report. Please try again.");
      return false;
    }
  };
  
  // Function to hide the report content after capture
  const hideReportAfterCapture = () => {
    if (contentRef.current) {
      contentRef.current.style.display = 'none';
      contentRef.current.style.position = '';
      contentRef.current.style.left = '';
      contentRef.current.style.top = '';
      contentRef.current.style.zIndex = '';
    }
  };
  
  // Function to capture report as canvas with retry logic
  const captureReport = async (retryCount = 0) => {
    const maxRetries = 2;
    
    if (!(await prepareReportForCapture())) {
      return null;
    }
    
    try {
      console.log(`Attempting to capture report (attempt ${retryCount + 1})`);
      
      const canvas = await html2canvas(contentRef.current!, {
        scale: 2,
        logging: process.env.NODE_ENV === 'development',
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 800,
        height: contentRef.current!.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
        windowHeight: contentRef.current!.scrollHeight
      });
      
      console.log("Successfully captured canvas", {
        width: canvas.width,
        height: canvas.height
      });
      
      hideReportAfterCapture();
      return canvas;
    } catch (error) {
      console.error(`Error capturing report (attempt ${retryCount + 1}):`, error);
      hideReportAfterCapture();
      
      // Retry logic
      if (retryCount < maxRetries) {
        console.log(`Retrying capture... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return captureReport(retryCount + 1);
      }
      
      toast.error(`Failed to capture report after ${maxRetries + 1} attempts. Please try again.`);
      return null;
    }
  };
  
  // Function to export the report as PDF
  const exportAsPDF = async () => {
    if (isExporting) {
      toast.warning("Export already in progress. Please wait...");
      return;
    }
    
    setIsExporting(true);
    
    try {
      toast.info("Generating PDF...", { 
        description: "This may take a few moments" 
      });
      
      const canvas = await captureReport();
      if (!canvas) {
        toast.error("Failed to generate PDF. Please try again.");
        return;
      }
      
      console.log("Starting PDF generation with canvas dimensions:", {
        width: canvas.width,
        height: canvas.height
      });
      
      const imgData = canvas.toDataURL('image/png', 0.95);
      
      // Calculate PDF dimensions to fit nicely
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: pdfHeight > 297 ? 'portrait' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add the image to PDF with proper scaling
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(pdfHeight, 297));
      
      // If content is too tall, add additional pages
      if (pdfHeight > 297) {
        let remainingHeight = pdfHeight - 297;
        let yOffset = -297;
        
        while (remainingHeight > 0) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight);
          remainingHeight -= 297;
          yOffset -= 297;
        }
      }
      
      const fileName = `meditation_progress_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success("PDF Downloaded Successfully", {
        description: `Saved as ${fileName}`
      });
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Function to export the report as an image
  const exportAsImage = async () => {
    if (isExporting) {
      toast.warning("Export already in progress. Please wait...");
      return;
    }
    
    setIsExporting(true);
    
    try {
      toast.info("Generating image...", { 
        description: "Creating high-quality PNG" 
      });
      
      const canvas = await captureReport();
      if (!canvas) {
        toast.error("Failed to generate image. Please try again.");
        return;
      }
      
      console.log("Exporting image with dimensions:", {
        width: canvas.width,
        height: canvas.height
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const fileName = `meditation_progress_${new Date().toISOString().split('T')[0]}.png`;
      
      link.download = fileName;
      link.href = imgData;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Image Downloaded Successfully", {
        description: `Saved as ${fileName}`
      });
      
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Function to print the report
  const printReport = async () => {
    if (isExporting) {
      toast.warning("Export already in progress. Please wait...");
      return;
    }
    
    setIsExporting(true);
    
    try {
      toast.info("Preparing to print...", { 
        description: "Setting up print preview" 
      });
      
      const canvas = await captureReport();
      if (!canvas) {
        toast.error("Failed to prepare print. Please try again.");
        return;
      }
      
      const imgData = canvas.toDataURL('image/png', 0.95);
      
      // Create a new window and document for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        toast.error("Pop-up blocked. Please allow pop-ups to print.");
        return;
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Meditation Progress Report</title>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                img { max-width: 100%; height: auto; page-break-inside: avoid; }
              }
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif;
                background: white;
              }
              img { 
                width: 100%; 
                height: auto;
                border: 1px solid #ddd;
                border-radius: 8px;
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" alt="Meditation Progress Report" onload="window.print(); setTimeout(() => window.close(), 1000);" />
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      toast.success("Print dialog opened", {
        description: "Print window will close automatically after printing"
      });
      
    } catch (error) {
      console.error("Error printing report:", error);
      toast.error("Failed to print report. Please try again.", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Function to share the report
  const shareReport = async () => {
    // Check if the Web Share API is available
    if (navigator.share) {
      toast.info("Sharing your progress report...");
      
      // Generate a shareable title and text
      const shareData = {
        title: 'My Meditation Progress Report',
        text: `Check out my meditation stats: ${meditationStats.totalSessions} sessions, ${meditationStats.totalMinutes} minutes meditated, and ${meditationStats.streak} day streak!`,
        url: window.location.href,
      };
      
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error("Could not share report. Please try again.");
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      toast.info("Copying share link to clipboard...");
      
      // In a real app, you'd generate a shareable URL
      const dummyShareableLink = window.location.href;
      
      try {
        await navigator.clipboard.writeText(dummyShareableLink);
        toast.success("Link copied to clipboard");
      } catch (error) {
        toast.error("Could not copy to clipboard");
      }
    }
  };
  
  return {
    contentRef,
    exportAsPDF,
    exportAsImage,
    printReport,
    shareReport,
    isExporting
  };
};

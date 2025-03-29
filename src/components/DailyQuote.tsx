
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkle } from "lucide-react";

// Sample quotes array
const motivationalQuotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Breathe in courage, breathe out fear.",
    author: "Anonymous"
  },
  {
    text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    author: "Thich Nhat Hanh"
  },
  {
    text: "Your calm mind is the ultimate weapon against your challenges.",
    author: "Bryant McGill"
  },
  {
    text: "Mindfulness isn't difficult, we just need to remember to do it.",
    author: "Sharon Salzberg"
  },
  {
    text: "Almost everything will work again if you unplug it for a few minutes, including you.",
    author: "Anne Lamott"
  },
  {
    text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.",
    author: "Hermann Hesse"
  }
];

const DailyQuote = () => {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Get today's date to use as seed for selecting quote
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // Use the date string to generate a deterministic index for today's quote
    const charSum = dateString.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const todaysQuoteIndex = charSum % motivationalQuotes.length;
    
    // Set today's quote
    setQuote(motivationalQuotes[todaysQuoteIndex]);
    
    // Trigger fade-in animation after component mounts
    setTimeout(() => {
      setFadeIn(true);
    }, 300);
  }, []);

  if (!quote.text) return null;

  return (
    <div className={`transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <Card className="border-none bg-primary/5 shadow-sm">
        <CardContent className="pt-6 pb-6 px-6">
          <div className="flex items-start">
            <Sparkle className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
            <div>
              <p className="text-base italic mb-2">{quote.text}</p>
              <p className="text-sm text-muted-foreground text-right">— {quote.author}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyQuote;

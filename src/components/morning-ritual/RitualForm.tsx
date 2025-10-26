
import { useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRitualForm } from "./hooks/useRitualForm";
import RitualFormContent from "./RitualFormContent";

const RitualForm = () => {
  const isMobile = useIsMobile();
  const { 
    form, 
    submitted, 
    setSubmitted, 
    onSubmit 
  } = useRitualForm();
  
  // Reset success message after delay
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [submitted, setSubmitted]);

  const formContent = (
    <RitualFormContent
      form={form}
      onSubmit={onSubmit}
      isSubmitting={false}
    />
  );

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a Morning Ritual</CardTitle>
          <CardDescription>
            Design a ritual that works for your morning routine and helps you start your day right.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isMobile ? (
            <ScrollArea className="h-[calc(100vh-350px)] pr-4">
              {formContent}
            </ScrollArea>
          ) : (
            formContent
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RitualForm;

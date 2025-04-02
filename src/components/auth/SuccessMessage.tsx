
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface SuccessMessageProps {
  title: string;
  message: string;
  buttonText: string;
  buttonLink: string;
  icon?: ReactNode;
}

const SuccessMessage = ({ title, message, buttonText, buttonLink, icon }: SuccessMessageProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-secondary/10 px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        {icon && <div className="mx-auto">{icon}</div>}
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
        <p className="mt-2 text-muted-foreground">{message}</p>
        <Link to={buttonLink}>
          <Button className="mt-6">{buttonText}</Button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessMessage;

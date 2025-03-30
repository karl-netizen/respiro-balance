
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  title: string;
  message: string;
  buttonText: string;
  buttonLink: string;
}

const SuccessMessage = ({ title, message, buttonText, buttonLink }: SuccessMessageProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-primary">{title}</h2>
      <p className="mt-2 text-muted-foreground">{message}</p>
      <Link to={buttonLink}>
        <Button className="mt-6">{buttonText}</Button>
      </Link>
    </div>
  );
};

export default SuccessMessage;

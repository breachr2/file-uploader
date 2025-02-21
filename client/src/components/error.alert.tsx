import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

type ErrorAlertProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive" | null | undefined;
};

function ErrorAlert({
  title,
  description,
  variant = "destructive",
}: ErrorAlertProps) {
  return (
    <Alert variant={variant}>
      <AlertCircle className="size-4" />
      <AlertTitle className="text-base">{title}</AlertTitle>
      <AlertDescription>
        <span className="whitespace-pre-wrap text-base">{description}</span>
      </AlertDescription>
    </Alert>
  );
}

export default ErrorAlert;

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

function ErrorAlert({ children }: { children: React.ReactNode }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <span className="whitespace-pre-wrap">{children}</span>
      </AlertDescription>
    </Alert>
  );
}

export default ErrorAlert;

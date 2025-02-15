import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

function ErrorAlert({ children }: { children: React.ReactNode }) {
  return (
    <Alert variant="destructive" className="text-lg">
      <AlertCircle className="size-4" />
      <AlertTitle >Error</AlertTitle>
      <AlertDescription>
        <span className="whitespace-pre-wrap text-lg">{children}</span>
      </AlertDescription>
    </Alert>
  );
}

export default ErrorAlert;

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

function LandingPage() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex flex-col justify-center items-center h-full bg-secondary relative min-h-96">
      <header className="p-4 w-full shadow-md absolute top-0 left-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#333333]">File Uploader</h1>
          <div className="space-x-2">
            <Link to="/auth">
              <Button className=" hover:bg-sidebar-border " variant="ghost">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button>Start for Free</Button>
            </Link>
          </div>
        </div>
      </header>
      <div className="w-full flex flex-col items-center space-y-4 pt-height-small pt-height-large">
        <h1 className="text-4xl font-bold text-[#333333] max-w-2xl text-center sm:text-6xl">
          Cloud Storage Solution for Secure File Sharing
        </h1>
        <p className="text-lg text-neutral-700 text-center max-w-2xl sm:text-2xl">
          Securely Store, Share, and Access Your Files Anytime, Anywhere
        </p>
        <Link to={isAuthenticated ? "/auth" : "/folders"}>
          <Button className="h-10 text-lg py-6">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;

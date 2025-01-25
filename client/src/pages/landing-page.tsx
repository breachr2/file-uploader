import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="flex flex-col justify-center items-center h-full bg-secondary relative min-h-96">
      <header className="p-4 w-full shadow-md absolute top-0 left-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#333333]">File Uploader</h1>
          <div className="space-x-2">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <div className="w-full flex flex-col items-center space-y-4 pt-height-small pt-height-large">
        <h1 className="text-3xl font-bold text-[#333333] max-w-xl text-center font-inter sm:text-5xl">
          Cloud Storage Solution for Secure File Sharing
        </h1>
        <p className="text-base text-neutral-700 font-inter text-center max-w-lg sm:text-lg">
          Securely Store, Share, and Access Your Files Anytime, Anywhere.
        </p>
        <Link to="/auth">
          <Button className="h-10 font-lg font-inter">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;

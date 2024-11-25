import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import SignInCard from "./sign-in";
import SignUpCard from "./sign-up";

function Auth() {
  return (
    <div className="flex h-full items-center justify-center border-2 border-blue">
      <Tabs defaultValue="signin" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignInCard />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Auth;

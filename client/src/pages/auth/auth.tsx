import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { useState, useContext } from "react";
import SignInCard from "./sign-in";
import SignUpCard from "./sign-up";
import { AuthContext } from "@/context/auth-context";
import { Navigate } from "react-router-dom";

function Auth() {
  const [tab, setTab] = useState("signIn");
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/folders" />;
  }

  const onTabChange = (value: string) => {
    setTab(value);
  };

  return (
    <div className="flex h-full items-center justify-center border-2 border-blue">
      <Tabs
        value={tab}
        onValueChange={onTabChange}
        defaultValue="signIn"
        className="w-[400px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signIn">Sign In</TabsTrigger>
          <TabsTrigger value="signUp">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signIn">
          <SignInCard />
        </TabsContent>
        <TabsContent value="signUp">
          <SignUpCard setTab={onTabChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Auth;

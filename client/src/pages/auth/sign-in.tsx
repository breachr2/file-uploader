import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signin } from "@/api/user-api";
import Submit from "@/components/ui/submit";
import RedAsterisk from "@/components/ui/red-asterisk";
import ErrorAlert from "@/components/error.alert";

function SignInCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const signInMutation = useMutation({
    mutationFn: () => signin(username, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["public-files"] });
      navigate("/folders");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription className="text-base">
          Welcome Back! Please sign in to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div>
            <Label htmlFor="username" className="text-base">
              Username <RedAsterisk />
            </Label>
            <Input
              name="username"
              id="username"
              className="md:text-base"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
          </div>
          <div>
            <Label className="text-base" htmlFor="password">
              Password <RedAsterisk />
            </Label>
            <Input
              type="password"
              name="password"
              id="password"
              className=" md:text-base"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {signInMutation.isError && (
          <ErrorAlert
            title="Error Signing In"
            description={signInMutation.error.message}
          />
        )}
        <Submit
          isLoading={signInMutation.isPending}
          className="w-full text-base"
          onClick={(e) => {
            e.preventDefault();
            signInMutation.mutate();
          }}
        >
          Sign In
        </Submit>
        {/* <Button className="w-full py-6 text-lg" variant="outline">
          Sign Up With Google
        </Button> */}
        <Button className="w-full  text-base" variant="outline">
          Log in with Demo User
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SignInCard;

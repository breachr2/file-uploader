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
        <CardDescription>
          Welcome Back! Please sign in to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="username">
            Username <RedAsterisk />
          </Label>
          <Input
            name="username"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">
            Password <RedAsterisk />
          </Label>
          <Input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {signInMutation.isError && (
          <ErrorAlert>{signInMutation.error.message}</ErrorAlert>
        )}
        <Submit
          isLoading={signInMutation.isPending}
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            signInMutation.mutate();
          }}
        >
          Sign In
        </Submit>
        <Button className="w-full" variant="outline">
          Sign Up With Google
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SignInCard;

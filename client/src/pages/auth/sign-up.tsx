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
import Submit from "@/components/ui/submit";
import RedAsterisk from "@/components/ui/red-asterisk";
import { useMutation } from "@tanstack/react-query";
import ErrorAlert from "@/components/error.alert";
import { signup, SignUpFormData } from "@/api/user-api";

type SignUpCardProps = {
  setTab: (value: string) => void;
};

function SignUpCard({ setTab }: SignUpCardProps) {
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const signUpMutation = useMutation({
    mutationFn: () => signup(formData),
    onSuccess: () => {
      setTab("signIn");
    },
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription className="text-lg">
          Register for an account to get started!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div>
            <Label className="text-lg" htmlFor="username">
              Username <RedAsterisk />
            </Label>
            <Input
              name="username"
              id="username"
              className="py-6 md:text-lg"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label className="text-lg" htmlFor="password">
              Password <RedAsterisk />
            </Label>
            <Input
              type="password"
              name="password"
              id="password"
              className="py-6 md:text-lg"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label className="text-lg" htmlFor="confirmPassword">
              Confirm Password <RedAsterisk />
            </Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="py-6 md:text-lg"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {signUpMutation.isError && (
          <ErrorAlert>{signUpMutation.error.message}</ErrorAlert>
        )}
        <Submit
          isLoading={signUpMutation.isPending}
          className="w-full py-6 text-lg"
          onClick={() => signUpMutation.mutate()}
        >
          Sign up
        </Submit>
        {/* <Button className="w-full py-6 text-lg" variant="outline">
          Sign Up With Google
        </Button> */}
      </CardFooter>
    </Card>
  );
}

export default SignUpCard;

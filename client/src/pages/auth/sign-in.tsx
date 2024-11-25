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

function SignInCard() {
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
          <Label htmlFor="username">Username</Label>
          <Input name="username" id="username" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" id="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full">Sign In</Button>
        <Button className="w-full" variant="outline">
          Sign Up With Google
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SignInCard;

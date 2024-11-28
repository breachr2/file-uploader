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
import { API_URL } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import RedAsterisk from "@/components/ui/red-asterisk";

function SignInCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/log-in`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        navigate("/folders");
      } else {
        const error = await response.json();
        console.log(error);
        setError({ message: error });
      }
    } catch (err) {
      setError({ message: "An unknown error has occured" });
    } finally {
      setLoading(false);
    }
  }

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
        {error && <p>{error.message}</p>}
        <Submit isLoading={loading} className="w-full" onClick={handleSubmit}>
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

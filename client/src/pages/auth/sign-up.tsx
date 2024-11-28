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
import { API_URL } from "@/lib/constants";
import Submit from "@/components/ui/submit";
import RedAsterisk from "@/components/ui/red-asterisk";
import { useNavigate } from "react-router-dom";

function SignUpCard() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<{ message: string } | null>({
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError({ message: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/sign-up`, {
        method: "POST",
        body: JSON.stringify({ formData }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError({
          message: errorData.error || "An unknown error has occured",
        });
      } else {
        navigate("/auth", { replace: true });
      }
    } catch (err: any) {
      setError({
        message: "Failed to connect to the server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }
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
        <CardDescription>
          Register for an account to get started!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div>
            <Label htmlFor="username">
              Username <RedAsterisk />
            </Label>
            <Input
              name="username"
              id="username"
              value={formData.username}
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">
              Confirm Password <RedAsterisk />
            </Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {error && <p>{error.message}</p>}
        <Submit isLoading={loading} className="w-full" onClick={handleSubmit}>
          Sign up
        </Submit>
        <Button className="w-full" variant="outline">
          Sign Up With Google
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SignUpCard;

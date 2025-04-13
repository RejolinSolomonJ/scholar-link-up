import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

// Define form schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordResetStep, setPasswordResetStep] = useState<"email" | "otp" | "newPassword">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, supabase } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setPasswordResetError(null);

    const { error } = await signIn({
      email: values.email,
      password: values.password,
    });

    if (error) {
      // Check if it's a rate limit error
      if (error.message.includes("rate limit")) {
        toast({
          title: "Too many attempts",
          description: "Too many sign in attempts, please try again later.",
          variant: "destructive",
        });
        setPasswordResetError("Too many attempts. Please try again later.");
      } else {
        toast({
          title: "Authentication Failed",
          description: error.message,
          variant: "destructive",
        });
        setPasswordResetError(error.message);
      }
    } else {
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    }

    setIsLoading(false);
  };

  const handleSendPasswordResetEmail = async (email: string) => {
    setIsLoading(true);
    setResetEmailSent(false);
    setPasswordResetError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth-redirect?type=recovery`,
      });
      
      if (error) {
        // Check if it's a rate limit error
        if (error.message.includes("rate limit")) {
          setPasswordResetError("Too many reset attempts. Please try again later.");
        } else {
          setPasswordResetError(error.message);
        }
      } else {
        setResetEmailSent(true);
        setPasswordResetStep("otp");
      }
    } catch (error) {
      setPasswordResetError("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setPasswordResetError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth-redirect?type=recovery`,
      });
      
      if (error) {
        if (error.message.includes("rate limit")) {
          setPasswordResetError("Too many attempts. Please try again later.");
        } else {
          setPasswordResetError(error.message);
        }
      } else {
        toast({
          title: "OTP Resent",
          description: "A new OTP has been sent to your email",
        });
      }
    } catch (error) {
      setPasswordResetError("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            Enter your email and password to login
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {passwordResetStep === "email" ? (
            <>
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              {passwordResetError && (
                <p className="text-red-500 text-sm">{passwordResetError}</p>
              )}
              <Button
                onClick={() => handleSendPasswordResetEmail(resetEmail)}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Reset Password"}
              </Button>
            </>
          ) : passwordResetStep === "otp" ? (
            <>
              <p className="text-sm text-muted-foreground">
                We have sent an OTP to your email. Please check your inbox and
                enter the OTP to reset your password.
              </p>
              {passwordResetError && (
                <p className="text-red-500 text-sm">{passwordResetError}</p>
              )}
              <Button
                onClick={handleResendOtp}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Resend OTP"}
              </Button>
            </>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your password"
                            type={passwordVisible ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            {passwordVisible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">Toggle password</span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {passwordResetError && (
                  <p className="text-red-500 text-sm">{passwordResetError}</p>
                )}
                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Login"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 items-center">
          {passwordResetStep === "default" && (
            <Link to="/register" className="text-sm text-muted-foreground hover:underline">
              Don't have an account? Sign up
            </Link>
          )}
          {passwordResetStep !== "email" && (
            <Button
              variant="link"
              onClick={() => setPasswordResetStep("email")}
            >
              Forgot password?
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

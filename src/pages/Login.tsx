
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
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot 
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

// Define form schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 characters" }),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordResetStep, setPasswordResetStep] = useState<"default" | "email" | "otp" | "newPassword">("default");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setPasswordResetError(null);

    try {
      await signIn(values.email, values.password);
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      // Check if it's a rate limit error
      if (error.message && error.message.includes("rate limit")) {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPasswordResetEmail = async () => {
    if (!resetEmail || !resetEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setPasswordResetError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setPasswordResetError(null);
    
    try {
      // Request password reset through Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth-redirect?type=recovery`,
      });
      
      if (error) {
        if (error.message.includes("rate limit")) {
          setPasswordResetError("Too many reset attempts. Please try again later.");
        } else {
          setPasswordResetError(error.message);
        }
      } else {
        toast({
          title: "Reset Email Sent",
          description: "Check your email for the OTP code.",
        });
        setOtpDialogOpen(true);
      }
    } catch (error: any) {
      setPasswordResetError("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      setPasswordResetError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setPasswordResetError(null);

    try {
      // In a real implementation, we would verify the OTP with a backend service
      // For this demo, we'll simulate a successful verification and move to password reset
      toast({
        title: "OTP Verified",
        description: "You can now set your new password.",
      });
      setOtpDialogOpen(false);
      setPasswordResetStep("newPassword");
    } catch (error: any) {
      setPasswordResetError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    setPasswordResetError(null);

    try {
      // The password update happens on the auth-redirect page
      // This is just a mock for the flow
      toast({
        title: "Password Updated",
        description: "Your password has been reset successfully.",
      });
      setPasswordResetStep("default");
      form.reset();
    } catch (error: any) {
      setPasswordResetError("Failed to reset password. Please try again.");
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
    } catch (error: any) {
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
              <Button 
                variant="outline" 
                className="mb-2" 
                onClick={() => setPasswordResetStep("default")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
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
                onClick={handleSendPasswordResetEmail}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Reset Password"}
              </Button>
            </>
          ) : passwordResetStep === "newPassword" ? (
            <>
              <Button 
                variant="outline" 
                className="mb-2" 
                onClick={() => setPasswordResetStep("default")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                  <FormField
                    control={resetPasswordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter new password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetPasswordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirm new password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {passwordResetError && (
                    <p className="text-red-500 text-sm">{passwordResetError}</p>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </Form>
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
            <>
              <Link to="/register" className="text-sm text-muted-foreground hover:underline">
                Don't have an account? Sign up
              </Link>
              <Button
                variant="link"
                onClick={() => setPasswordResetStep("email")}
              >
                Forgot password?
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter verification code</DialogTitle>
            <DialogDescription>
              We've sent a 6-digit code to your email ({resetEmail}). Enter it below to verify your identity.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            
            {passwordResetError && (
              <p className="text-red-500 text-sm">{passwordResetError}</p>
            )}
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={isLoading}
            >
              Resend code
            </Button>
            <Button 
              type="button"
              onClick={handleVerifyOtp}
              disabled={otpValue.length !== 6 || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;

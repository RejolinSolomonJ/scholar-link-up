
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const passwordSchema = z.string().min(6).max(8)
  .refine(
    (password) => /[A-Z]/.test(password),
    { message: "Password must include at least one uppercase letter" }
  )
  .refine(
    (password) => /[a-z]/.test(password),
    { message: "Password must include at least one lowercase letter" }
  )
  .refine(
    (password) => /[!@#$%^&*]/.test(password),
    { message: "Password must include at least one special character (!@#$%^&*)" }
  );

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

const resetPasswordFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const otpFormSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 characters" }),
});

const newPasswordFormSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [otpVerifyMode, setOtpVerifyMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const resetForm = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const newPasswordForm = useForm<z.infer<typeof newPasswordFormSchema>>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setError("");
    setLoading(true);

    try {
      console.log("Attempting to sign in with:", values.email);
      await signIn(values.email, values.password);
      console.log("Sign in successful, navigating to auth-redirect");
      navigate('/auth-redirect', { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: z.infer<typeof resetPasswordFormSchema>) => {
    setError("");
    setResetLoading(true);

    try {
      console.log("Sending password reset email to:", values.email);
      
      // Request password reset email with new options
      const { error, data } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: window.location.origin + '/login',
      });

      if (error) throw error;

      console.log("Reset email sent successfully");
      setResetEmail(values.email);
      setResetEmailSent(true);
      setOtpVerifyMode(true); // Automatically move to OTP verification mode
      toast.success("Password reset code sent to your email. Please check your inbox and spam folder.");
      
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to send reset instructions");
    } finally {
      setResetLoading(false);
    }
  };

  const handleOtpComplete = async (value: string) => {
    setOtpValue(value);
    
    if (value.length === 6) {
      try {
        setResetLoading(true);
        console.log("Verifying OTP:", value);
        
        // Verify the OTP
        const { data, error } = await supabase.auth.verifyOtp({
          email: resetEmail,
          token: value,
          type: 'recovery'
        });
        
        if (error) throw error;
        
        if (data.session) {
          console.log("OTP verified successfully");
          setResetToken(data.session.access_token);
          setOtpVerifyMode(false);
          setShowNewPasswordForm(true);
          toast.success("Verification successful. Please set your new password.");
        }
      } catch (err: any) {
        console.error("OTP verification error:", err);
        setError(err.message || "Invalid verification code");
      } finally {
        setResetLoading(false);
      }
    }
  };

  const handleNewPasswordSubmit = async (values: z.infer<typeof newPasswordFormSchema>) => {
    setError("");
    setResetLoading(true);

    try {
      console.log("Setting new password");
      
      // Update the password with the session from the OTP verification
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) throw error;

      // Reset all states and show success
      setShowResetDialog(false);
      setResetEmailSent(false);
      setOtpVerifyMode(false);
      setShowNewPasswordForm(false);
      setResetEmail("");
      setOtpValue("");
      setResetToken("");
      
      toast.success("Password reset successfully! You can now log in with your new password.");
    } catch (err: any) {
      console.error("Set new password error:", err);
      setError(err.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  const handleCancelReset = () => {
    setShowResetDialog(false);
    setResetEmailSent(false);
    setOtpVerifyMode(false);
    setShowNewPasswordForm(false);
    setResetEmail("");
    setOtpValue("");
    setResetToken("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Log in to your Scholar LinkUp account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        {...field}
                      />
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Button
                        variant="link"
                        type="button"
                        className="px-0 text-sm text-primary hover:underline"
                        onClick={() => setShowResetDialog(true)}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        required 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Remember me</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="underline text-primary">
              Create one
            </Link>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{showNewPasswordForm ? "Set New Password" : otpVerifyMode ? "Enter Verification Code" : "Reset Password"}</DialogTitle>
            <DialogDescription>
              {showNewPasswordForm 
                ? "Please enter your new password." 
                : otpVerifyMode 
                  ? `Enter the verification code sent to ${resetEmail}` 
                  : resetEmailSent 
                    ? `We've sent a verification code to ${resetEmail}. Please check both your inbox and spam folder.`
                    : "Enter your email address and we'll send you a verification code to reset your password."}
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resetEmailSent && !otpVerifyMode && !showNewPasswordForm && (
            <div className="space-y-4 py-4">
              <Alert className="bg-green-50 text-green-800 border-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Reset code sent. Please check your email inbox and spam folder.
                </AlertDescription>
              </Alert>
              <Alert className="bg-blue-50 text-blue-800 border-blue-100">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <p className="mb-2">Troubleshooting tips if you don't receive the email:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Check your spam/junk folder</li>
                    <li>Verify the email address is correct</li>
                    <li>Wait a few minutes for the email to arrive</li>
                    <li>Try again with the same email if needed</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleCancelReset}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleResetPassword({ email: resetEmail })}
                  disabled={resetLoading}
                >
                  Resend Code
                </Button>
              </div>
            </div>
          )}

          {!otpVerifyMode && !showNewPasswordForm && !resetEmailSent && (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="john@example.com" 
                          required 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setResetEmail(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelReset}
                    disabled={resetLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={resetLoading}>
                    {resetLoading ? "Sending..." : "Send Verification Code"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {otpVerifyMode && !showNewPasswordForm && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <div className="mx-auto py-2">
                  <InputOTP 
                    maxLength={6} 
                    value={otpValue} 
                    onChange={(value) => handleOtpComplete(value)}
                    disabled={resetLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Please enter the 6-digit verification code sent to your email
                </div>
              </div>
              
              <Alert className="bg-blue-50 text-blue-800 border-blue-100">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <p className="mb-2">Troubleshooting tips if you're having issues:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Check spam folder in Gmail</li>
                    <li>Make sure to use the most recent code</li>
                    <li>Codes typically expire after 1 hour</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={handleCancelReset}
                  disabled={resetLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => handleResetPassword({ email: resetEmail })}
                  disabled={resetLoading}
                >
                  Resend Code
                </Button>
              </DialogFooter>
            </div>
          )}

          {showNewPasswordForm && (
            <Form {...newPasswordForm}>
              <form onSubmit={newPasswordForm.handleSubmit(handleNewPasswordSubmit)} className="space-y-4 py-2">
                <FormField
                  control={newPasswordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter new password" 
                          required 
                          {...field}
                        />
                      </FormControl>
                      <div className="mt-2 text-xs flex items-start">
                        <Info className="h-3.5 w-3.5 mr-1 flex-shrink-0 text-muted-foreground mt-0.5" />
                        <span>
                          Password must be 6-8 characters, include at least one uppercase letter, 
                          one lowercase letter, and one special character.
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={newPasswordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm new password" 
                          required 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelReset}
                    disabled={resetLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={resetLoading}>
                    {resetLoading ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;

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
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
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
      console.log("Sending reset password email");
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: "",
      });

      if (error) throw error;

      setResetEmailSent(true);
      toast.success("Password reset email sent. Please check your inbox and click the link.");
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
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
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          {resetEmailSent ? (
            <div className="space-y-4 py-4">
              <Alert className="bg-green-50 text-green-800 border-green-100">
                <AlertDescription>
                  Password reset email sent. Please check your inbox and follow the instructions to reset your password.
                </AlertDescription>
              </Alert>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowResetDialog(false)}
              >
                Close
              </Button>
            </div>
          ) : (
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowResetDialog(false)}
                    disabled={resetLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={resetLoading}>
                    {resetLoading ? "Sending..." : "Send Reset Link"}
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

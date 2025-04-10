import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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

const resetPasswordFormSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [tokenCheckLoading, setTokenCheckLoading] = useState(true);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const checkRecoveryToken = async () => {
      try {
        setTokenCheckLoading(true);
        
        const hash = window.location.hash;
        const query = window.location.search;
        console.log("URL hash:", hash);
        console.log("URL query:", query);
        
        let accessToken = null;
        let type = null;
        
        if (hash && hash.length > 1) {
          const params = new URLSearchParams(hash.substring(1));
          accessToken = params.get("access_token");
          type = params.get("type");
          console.log("Extracted from hash - token:", accessToken ? "exists" : "none", "type:", type);
        }
        
        if (!accessToken && query && query.length > 1) {
          const params = new URLSearchParams(query);
          accessToken = params.get("access_token");
          type = params.get("type");
          console.log("Extracted from query - token:", accessToken ? "exists" : "none", "type:", type);
        }
        
        if (accessToken && type === "recovery") {
          console.log("Found valid recovery token, setting session...");
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: "",
          });
          
          if (error) {
            console.error("Error validating recovery token:", error);
            setError("Invalid or expired recovery token");
            setValidToken(false);
          } else {
            console.log("Recovery token validated successfully");
            setValidToken(true);
          }
        } else {
          console.log("Invalid recovery link parameters");
          setError("Invalid recovery link. Please request a new password reset.");
          setValidToken(false);
        }
      } catch (err) {
        console.error("Error checking recovery token:", err);
        setError("An error occurred validating your recovery token");
        setValidToken(false);
      } finally {
        setTokenCheckLoading(false);
      }
    };
    
    checkRecoveryToken();
  }, []);

  const handleSubmit = async (values: z.infer<typeof resetPasswordFormSchema>) => {
    setError("");
    setLoading(true);

    try {
      console.log("Updating password...");
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      
      if (error) throw error;
      
      console.log("Password updated successfully");
      setSuccess(true);
      toast.success("Password reset successfully! You can now log in with your new password.");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tokenCheckLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : success ? (
            <Alert className="bg-green-50 text-green-800 border-green-100 mb-4">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Your password has been reset successfully! You will be redirected to the login page shortly.
              </AlertDescription>
            </Alert>
          ) : validToken ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
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
                      <FormDescription>
                        <div className="mt-2 text-xs flex items-start">
                          <Info className="h-3.5 w-3.5 mr-1 flex-shrink-0 text-muted-foreground mt-0.5" />
                          <span>
                            Password must be 6-8 characters, include at least one uppercase letter, 
                            one lowercase letter, and one special character.
                          </span>
                        </div>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
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
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center py-4">
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => navigate("/login")}
              >
                Return to Login
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            className="text-muted-foreground" 
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;

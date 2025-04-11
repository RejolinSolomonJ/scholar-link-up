
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const [manualToken, setManualToken] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Function to extract token from URL or hash
  const extractToken = () => {
    // Try to extract token from both the hash and URL fragments
    const hash = location.hash;
    const query = location.search;
    console.log("Current URL path:", location.pathname);
    console.log("URL hash:", hash);
    console.log("URL query:", query);
    
    let accessToken = null;
    let type = null;
    
    // Check hash first (modern format)
    if (hash && hash.length > 1) {
      const params = new URLSearchParams(hash.substring(1));
      accessToken = params.get("access_token");
      type = params.get("type");
      console.log("Extracted from hash - token:", accessToken ? "exists" : "none", "type:", type);
    }
    
    // If not found in hash, check query params
    if (!accessToken && query && query.length > 1) {
      const params = new URLSearchParams(query);
      accessToken = params.get("access_token");
      type = params.get("type");
      console.log("Extracted from query - token:", accessToken ? "exists" : "none", "type:", type);
    }
    
    return { accessToken, type };
  };

  // Function to validate token and set session
  const validateToken = async (token: string) => {
    try {
      console.log("Validating token:", token ? "exists" : "none");
      const { error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: "",
      });
      
      if (error) {
        console.error("Error validating recovery token:", error);
        setError("Invalid or expired recovery token");
        setValidToken(false);
        return false;
      } else {
        console.log("Recovery token validated successfully");
        setValidToken(true);
        return true;
      }
    } catch (err) {
      console.error("Error validating token:", err);
      setError("An error occurred validating your recovery token");
      setValidToken(false);
      return false;
    }
  };

  useEffect(() => {
    const checkRecoveryToken = async () => {
      try {
        setTokenCheckLoading(true);
        
        const { accessToken, type } = extractToken();
        
        if (accessToken && type === "recovery") {
          console.log("Found valid recovery token, setting session...");
          const isValid = await validateToken(accessToken);
          
          if (!isValid) {
            console.log("Invalid token from URL, showing manual entry option");
            setShowManualEntry(true);
          }
        } else {
          console.log("No valid recovery token found in URL");
          setShowManualEntry(true);
        }
      } catch (err) {
        console.error("Error checking recovery token:", err);
        setError("An error occurred validating your recovery token");
        setShowManualEntry(true);
      } finally {
        setTokenCheckLoading(false);
      }
    };
    
    checkRecoveryToken();
  }, [location]);

  // Handle manual token submission
  const handleManualTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) {
      setError("Please enter your reset token");
      return;
    }
    
    setTokenCheckLoading(true);
    const isValid = await validateToken(manualToken);
    setTokenCheckLoading(false);
    
    if (!isValid) {
      setError("Invalid or expired token. Please request a new password reset.");
    }
  };

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
          ) : showManualEntry ? (
            <div className="space-y-4">
              <Alert className="bg-blue-50 text-blue-800 border-blue-100 mb-4">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  If you have received a password reset email, please paste the token here.
                </AlertDescription>
              </Alert>
              
              <form onSubmit={handleManualTokenSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-token">Reset Token</Label>
                  <Input 
                    id="reset-token"
                    type="text" 
                    placeholder="Paste your reset token here" 
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={tokenCheckLoading}>
                  {tokenCheckLoading ? "Validating..." : "Validate Token"}
                </Button>
              </form>
              
              <div className="text-center mt-2">
                <Button 
                  variant="link" 
                  onClick={() => navigate("/login")}
                >
                  Return to Login
                </Button>
              </div>
            </div>
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

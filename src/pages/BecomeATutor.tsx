
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

const tutorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  subject: z.string().min(1, "Please select a subject."),
  experience: z.string().min(1, "Please select your experience level."),
  bio: z.string().min(50, "Bio must be at least 50 characters."),
  qualifications: z.string().min(10, "Please provide your qualifications."),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to our terms and privacy policy."
  }),
});

const BecomeATutor = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof tutorFormSchema>>({
    resolver: zodResolver(tutorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      experience: "",
      bio: "",
      qualifications: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof tutorFormSchema>) => {
    try {
      setIsSubmitting(true);
      
      // In a real application, this would submit to an API
      console.log("Form submitted:", values);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Show success message
      setIsSuccess(true);
      form.reset();
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Become a Tutor</h1>
      
      <div className="max-w-4xl mx-auto mb-12">
        <p className="text-center text-muted-foreground mb-8">
          Share your knowledge and earn by helping students achieve their academic goals. Join our community of expert tutors today.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Why Join Us?</CardTitle>
              <CardDescription>
                Benefits of becoming a tutor with Scholar LinkUp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Flexible Schedule</h3>
                  <p className="text-sm text-muted-foreground">
                    Set your own hours and work when it's convenient for you
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Competitive Pay</h3>
                  <p className="text-sm text-muted-foreground">
                    Set your own rates and earn based on your expertise
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Grow Your Network</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with students from around the world
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Simple Platform</h3>
                  <p className="text-sm text-muted-foreground">
                    Easy-to-use tools for scheduling, payments, and communication
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tutor Application</CardTitle>
              <CardDescription>
                Fill out the form below to apply as a tutor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <Alert className="bg-green-50 text-green-800 border-green-100 mb-4">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Your application has been submitted successfully! Our team will review your information and contact you soon.
                  </AlertDescription>
                </Alert>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mathematics">Mathematics</SelectItem>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="science">Science</SelectItem>
                                <SelectItem value="history">History</SelectItem>
                                <SelectItem value="computer_science">Computer Science</SelectItem>
                                <SelectItem value="foreign_language">Foreign Language</SelectItem>
                                <SelectItem value="art">Art</SelectItem>
                                <SelectItem value="music">Music</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                              <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                              <SelectItem value="advanced">Advanced (5-10 years)</SelectItem>
                              <SelectItem value="expert">Expert (10+ years)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself, your teaching style, and what makes you a great tutor..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum 50 characters. This will be visible to potential students.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="qualifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualifications</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List your degrees, certifications, and relevant experience..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the <a href="/terms-of-service" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground">
              We review all applications within 3-5 business days.
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BecomeATutor;

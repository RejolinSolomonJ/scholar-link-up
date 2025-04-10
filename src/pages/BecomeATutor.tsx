
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock, Info, Star, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subjects: z.array(z.string()).min(1, "Please select at least one subject."),
  experience: z.string().min(1, "Please select your experience level."),
  bio: z.string().min(20, "Bio must be at least 20 characters."),
  qualifications: z.string().min(10, "Please provide your qualifications."),
  hourly_rate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid hourly rate.",
  }),
  video_teaching: z.boolean().optional(),
  in_person_teaching: z.boolean().optional(),
  terms_agreed: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions." }),
  }),
});

const BecomeATutor = () => {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subjects: [],
      experience: "",
      bio: "",
      qualifications: "",
      hourly_rate: "",
      video_teaching: true,
      in_person_teaching: false,
      terms_agreed: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setError(null);
      setSubmitting(true);
      
      // If the user is not logged in, we need to sign them up
      if (!user) {
        // In a real application, you'd generate a random password or let them set one
        const tempPassword = Math.random().toString(36).slice(2, 10);
        
        // Sign up the user as a tutor
        await signUp(values.email, tempPassword, values.name, "tutor");
        
        // Show success message and redirect
        setSuccess(true);
        setTimeout(() => {
          navigate("/profile");
        }, 3000);
      } else {
        // If user is already logged in, just update their profile to be a tutor
        // This would be implemented in a real application
        setSuccess(true);
        setTimeout(() => {
          navigate("/profile");
        }, 3000);
      }
    } catch (err: any) {
      console.error("Error submitting tutor application:", err);
      setError(err.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // This would be fetched from the backend in a real application
  const subjectOptions = [
    { id: "1", value: "mathematics", label: "Mathematics" },
    { id: "2", value: "science", label: "Science" },
    { id: "3", value: "english", label: "English" },
    { id: "4", value: "history", label: "History" },
    { id: "5", value: "geography", label: "Geography" },
    { id: "6", value: "computer-science", label: "Computer Science" },
  ];

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Become a Tutor</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Share your knowledge, set your own hours, and earn money by teaching students online or in-person.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="border-2 border-primary/10">
          <CardHeader className="text-center">
            <div className="mx-auto rounded-full bg-primary/10 p-3 mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Flexible Schedule</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Set your own hours and availability. Work as much or as little as you want.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/10">
          <CardHeader className="text-center">
            <div className="mx-auto rounded-full bg-primary/10 p-3 mb-4">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Competitive Rates</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Set your own hourly rate and earn money doing what you love.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/10">
          <CardHeader className="text-center">
            <div className="mx-auto rounded-full bg-primary/10 p-3 mb-4">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Online & In-Person</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Choose to teach online, in-person, or both based on your preferences.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 order-2 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Requirements</CardTitle>
              <CardDescription>
                To become a tutor on our platform, you need to meet the following requirements:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Expertise in Your Subject</h4>
                  <p className="text-sm text-muted-foreground">
                    You should have strong knowledge and experience in the subjects you wish to teach.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Education Qualification</h4>
                  <p className="text-sm text-muted-foreground">
                    A minimum of a bachelor's degree or relevant certifications in your field.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Teaching Experience</h4>
                  <p className="text-sm text-muted-foreground">
                    Prior teaching or tutoring experience is preferred but not required.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Technical Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    For online tutoring: reliable internet, webcam, and microphone.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Background Check</h4>
                  <p className="text-sm text-muted-foreground">
                    Willing to undergo a background check for security purposes.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  All applications are reviewed within 2-3 business days.
                </AlertDescription>
              </Alert>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-8 order-1 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Tutor Application Form</CardTitle>
              <CardDescription>
                Fill out the form below to apply as a tutor on our platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Your application has been submitted successfully! You will be redirected to set up your profile.
                  </AlertDescription>
                </Alert>
              )}
              
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
                      name="subjects"
                      render={() => (
                        <FormItem>
                          <FormLabel>Subjects You Can Teach</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {subjectOptions.map((subject) => (
                              <FormField
                                key={subject.id}
                                control={form.control}
                                name="subjects"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={subject.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(subject.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, subject.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== subject.value
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {subject.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your experience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="less than 1">Less than 1 year</SelectItem>
                              <SelectItem value="1-3">1-3 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="5-10">5-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself and your teaching philosophy..."
                              className="resize-none min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This will be displayed on your profile
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="qualifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualifications</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List your degrees, certifications, or relevant qualifications..."
                              className="resize-none min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hourly_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hourly Rate ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your preferred hourly rate in USD
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="video_teaching"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Available for Online Teaching</FormLabel>
                            <FormDescription>
                              You can teach students online via video calls
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="in_person_teaching"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Available for In-Person Teaching</FormLabel>
                            <FormDescription>
                              You can meet students for in-person sessions
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="terms_agreed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Terms and Conditions</FormLabel>
                          <FormDescription>
                            I agree to the <a href="/terms" className="text-primary underline">terms and conditions</a> and <a href="/privacy" className="text-primary underline">privacy policy</a>
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BecomeATutor;

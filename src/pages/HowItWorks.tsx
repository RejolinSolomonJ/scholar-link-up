
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, CheckCircle, Search, UserPlus, Users } from "lucide-react";

const HowItWorks = () => {
  const studentSteps = [
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: "Find the Perfect Tutor",
      description: "Search for tutors based on subject, location, or availability. Browse profiles and read reviews to find your perfect match."
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Book a Session",
      description: "Choose from available time slots and book a session with your selected tutor. Online and in-person options available."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Learn and Grow",
      description: "Attend your session, receive personalized instruction, and track your progress. Continue booking sessions as needed."
    },
  ];

  const tutorSteps = [
    {
      icon: <UserPlus className="h-10 w-10 text-primary" />,
      title: "Create Your Profile",
      description: "Sign up as a tutor, complete your profile with subjects, experience, rates, and availability."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Connect with Students",
      description: "Get matched with students seeking your expertise. Accept or decline booking requests."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Teach and Earn",
      description: "Deliver quality sessions, receive payment, and build your reputation through student reviews."
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">How Scholar LinkUp Works</h1>
        
        <div className="space-y-12">
          {/* For Students */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">For Students</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {studentSteps.map((step, index) => (
                <Card key={`student-${index}`} className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4">{step.icon}</div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{step.description}</p>
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">
                        {index + 1}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* For Tutors */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">For Tutors</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {tutorSteps.map((step, index) => (
                <Card key={`tutor-${index}`} className="border-2 border-accent/10 hover:border-accent/30 transition-colors">
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4">{step.icon}</div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{step.description}</p>
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white font-bold">
                        {index + 1}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Why Choose Scholar LinkUp?</h2>
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="bg-card p-4 rounded border">
              <h3 className="font-semibold text-lg mb-2">Verified Tutors</h3>
              <p className="text-muted-foreground">All tutors undergo a thorough verification process to ensure quality and safety.</p>
            </div>
            <div className="bg-card p-4 rounded border">
              <h3 className="font-semibold text-lg mb-2">Flexible Learning</h3>
              <p className="text-muted-foreground">Choose between online or in-person sessions based on your preferences.</p>
            </div>
            <div className="bg-card p-4 rounded border">
              <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">Our platform handles all payments securely, releasing funds only after sessions are completed.</p>
            </div>
            <div className="bg-card p-4 rounded border">
              <h3 className="font-semibold text-lg mb-2">Community Support</h3>
              <p className="text-muted-foreground">Join a growing community of learners and educators supporting each other.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

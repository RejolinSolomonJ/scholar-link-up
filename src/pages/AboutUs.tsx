
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AboutUs = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Scholar LinkUp</h1>
      
      <div className="max-w-4xl mx-auto mb-12">
        <p className="text-center text-muted-foreground mb-8">
          Scholar LinkUp is a platform dedicated to connecting students with expert tutors to help them achieve their educational goals.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our mission is to make quality education accessible to everyone by providing a platform where students can connect with qualified tutors who can help them succeed in their academic journey.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We envision a world where every student has access to personalized educational support, regardless of their location or background. We believe that with the right guidance, anyone can achieve academic excellence.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src="/placeholder.svg" alt="Dr. Jane Smith" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-lg">Dr. Jane Smith</h3>
            <p className="text-primary">Founder & CEO</p>
            <p className="text-muted-foreground mt-2">Former university professor with over 15 years of experience in education.</p>
          </div>
          
          <div className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src="/placeholder.svg" alt="Michael Chen" />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-lg">Michael Chen</h3>
            <p className="text-primary">CTO</p>
            <p className="text-muted-foreground mt-2">Tech innovator with a passion for creating tools that enhance learning experiences.</p>
          </div>
          
          <div className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src="/placeholder.svg" alt="Sarah Johnson" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-lg">Sarah Johnson</h3>
            <p className="text-primary">Head of Education</p>
            <p className="text-muted-foreground mt-2">Curriculum expert dedicated to maintaining high-quality educational standards.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-muted p-8 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-bold text-lg mb-2">Excellence</h3>
            <p className="text-muted-foreground">We strive for excellence in all aspects of our service, from tutor selection to platform usability.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-bold text-lg mb-2">Accessibility</h3>
            <p className="text-muted-foreground">We believe quality education should be accessible to everyone, regardless of location or background.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-bold text-lg mb-2">Innovation</h3>
            <p className="text-muted-foreground">We continuously innovate to improve the learning experience for both students and tutors.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-bold text-lg mb-2">Community</h3>
            <p className="text-muted-foreground">We foster a supportive community where knowledge sharing and growth are encouraged.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

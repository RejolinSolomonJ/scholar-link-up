
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AboutUs = () => {
  return (
    <div className="container max-w-4xl py-6">
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">About Scholar LinkUp</CardTitle>
          <CardDescription className="text-lg">
            Connecting students and tutors for better learning experiences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Scholar LinkUp was founded with a simple mission: to make quality education accessible to everyone by connecting students with passionate tutors. 
            Our platform makes it easy for students to find the right tutor for their specific needs, and for tutors to share their expertise with eager learners.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            <div>
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                We believe that personalized learning can transform lives. By matching students with the right tutors, we help learners overcome challenges, 
                develop confidence, and achieve their academic goals. Our platform makes it easier than ever to find, schedule, and manage tutoring sessions.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
              <p className="text-muted-foreground">
                We envision a world where everyone has access to the educational support they need to succeed. We're building a community where knowledge is shared, 
                learning is celebrated, and both students and tutors can thrive together.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mb-6">Our Values</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Excellence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We're committed to excellence in education, technology, and customer service. We continuously strive to improve our platform based on feedback from our community.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Accessibility</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We believe education should be accessible to everyone, regardless of background or location. Our platform connects students with tutors across different subjects and skill levels.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We foster a supportive community where students and tutors can connect, collaborate, and grow together. We celebrate diversity and different learning styles.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* This section can be filled with actual team information later */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">Jane Doe</h3>
            <p className="text-sm text-muted-foreground mb-2">CEO & Founder</p>
            <p className="text-sm text-muted-foreground">
              Former educator passionate about making education accessible to everyone.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">John Smith</h3>
            <p className="text-sm text-muted-foreground mb-2">CTO</p>
            <p className="text-sm text-muted-foreground">
              Tech enthusiast with a background in education technology.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">Maria Park</h3>
            <p className="text-sm text-muted-foreground mb-2">Head of Education</p>
            <p className="text-sm text-muted-foreground">
              Experienced educator dedicated to improving teaching methods.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutUs;

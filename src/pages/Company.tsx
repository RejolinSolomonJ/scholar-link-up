
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { TeamMember } from "@/types/database.types";
import { BadgeCheck, BookOpen, Heart, Landmark, Mail, MapPin, Phone, Users } from "lucide-react";

// This would be fetched from the API in a real application
const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Alexander Barnes",
    role: "Founder & CEO",
    bio: "Former university professor with a passion for making education accessible to all. Dr. Barnes founded Scholar LinkUp to bridge the gap between students and quality tutoring.",
    avatar_url: "/placeholder.svg",
    order: 1
  },
  {
    id: "2",
    name: "Emily Rodriguez",
    role: "Chief Learning Officer",
    bio: "With over 15 years in educational psychology, Emily ensures our platform uses research-backed approaches to facilitate effective learning experiences.",
    avatar_url: "/placeholder.svg",
    order: 2
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "Chief Technology Officer",
    bio: "A Silicon Valley veteran who leads our engineering team in building an intuitive and seamless platform for students and tutors worldwide.",
    avatar_url: "/placeholder.svg",
    order: 3
  },
  {
    id: "4",
    name: "Sarah Johnson",
    role: "Head of Tutor Success",
    bio: "Former educator who works closely with our tutors to ensure they have the resources and support needed to deliver exceptional learning experiences.",
    avatar_url: "/placeholder.svg",
    order: 4
  },
  {
    id: "5",
    name: "David Wilson",
    role: "Head of Student Experience",
    bio: "Dedicated to making sure every student finds the right tutor and achieves their learning goals through personalized support.",
    avatar_url: "/placeholder.svg",
    order: 5
  },
  {
    id: "6",
    name: "Priya Patel",
    role: "Director of Global Expansion",
    bio: "Working to bring Scholar LinkUp to students and tutors across the globe, with a focus on underserved communities.",
    avatar_url: "/placeholder.svg",
    order: 6
  }
];

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <div className="aspect-square relative overflow-hidden rounded-t-lg bg-primary/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <Avatar className="h-40 w-40">
            <AvatarImage src={member.avatar_url || ""} alt={member.name} />
            <AvatarFallback className="text-4xl">{getInitials(member.name)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <CardHeader className="text-center pb-2">
        <h3 className="text-xl font-bold">{member.name}</h3>
        <p className="text-primary font-medium">{member.role}</p>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center">{member.bio}</p>
      </CardContent>
    </Card>
  );
};

const Company = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <section className="mb-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Scholar LinkUp</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Scholar LinkUp was founded in 2022 by Dr. Alexander Barnes, a former university professor who recognized the need for accessible, high-quality tutoring for students of all backgrounds.
              </p>
              <p className="text-muted-foreground mb-4">
                What began as a small community of passionate educators has grown into a global platform connecting thousands of students with expert tutors across dozens of subjects.
              </p>
              <p className="text-muted-foreground">
                Today, we continue to innovate and expand our services, guided by our founding mission to democratize education and empower learners worldwide.
              </p>
            </div>
            <div className="bg-primary/5 p-8 rounded-lg">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Landmark className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Founded</h3>
                    <p className="text-muted-foreground">2022 in San Francisco, CA</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Community</h3>
                    <p className="text-muted-foreground">5,000+ tutors and 20,000+ students</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <BookOpen className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Subjects</h3>
                    <p className="text-muted-foreground">50+ subjects across all educational levels</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <BadgeCheck className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Success Rate</h3>
                    <p className="text-muted-foreground">95% of students report grade improvements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-20 bg-muted py-16 px-4 -mx-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Our Mission & Vision</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto rounded-full bg-primary/10 p-3 mb-4 w-16 h-16 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Our Mission</h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  To connect motivated learners with passionate educators through a platform that makes high-quality education accessible, affordable, and tailored to individual needs.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto rounded-full bg-primary/10 p-3 mb-4 w-16 h-16 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Our Vision</h3>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  To create a world where every student, regardless of background or location, has access to the personalized educational support they need to reach their full potential.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 space-y-4">
            <h3 className="text-xl font-bold">Our Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded border">
                <h4 className="font-semibold mb-2">Accessibility</h4>
                <p className="text-sm text-muted-foreground">Education should be accessible to all, regardless of location or background.</p>
              </div>
              <div className="bg-card p-4 rounded border">
                <h4 className="font-semibold mb-2">Quality</h4>
                <p className="text-sm text-muted-foreground">We maintain high standards for our tutors to ensure exceptional learning experiences.</p>
              </div>
              <div className="bg-card p-4 rounded border">
                <h4 className="font-semibold mb-2">Innovation</h4>
                <p className="text-sm text-muted-foreground">We continuously improve our platform with cutting-edge educational technology.</p>
              </div>
              <div className="bg-card p-4 rounded border">
                <h4 className="font-semibold mb-2">Community</h4>
                <p className="text-sm text-muted-foreground">We foster a supportive community of learners and educators.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Team</h2>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockTeamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Contact Information</h2>
        
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        123 Education Lane<br />
                        San Francisco, CA 94103<br />
                        United States
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        info@scholarlinkup.com<br />
                        support@scholarlinkup.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">Phone</h3>
                      <p className="text-muted-foreground">
                        +1 (555) 123-4567<br />
                        Monday-Friday, 9am-5pm PT
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg overflow-hidden h-64 md:h-auto">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.01129369014!2d-122.43913534179684!3d37.77493107931358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1649458732720!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="text-center">
                <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                <div className="flex justify-center space-x-4">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Facebook</a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">LinkedIn</a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Instagram</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Company;

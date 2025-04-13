
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Student",
      subject: "Mathematics",
      image: "/placeholder.svg",
      story: "I was struggling with calculus for months. After just 5 sessions with my tutor on ScholarLinkUp, I improved my grade from a C to an A-. The personalized approach made all the difference!",
      improvement: "Grade improved from C to A-"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Student",
      subject: "Physics",
      image: "/placeholder.svg",
      story: "Finding a tutor who could explain quantum mechanics clearly seemed impossible until I joined ScholarLinkUp. My tutor's patience and expertise helped me understand concepts I had struggled with for years.",
      improvement: "Accepted to PhD program"
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "Parent",
      subject: "English Literature",
      image: "/placeholder.svg", 
      story: "My daughter was hesitant about getting a tutor online, but her ScholarLinkUp mentor made her feel comfortable immediately. Her essay writing has improved dramatically, and she's now considering majoring in English!",
      improvement: "Won school writing competition"
    },
    {
      id: 4,
      name: "David Rodriguez",
      role: "Tutor",
      subject: "Computer Science",
      image: "/placeholder.svg",
      story: "Being a tutor on ScholarLinkUp has been incredibly rewarding. I've helped dozens of students master programming concepts, and watching them succeed in their careers has been the highlight of my teaching experience.",
      improvement: "Helped 50+ students"
    }
  ];

  return (
    <div className="container py-12 px-4 mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover how ScholarLinkUp has transformed learning experiences for students across the globe. 
          These success stories highlight the power of personalized education.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
        {stories.map((story) => (
          <Card key={story.id} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={story.image} alt={story.name} />
                    <AvatarFallback>{story.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{story.name}</CardTitle>
                    <CardDescription>{story.role}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary">{story.subject}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <blockquote className="italic text-muted-foreground mb-4">
                "{story.story}"
              </blockquote>
              <div className="mt-2 flex items-center">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {story.improvement}
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Read Full Story</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-secondary p-8 rounded-lg text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">Have a success story to share?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          We'd love to hear how ScholarLinkUp has helped you achieve your academic goals.
          Share your experience and inspire others on their learning journey.
        </p>
        <Button>Share Your Story</Button>
      </div>
    </div>
  );
};

export default SuccessStories;

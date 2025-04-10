
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Testimonial } from "@/types/database.types";
import { LoadingSpinner, ErrorDisplay } from "@/components/ui/loading-states";
import { QuoteIcon, Star } from "lucide-react";

// This would be fetched from the API in a real application
const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    student_name: "Sarah Johnson",
    student_avatar: "/placeholder.svg",
    course_name: "Advanced Calculus",
    subject: "Mathematics",
    content: "I was struggling with calculus for months before I found Scholar LinkUp. My tutor was patient and broke down complex concepts in a way that finally made sense to me. I went from nearly failing to getting an A- on my final exam!",
    rating: 5,
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    student_name: "Michael Chen",
    student_avatar: "/placeholder.svg",
    course_name: "English Literature",
    subject: "English",
    content: "The personalized approach to teaching literature transformed my understanding of classic texts. My tutor helped me develop critical analysis skills that improved my essay writing dramatically. I'm now considering majoring in English!",
    rating: 5,
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    student_name: "David Rodriguez",
    student_avatar: "/placeholder.svg",
    course_name: "Intro to Programming",
    subject: "Computer Science",
    content: "As someone with no prior coding experience, I was nervous about taking a programming course. My tutor on Scholar LinkUp made learning Python fun and accessible. I've now built several small applications and am continuing to advance my skills.",
    rating: 4,
    created_at: new Date().toISOString()
  },
  {
    id: "4",
    student_name: "Emma Wilson",
    student_avatar: "/placeholder.svg",
    course_name: "Chemistry Fundamentals",
    subject: "Chemistry",
    content: "Chemistry always seemed like a foreign language to me until I started working with my tutor. The way she explained molecular interactions and chemical reactions made everything click. I'm no longer afraid of science classes!",
    rating: 5,
    created_at: new Date().toISOString()
  },
  {
    id: "5",
    student_name: "James Lee",
    student_avatar: "/placeholder.svg",
    course_name: "SAT Prep Course",
    subject: "Test Preparation",
    content: "I improved my SAT score by over 200 points after just 8 sessions with my tutor. His strategies for approaching the different sections were incredibly effective. I got accepted to my dream school thanks to my improved score!",
    rating: 5,
    created_at: new Date().toISOString()
  },
  {
    id: "6",
    student_name: "Sophia Martinez",
    student_avatar: "/placeholder.svg",
    course_name: "Public Speaking",
    subject: "Communication",
    content: "I used to have severe anxiety about speaking in front of groups. My tutor created a safe environment for me to practice and gradually build confidence. I recently gave a presentation to over 100 people without breaking a sweat!",
    rating: 4,
    created_at: new Date().toISOString()
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="absolute top-0 right-0 text-primary/10 transform translate-x-4 -translate-y-4">
        <QuoteIcon className="h-24 w-24" />
      </div>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={testimonial.student_avatar || ""} alt={testimonial.student_name} />
          <AvatarFallback>{getInitials(testimonial.student_name)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{testimonial.student_name}</CardTitle>
          <div className="flex items-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-grow flex flex-col">
        <div className="mb-4 flex flex-wrap gap-2">
          {testimonial.course_name && (
            <Badge variant="secondary">
              {testimonial.course_name}
            </Badge>
          )}
          {testimonial.subject && (
            <Badge variant="outline">
              {testimonial.subject}
            </Badge>
          )}
        </div>
        
        <blockquote className="italic text-muted-foreground relative line-clamp-5">
          "{testimonial.content}"
        </blockquote>
        
        <div className="mt-auto pt-4 text-xs text-muted-foreground">
          {new Date(testimonial.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedTestimonial = ({ testimonial }: { testimonial: Testimonial }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <div className="bg-primary/5 rounded-lg p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 text-primary/10 transform translate-x-4 -translate-y-4">
        <QuoteIcon className="h-40 w-40" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16 border-4 border-background">
            <AvatarImage src={testimonial.student_avatar || ""} alt={testimonial.student_name} />
            <AvatarFallback className="text-lg">{getInitials(testimonial.student_name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{testimonial.student_name}</h3>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          {testimonial.course_name && (
            <Badge className="text-sm px-3 py-1">
              {testimonial.course_name}
            </Badge>
          )}
          {testimonial.subject && (
            <Badge variant="outline" className="text-sm px-3 py-1">
              {testimonial.subject}
            </Badge>
          )}
        </div>
        
        <blockquote className="text-lg md:text-xl italic relative">
          "{testimonial.content}"
        </blockquote>
      </div>
    </div>
  );
};

const SuccessStories = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [featuredTestimonial, setFeaturedTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate API call
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        setTimeout(() => {
          const featured = mockTestimonials.find(t => t.id === "1") || mockTestimonials[0];
          const rest = mockTestimonials.filter(t => t.id !== featured.id);
          
          setFeaturedTestimonial(featured);
          setTestimonials(rest);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setError("Failed to load success stories. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);
  
  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <LoadingSpinner className="py-16" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-12">
        <ErrorDisplay message={error} />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Success Stories</h1>
      
      <div className="max-w-4xl mx-auto mb-10">
        <p className="text-center text-muted-foreground mb-8">
          Read about the real-life success stories of students who have transformed their learning journey with our platform.
        </p>
      </div>
      
      {featuredTestimonial && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Story</h2>
          <FeaturedTestimonial testimonial={featuredTestimonial} />
        </div>
      )}
      
      <div>
        <h2 className="text-2xl font-bold mb-6">More Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Share Your Success Story</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Have you had a transformative learning experience with Scholar LinkUp? We'd love to hear about it and share your story with our community.
        </p>
        <Button className="mx-auto" size="lg">
          Submit Your Story
        </Button>
      </div>
    </div>
  );
};

export default SuccessStories;

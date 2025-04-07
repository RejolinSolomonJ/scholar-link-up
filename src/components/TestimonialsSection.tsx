
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "Scholar LinkUp helped me find a math tutor who actually made calculus fun! The scheduling system made it easy to book sessions around my busy schedule.",
    name: "Alex Johnson",
    role: "High School Student",
    avatar: ""
  },
  {
    quote: "As a tutor, this platform has connected me with students who are eager to learn. The messaging system makes communication simple and professional.",
    name: "Dr. Maria Chen",
    role: "Physics Tutor",
    avatar: ""
  },
  {
    quote: "I needed help preparing for my GMAT exam, and found an excellent tutor through Scholar LinkUp. The detailed profiles made it easy to find someone with the right expertise.",
    name: "James Wilson",
    role: "MBA Applicant",
    avatar: ""
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
            Join thousands of students and teachers who are already using Scholar LinkUp
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-md h-full flex flex-col">
              <CardContent className="pt-6 flex-grow">
                <p className="italic text-foreground/80">"{testimonial.quote}"</p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

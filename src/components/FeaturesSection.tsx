
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, MessageSquare, Star } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Find the Perfect Match",
    description: "Search for tutors based on subject, location, price, and teaching style to find your ideal learning partner."
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Book sessions at times that work for you, whether you prefer regular weekly lessons or occasional help."
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description: "Message tutors directly through our platform to discuss your needs before booking a session."
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description: "Read authentic reviews from other students to help you make informed decisions."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">How Scholar LinkUp Works</h2>
          <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
            Our platform makes it easy to connect with tutors and start learning
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground/80">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

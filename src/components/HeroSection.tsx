
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero-gradient py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter animate-fade-in">
            Connect with the Perfect Tutor
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] animate-fade-in">
            Find qualified tutors for personalized learning experiences, online or in-person
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in">
            <Button asChild size="lg" className="text-lg">
              <Link to="/register?role=student">I Need a Tutor</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link to="/register?role=teacher">I Want to Teach</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

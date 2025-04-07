
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl opacity-90">
            Join Scholar LinkUp today and connect with tutors who can help you achieve your learning goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link to="/register">Get Started Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white hover:bg-white/10">
              <Link to="/search">Browse Tutors</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;

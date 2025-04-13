
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Navbar for landing page */}
      <header className="bg-white border-b py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary font-bold text-xl">Scholar</span>
            <span className="text-accent font-bold text-xl">LinkUp</span>
          </Link>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>About</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/about"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            About ScholarLinkUp
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Learn more about our mission to connect students with the perfect tutors.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link
                        to="/how-it-works"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">How It Works</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Our platform explained in simple steps
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/success-stories"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Success Stories</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Read about how we've helped students excel
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contact"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Contact Us</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Get in touch with our team
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <Link
                        to="/subjects"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Subjects</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Explore the wide range of subjects we offer
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/resources"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Learning Resources</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Access our library of educational materials
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/faqs"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">FAQs</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Answers to commonly asked questions
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/search"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Find a Tutor</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Search for tutors by subject, availability, and more
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/how-it-works" className={cn(navigationMenuTriggerStyle())}>
                  How It Works
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/faqs" className={cn(navigationMenuTriggerStyle())}>
                  FAQs
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/contact">Contact</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-primary font-bold text-xl">Scholar</span>
              <span className="text-accent font-bold text-xl">LinkUp</span>
            </Link>
            <p className="text-muted-foreground">
              Connecting students with the perfect tutors for personalized learning experiences.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3">For Students</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-foreground">
                  Find a Tutor
                </Link>
              </li>
              <li>
                <Link to="/register?role=student" className="text-muted-foreground hover:text-foreground">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/subjects" className="text-muted-foreground hover:text-foreground">
                  Subjects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3">For Tutors</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register?role=teacher" className="text-muted-foreground hover:text-foreground">
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link to="/tutor-resources" className="text-muted-foreground hover:text-foreground">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/tutor-success" className="text-muted-foreground hover:text-foreground">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/tutor-faq" className="text-muted-foreground hover:text-foreground">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Scholar LinkUp. All rights reserved.</p>
          <p className="mt-1">
            Developed by <span className="text-foreground font-medium">Lin's Infotechs</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

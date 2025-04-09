
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Search, 
  Calendar, 
  MessageSquare, 
  User, 
  Settings,
  BookOpen,
  PlusCircle,
  Info
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Base navigation items for all users
  const baseItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Search, label: "Find Tutors", path: "/search" },
    { icon: Calendar, label: "Bookings", path: "/bookings" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: User, label: "Profile", path: "/profile" },
  ];
  
  // Additional items for tutors
  const tutorItems = [
    { icon: BookOpen, label: "My Courses", path: "/courses" },
    { icon: PlusCircle, label: "Create Course", path: "/create-course" },
  ];
  
  // Settings and About Us items for everyone
  const commonItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Info, label: "About Us", path: "/about" }
  ];
  
  // Determine which items to show based on user role
  const getNavItems = () => {
    const items = [...baseItems];
    
    // Add tutor-specific items if the user is a tutor
    if (user?.user_metadata?.role === 'tutor') {
      items.splice(1, 0, ...tutorItems);
    }
    
    // Add common items at the end
    return [...items, ...commonItems];
  };
  
  const navItems = getNavItems();

  if (!isOpen) return null;

  return (
    <aside className="w-64 border-r bg-white h-full transition-all overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

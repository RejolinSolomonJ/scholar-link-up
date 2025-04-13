
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
  Info,
  HelpCircle,
  FileText,
  Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getConversations } from "@/lib/api";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Track unread messages
  useEffect(() => {
    const checkUnreadMessages = async () => {
      if (!user?.id) return;
      
      try {
        const conversations = await getConversations(user.id);
        let count = 0;
        
        for (const conversation of conversations) {
          const hasUnread = conversation.messages?.some(
            (m: any) => m.recipient_id === user.id && !m.is_read
          );
          
          if (hasUnread) count++;
        }
        
        setUnreadCount(count);
      } catch (error) {
        console.error("Error checking unread messages:", error);
      }
    };
    
    checkUnreadMessages();
    
    // Poll for new messages every minute
    const interval = setInterval(checkUnreadMessages, 60000);
    return () => clearInterval(interval);
  }, [user?.id]);
  
  // Base navigation items for all users
  const baseItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Search, label: "Find Tutors", path: "/search" },
    { icon: Calendar, label: "Bookings", path: "/bookings" },
    { icon: MessageSquare, label: "Messages", path: "/messages", badge: unreadCount > 0 ? unreadCount : undefined },
    { icon: User, label: "Profile", path: "/profile" },
  ];
  
  // Additional items for tutors
  const tutorItems = [
    { icon: BookOpen, label: "My Courses", path: "/courses" },
    { icon: PlusCircle, label: "Create Course", path: "/create-course" },
  ];
  
  // Resource and help items
  const resourceItems = [
    { icon: FileText, label: "Resources", path: "/resources" },
    { icon: Star, label: "Success Stories", path: "/success-stories" },
    { icon: HelpCircle, label: "FAQs", path: "/faqs" },
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
    
    // Add resource items
    items.push(...resourceItems);
    
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
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">{item.badge}</Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

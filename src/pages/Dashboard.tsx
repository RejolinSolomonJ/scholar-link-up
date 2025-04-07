
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Calendar, MessageSquare, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data - in a real app this would come from an API
  const stats = [
    { 
      label: "Upcoming Sessions", 
      value: 3, 
      icon: Calendar, 
      color: "bg-blue-100 text-blue-700",
      link: "/bookings"
    },
    { 
      label: "New Messages", 
      value: 5, 
      icon: MessageSquare, 
      color: "bg-green-100 text-green-700",
      link: "/messages"
    },
    { 
      label: "Subjects", 
      value: 4, 
      icon: Search, 
      color: "bg-purple-100 text-purple-700",
      link: "/profile"
    },
    { 
      label: "Rating", 
      value: "4.8", 
      icon: Star, 
      color: "bg-amber-100 text-amber-700",
      link: "/profile"
    }
  ];

  // Recent activities - would be from an API
  const activities = [
    {
      type: "booking",
      title: "Math Session Confirmed",
      description: "Your session with John Doe on April 10 is confirmed",
      time: "2 hours ago"
    },
    {
      type: "message",
      title: "New Message",
      description: "Sarah Smith sent you a message about your Chemistry tutoring",
      time: "5 hours ago"
    },
    {
      type: "review",
      title: "New Review",
      description: "You received a 5-star review from Michael Brown",
      time: "Yesterday"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/search">Find Tutors</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <Button variant="ghost" asChild className="p-0 h-auto text-primary hover:text-primary/80">
                  <Link to={stat.link}>View details →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recommended Tutors</CardTitle>
            <CardDescription>Based on your interests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center gap-3 border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Alex Johnson</h4>
                    <p className="text-xs text-muted-foreground">Physics, Math • $40/hr</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/search">View All Tutors</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

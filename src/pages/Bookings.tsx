
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Video, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Mock data - would come from API
const upcomingSessions = [
  {
    id: 1,
    subject: "Physics",
    topic: "Quantum Mechanics",
    date: "April 10, 2023",
    time: "3:00 PM - 4:30 PM",
    student: {
      name: "Alex Johnson",
      avatar: ""
    },
    mode: "online",
    status: "confirmed"
  },
  {
    id: 2,
    subject: "Math",
    topic: "Calculus II",
    date: "April 12, 2023",
    time: "5:00 PM - 6:00 PM",
    student: {
      name: "Sarah Brown",
      avatar: ""
    },
    mode: "in-person",
    location: "Boston Public Library",
    status: "confirmed"
  },
  {
    id: 3,
    subject: "Physics",
    topic: "Thermodynamics",
    date: "April 15, 2023",
    time: "10:00 AM - 11:30 AM",
    student: {
      name: "Michael Chen",
      avatar: ""
    },
    mode: "online",
    status: "pending"
  }
];

const pastSessions = [
  {
    id: 101,
    subject: "Physics",
    topic: "Electromagnetism",
    date: "March 28, 2023",
    time: "4:00 PM - 5:30 PM",
    student: {
      name: "James Wilson",
      avatar: ""
    },
    mode: "online",
    status: "completed",
    reviewed: true
  },
  {
    id: 102,
    subject: "Math",
    topic: "Differential Equations",
    date: "March 25, 2023",
    time: "2:00 PM - 3:00 PM",
    student: {
      name: "Emily Davis",
      avatar: ""
    },
    mode: "in-person",
    location: "Coffee Shop",
    status: "completed",
    reviewed: false
  }
];

const Bookings = () => {
  const handleAccept = (id: number) => {
    toast.success("Session accepted successfully!");
  };

  const handleDecline = (id: number) => {
    toast.success("Session declined.");
  };

  const handleCancel = (id: number) => {
    toast.success("Session canceled successfully!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.filter(s => s.status === "confirmed").map((session) => (
              <Card key={session.id} className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{session.subject}</CardTitle>
                      <CardDescription>{session.topic}</CardDescription>
                    </div>
                    <Badge>{session.mode === "online" ? "Online" : "In-Person"}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {session.date}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {session.time}
                    </div>
                    {session.mode === "in-person" && session.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {session.location}
                      </div>
                    )}
                    <div className="flex items-center mt-3">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={session.student.avatar} />
                        <AvatarFallback>{session.student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{session.student.name}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/messages?user=${session.student.name.toLowerCase().replace(' ', '')}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Link>
                  </Button>
                  {session.mode === "online" ? (
                    <Button size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Join Session
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleCancel(session.id)}>
                      Cancel
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
            
            {upcomingSessions.filter(s => s.status === "confirmed").length === 0 && (
              <div className="col-span-full">
                <Card className="shadow-sm">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
                    <Button asChild className="mt-4">
                      <Link to="/search">Find Tutors</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastSessions.map((session) => (
              <Card key={session.id} className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{session.subject}</CardTitle>
                      <CardDescription>{session.topic}</CardDescription>
                    </div>
                    <Badge variant="outline">{session.mode === "online" ? "Online" : "In-Person"}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {session.date}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {session.time}
                    </div>
                    {session.mode === "in-person" && session.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {session.location}
                      </div>
                    )}
                    <div className="flex items-center mt-3">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={session.student.avatar} />
                        <AvatarFallback>{session.student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{session.student.name}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/messages?user=${session.student.name.toLowerCase().replace(' ', '')}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Link>
                  </Button>
                  {!session.reviewed && (
                    <Button size="sm">Leave Review</Button>
                  )}
                  {session.reviewed && (
                    <Badge variant="outline">Reviewed</Badge>
                  )}
                </CardFooter>
              </Card>
            ))}
            
            {pastSessions.length === 0 && (
              <div className="col-span-full">
                <Card className="shadow-sm">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No past sessions found.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.filter(s => s.status === "pending").map((session) => (
              <Card key={session.id} className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{session.subject}</CardTitle>
                      <CardDescription>{session.topic}</CardDescription>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {session.date}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {session.time}
                    </div>
                    {session.mode === "in-person" && session.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {session.location}
                      </div>
                    )}
                    <div className="flex items-center mt-3">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={session.student.avatar} />
                        <AvatarFallback>{session.student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{session.student.name}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDecline(session.id)}
                  >
                    Decline
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleAccept(session.id)}
                  >
                    Accept
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {upcomingSessions.filter(s => s.status === "pending").length === 0 && (
              <div className="col-span-full">
                <Card className="shadow-sm">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No pending session requests.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookings;

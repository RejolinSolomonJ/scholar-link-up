
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBookings, getTutorSubjects, getTutorAvailability } from "@/lib/api";
import { Calendar, Clock, BookOpen, Users, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Booking, TutorSubject, Availability } from "@/types/database.types";

const DashboardCard = ({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: any;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subjects, setSubjects] = useState<TutorSubject[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user || !profile) return;

      try {
        setLoading(true);
        const userBookings = await getUserBookings(user.id);
        setBookings(userBookings);

        if (profile.role === 'tutor') {
          const [tutorSubjects, tutorAvailability] = await Promise.all([
            getTutorSubjects(user.id),
            getTutorAvailability(user.id),
          ]);
          setSubjects(tutorSubjects);
          setAvailability(tutorAvailability);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      loadData();
    }
  }, [user, profile]);

  const upcomingBookings = bookings.filter(b => 
    (b.status === 'confirmed' || b.status === 'requested') && 
    new Date(b.start_time) > new Date()
  );
  
  const completedBookings = bookings.filter(b => b.status === 'completed');
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const isStudent = profile?.role === 'student';

  if (profileLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <p>Please complete your profile to see your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile.avatar_url || ""} alt={profile.name} />
                <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold mb-1">{profile.name}</h3>
              <p className="text-muted-foreground capitalize mb-4">{profile.role}</p>
              {profile.role === 'tutor' && (
                <p className="font-semibold text-xl text-primary">${profile.hourly_rate}/hr</p>
              )}
              {profile.bio && (
                <p className="mt-4 text-sm">{profile.bio}</p>
              )}
              <Button className="mt-6" asChild>
                <a href="/profile">Edit Profile</a>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <DashboardCard
              title="Upcoming Sessions"
              value={upcomingBookings.length}
              description="Sessions scheduled for the future"
              icon={Calendar}
            />
            <DashboardCard
              title="Completed Sessions"
              value={completedBookings.length}
              description="Total completed tutoring sessions"
              icon={Clock}
            />
            {isStudent ? (
              <DashboardCard
                title="Total Tutors"
                value={Array.from(new Set(completedBookings.map(b => b.tutor_id))).length}
                description="Different tutors you've worked with"
                icon={Users}
              />
            ) : (
              <DashboardCard
                title="Subjects Offered"
                value={subjects.length}
                description="Number of subjects you teach"
                icon={BookOpen}
              />
            )}
          </div>
          
          <div className="mt-6">
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
                <TabsTrigger value="past">Past Sessions</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">
                                {isStudent ? `Session with Tutor` : `Student Session`}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(booking.start_time), 'EEEE, MMMM d, yyyy')} • {' '}
                                {format(new Date(booking.start_time), 'h:mm a')} - {format(new Date(booking.end_time), 'h:mm a')}
                              </p>
                              <p className="text-sm mt-1">
                                Status: <span className="font-medium capitalize">{booking.status}</span>
                              </p>
                            </div>
                            <Button asChild size="sm">
                              <a href="/bookings">View</a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground mb-4">No upcoming sessions</p>
                      {isStudent && (
                        <Button asChild>
                          <a href="/search">Find a Tutor</a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="past">
                {completedBookings.length > 0 ? (
                  <div className="space-y-4">
                    {completedBookings.slice(0, 5).map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">
                                {isStudent ? `Session with Tutor` : `Student Session`}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(booking.start_time), 'EEEE, MMMM d, yyyy')} • {' '}
                                {format(new Date(booking.start_time), 'h:mm a')} - {format(new Date(booking.end_time), 'h:mm a')}
                              </p>
                            </div>
                            <Button variant="outline" asChild size="sm">
                              <a href="/bookings">View</a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No past sessions</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

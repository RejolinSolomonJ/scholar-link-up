import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBookings, getTutorSubjects, getTutorAvailability, getAllCourses } from "@/lib/api";
import { Calendar, Clock, BookOpen, Users, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Booking, TutorSubject, Availability, Course } from "@/types/database.types";
import { LoadingSpinner, ErrorDisplay } from "@/components/ui/loading-states";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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

const getLevelBadgeColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'advanced':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subjects, setSubjects] = useState<TutorSubject[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user || !profile) return;

      try {
        setLoading(true);
        setError(null);
        
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
        
        const allCourses = await getAllCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
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
  
  const relevantCourses = isStudent 
    ? courses
    : courses.filter(course => course.tutor_id === user?.id);

  if (profileLoading || loading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingSpinner className="py-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <ErrorDisplay 
          message={error} 
          retry={() => window.location.reload()} 
        />
      </div>
    );
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
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
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

          {isStudent && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
              {relevantCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relevantCourses.slice(0, 4).map((course) => (
                    <Card key={course.id} className="overflow-hidden flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className={cn(getLevelBadgeColor(course.level))}>
                            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                          </Badge>
                          <Badge variant="outline">${course.price}</Badge>
                        </div>
                        <CardTitle className="text-xl mt-2">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>{course.duration_weeks} weeks</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-2 h-4 w-4" />
                            <span>{course.current_students || 0} / {course.max_students} students</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button variant="outline" asChild className="w-full">
                          <Link to={`/courses/${course.id}`}>
                            View Course
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No courses currently available</p>
                    <Button asChild>
                      <Link to="/search">Find a Tutor</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
              {relevantCourses.length > 4 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" asChild>
                    <Link to="/courses">View All Courses</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-2">
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

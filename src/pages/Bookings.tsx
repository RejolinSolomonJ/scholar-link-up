
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, Video, User, Users } from "lucide-react";
import { getUserBookings, updateBookingStatus, getStudentEnrollments } from "@/lib/api";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { Skeleton } from "@/components/ui/skeleton";
import type { Booking, BookingStatus, CourseEnrollment } from "@/types/database.types";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case "requested":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const BookingCard = ({ booking, isStudent, onStatusChange }: { 
  booking: Booking; 
  isStudent: boolean;
  onStatusChange: () => void;
}) => {
  const [updating, setUpdating] = useState(false);
  
  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      setUpdating(true);
      await updateBookingStatus(booking.id, newStatus);
      toast.success(`Booking ${newStatus} successfully`);
      onStatusChange();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    } finally {
      setUpdating(false);
    }
  };

  const tutor = (booking as any).profiles;
  const student = (booking as any).student_profile;
  const subject = (booking as any).subjects;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={isStudent ? tutor?.avatar_url : student?.avatar_url} />
              <AvatarFallback>
                {isStudent 
                  ? tutor?.name?.charAt(0).toUpperCase() 
                  : student?.name?.charAt(0).toUpperCase() || 'S'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                {isStudent 
                  ? `Session with ${tutor?.name}` 
                  : `Session with ${student?.name || 'Student'}`}
              </CardTitle>
              <CardDescription>
                {subject?.name || 'General Tutoring'}
              </CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <div className="flex items-center text-muted-foreground">
            <CalendarIcon className="mr-1 h-4 w-4" />
            {format(new Date(booking.start_time), 'EEEE, MMMM d, yyyy')}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {format(new Date(booking.start_time), 'h:mm a')} - {format(new Date(booking.end_time), 'h:mm a')}
          </div>
          {booking.mode === 'online' ? (
            <div className="flex items-center text-muted-foreground">
              <Video className="mr-1 h-4 w-4" />
              Online Session
              {booking.meeting_link && (
                <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer" className="ml-1 text-primary underline">
                  Join
                </a>
              )}
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              {booking.location || 'Location not specified'}
            </div>
          )}
          {!isStudent && booking.notes?.includes('course:') && (
            <div className="flex items-center text-muted-foreground mt-2">
              <Users className="mr-1 h-4 w-4" />
              Course Enrollment Session
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 w-full justify-end">
          {booking.status === 'requested' && (
            <>
              {!isStudent && (
                <Button 
                  size="sm" 
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={updating}
                >
                  Confirm
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleStatusChange('cancelled')}
                disabled={updating}
              >
                Cancel
              </Button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <>
              <Button 
                size="sm" 
                onClick={() => handleStatusChange('completed')}
                disabled={updating}
              >
                Mark Completed
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleStatusChange('cancelled')}
                disabled={updating}
              >
                Cancel
              </Button>
            </>
          )}
          {!isStudent && (
            <Button 
              size="sm" 
              variant="outline" 
              asChild
            >
              <Link to={`/messages?tutorId=${booking.tutor_id}&studentId=${booking.student_id}`}>
                Message Student
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

const EnrollmentCard = ({ enrollment }: { enrollment: CourseEnrollment }) => {
  const course = enrollment.courses;
  const tutor = course?.profiles;

  if (!course) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={tutor?.avatar_url} />
              <AvatarFallback>{tutor?.name?.charAt(0).toUpperCase() || 'T'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{course.title}</CardTitle>
              <CardDescription>
                {tutor?.name || 'Tutor'}
              </CardDescription>
            </div>
          </div>
          <Badge className={
            enrollment.status === 'active' 
              ? "bg-green-100 text-green-800" 
              : enrollment.status === 'completed' 
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
          }>
            {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <div className="flex items-center text-muted-foreground">
            <CalendarIcon className="mr-1 h-4 w-4" />
            Enrolled on {format(new Date(enrollment.enrollment_date), 'MMMM d, yyyy')}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {course.duration_weeks} week course
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 w-full justify-end">
          <Button 
            size="sm"
            variant="outline"
            asChild
          >
            <Link to={`/courses/${course.id}`}>
              View Course
            </Link>
          </Button>
          <Button 
            size="sm" 
            asChild
          >
            <Link to={`/messages?tutorId=${course.tutor_id}`}>
              Message Tutor
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const BookingsList = ({ bookings, filter, isStudent, onStatusChange }: { 
  bookings: Booking[];
  filter: string;
  isStudent: boolean;
  onStatusChange: () => void;
}) => {
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  if (filteredBookings.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredBookings.map(booking => (
        <BookingCard 
          key={booking.id} 
          booking={booking} 
          isStudent={isStudent}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

const Bookings = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [view, setView] = useState("bookings");
  
  const isStudent = profile?.role === 'student';

  const loadBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userBookings = await getUserBookings(user.id);
      setBookings(userBookings);
      
      // Load enrollments for students
      if (isStudent) {
        const studentEnrollments = await getStudentEnrollments(user.id);
        setEnrollments(studentEnrollments);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user, isStudent]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your Schedule</h1>
      
      {isStudent && (
        <Tabs defaultValue="bookings" value={view} onValueChange={setView} className="mb-6">
          <TabsList>
            <TabsTrigger value="bookings">Sessions</TabsTrigger>
            <TabsTrigger value="enrollments">Enrolled Courses</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      {view === "bookings" ? (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="requested">Requested</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div>
                            <Skeleton className="h-5 w-40 mb-1" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full flex justify-end gap-2">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <BookingsList 
                bookings={bookings} 
                filter={activeTab} 
                isStudent={isStudent}
                onStatusChange={loadBookings}
              />
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-40 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full flex justify-end gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : enrollments.length > 0 ? (
            enrollments.map(enrollment => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
              <Button asChild className="mt-4">
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookings;

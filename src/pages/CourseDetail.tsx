
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { getCourse, enrollInCourse, getCourseEnrollments, getStudentEnrollments, getSubject } from "@/lib/api";
import { Course, CourseEnrollment, Subject } from "@/types/database.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner, ErrorDisplay } from "@/components/ui/loading-states";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, Calendar, BookOpen, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const getLevelBadgeColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800';
    case 'advanced':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!courseId || !user) return;

      try {
        setLoading(true);
        setError(null);

        const courseData = await getCourse(courseId);
        
        if (!courseData) {
          setError("Course not found");
          return;
        }
        
        setCourse(courseData);

        // Load subject data if needed
        if (courseData.subject_id) {
          const subjectData = await getSubject(courseData.subject_id);
          setSubject(subjectData);
        }

        // Load enrollments if the user is the course tutor
        if (profile?.role === 'tutor' && courseData.tutor_id === user.id) {
          const courseEnrollments = await getCourseEnrollments(courseId);
          setEnrollments(courseEnrollments);
        }

        // Check if the student is already enrolled
        if (profile?.role === 'student') {
          const studentEnrollments = await getStudentEnrollments(user.id);
          setUserEnrollments(studentEnrollments);
        }
      } catch (error) {
        console.error('Error loading course details:', error);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, user, profile]);

  const handleEnroll = async () => {
    if (!user || !courseId) return;
    
    try {
      setEnrolling(true);
      const enrollment = await enrollInCourse(courseId, user.id);
      
      if (enrollment) {
        toast.success("Successfully enrolled in the course!");
        // Refresh the page to show updated enrollment status
        window.location.reload();
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error("Failed to enroll in the course. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingSpinner className="py-12" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto py-8">
        <ErrorDisplay 
          message={error || "Course not found"} 
          retry={() => navigate("/courses")} 
        />
      </div>
    );
  }

  const isStudent = profile?.role === 'student';
  const isTutor = profile?.role === 'tutor' && course.tutor_id === user?.id;
  const isEnrolled = userEnrollments?.some(e => e.course_id === courseId && e.status === 'active');
  const isFull = (course.current_students || 0) >= course.max_students;

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center" 
        onClick={() => navigate("/courses")}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Courses
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge className={getLevelBadgeColor(course.level)}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </Badge>
                <div className="text-2xl font-bold">${course.price}</div>
              </div>
              <CardTitle className="text-3xl mt-4">{course.title}</CardTitle>
              <CardDescription className="text-lg">
                A {course.duration_weeks}-week course to master {course.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <Clock className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-sm font-medium">{course.duration_weeks} Weeks</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-sm font-medium">{course.current_students || 0} / {course.max_students} Students</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                  <BookOpen className="h-6 w-6 mb-2 text-primary" />
                  <span className="text-sm font-medium">{subject?.name || "General"}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Course Description</h3>
                <p className="whitespace-pre-line">{course.description}</p>
              </div>
            </CardContent>
            
            {isStudent && !isEnrolled && (
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleEnroll} 
                  disabled={enrolling || isFull}
                >
                  {enrolling ? "Enrolling..." : isFull ? "Course is Full" : "Enroll Now"}
                </Button>
              </CardFooter>
            )}
            
            {isStudent && isEnrolled && (
              <CardFooter>
                <Button className="w-full" variant="outline" disabled>
                  Already Enrolled
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Course Tutor</CardTitle>
            </CardHeader>
            <CardContent>
              {course.profiles ? (
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.profiles.avatar_url || ""} alt={course.profiles.name} />
                    <AvatarFallback>
                      {course.profiles.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{course.profiles.name}</h3>
                    {course.profiles.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.profiles.bio}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Tutor information not available</p>
              )}
            </CardContent>
          </Card>
          
          {isTutor && (
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>
                  {enrollments.length} / {course.max_students} students enrolled
                </CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.map(enrollment => (
                      <div key={enrollment.id} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={enrollment.profiles?.avatar_url || ""} 
                            alt={enrollment.profiles?.name || "Student"} 
                          />
                          <AvatarFallback>
                            {enrollment.profiles?.name?.charAt(0).toUpperCase() || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{enrollment.profiles?.name || "Student"}</p>
                          <p className="text-xs text-muted-foreground">
                            Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No students enrolled yet
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;


import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { getAllCourses, enrollInCourse, getStudentEnrollments, getTutorCourses } from "@/lib/api";
import { Course, CourseEnrollment } from "@/types/database.types";
import { LoadingSpinner, ErrorDisplay } from "@/components/ui/loading-states";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { toast } from "sonner";

const MyCourses = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user || !profile) return;

      try {
        setLoading(true);
        setError(null);
        
        if (profile.role === 'tutor') {
          const tutorCourses = await getTutorCourses(user.id);
          setCourses(tutorCourses);
        } else if (profile.role === 'student') {
          const [studentEnrollments, allCourses] = await Promise.all([
            getStudentEnrollments(user.id),
            getAllCourses()
          ]);
          
          setEnrollments(studentEnrollments);
          
          // Get all courses
          setCourses(allCourses);
        }
      } catch (error) {
        console.error('Error loading courses data:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      loadData();
    }
  }, [user, profile]);

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    
    const enrollment = await enrollInCourse(courseId, user.id);
    if (enrollment) {
      // Reload the enrollments to reflect the changes
      const updatedEnrollments = await getStudentEnrollments(user.id);
      setEnrollments(updatedEnrollments);
    }
  };

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

  const isStudent = profile?.role === 'student';
  const isTutor = profile?.role === 'tutor';
  
  // Get enrolled course IDs for the student
  const enrolledCourseIds = enrollments.map(enrollment => enrollment.course_id);
  
  // Filter available courses (those the student is not enrolled in yet)
  const availableCourses = isStudent 
    ? courses.filter(course => !enrolledCourseIds.includes(course.id))
    : courses;

  // Get enrolled courses details
  const enrolledCourses = isStudent
    ? courses.filter(course => enrolledCourseIds.includes(course.id))
    : [];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          {isTutor ? "My Courses" : "Available Courses"}
        </h1>
        {isTutor && (
          <Button asChild>
            <Link to="/create-course">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
        )}
      </div>

      {isTutor && (
        <>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't created any courses yet.</p>
              <Button asChild>
                <Link to="/create-course">Create Your First Course</Link>
              </Button>
            </div>
          )}
        </>
      )}

      {isStudent && (
        <>
          {enrolledCourses.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-8 mb-4">My Enrolled Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {enrolledCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          )}

          <h2 className="text-xl font-semibold mt-8 mb-4">Available Courses</h2>
          {availableCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map(course => (
                <div key={course.id} className="relative">
                  <CourseCard course={course} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity">
                    <Button onClick={() => handleEnroll(course.id)}>
                      Enroll Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No available courses at the moment.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyCourses;

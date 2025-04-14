
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/use-profile";
import { getAllCourses, enrollInCourse, getStudentEnrollments, getTutorCourses } from "@/lib/api";
import { Course, CourseEnrollment } from "@/types/database.types";
import { LoadingSpinner, ErrorDisplay } from "@/components/ui/loading-states";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, Filter } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { getSubjects } from "@/lib/api";
import { Subject } from "@/types/database.types";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MyCourses = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  useEffect(() => {
    const loadData = async () => {
      if (!user || !profile) return;

      try {
        setLoading(true);
        setError(null);
        
        // Load subjects for filter
        const allSubjects = await getSubjects();
        setSubjects(allSubjects);
        
        if (profile.role === 'tutor') {
          const tutorCourses = await getTutorCourses(user.id);
          setCourses(tutorCourses);
          setFilteredCourses(tutorCourses);
        } else if (profile.role === 'student') {
          const [studentEnrollments, allCourses] = await Promise.all([
            getStudentEnrollments(user.id),
            getAllCourses()
          ]);
          
          setEnrollments(studentEnrollments);
          setCourses(allCourses);
          setFilteredCourses(allCourses);
          
          // Find max price for slider
          const highestPrice = Math.max(...allCourses.map(course => course.price || 0));
          setMaxPrice(highestPrice > 0 ? highestPrice : 1000);
          setPriceRange([0, highestPrice > 0 ? highestPrice : 1000]);
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
  
  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (courses.length === 0) return;
    
    let filtered = [...courses];
    
    // Apply subject filter
    if (selectedSubject) {
      filtered = filtered.filter(course => course.subject_id === selectedSubject);
    }
    
    // Apply level filter
    if (selectedLevel) {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }
    
    // Apply mode filter - assuming there might be a mode property in the future
    // This is a placeholder for when course mode is implemented
    if (selectedMode && courses[0]?.hasOwnProperty('mode')) {
      filtered = filtered.filter((course: any) => course.mode === selectedMode);
    }
    
    // Apply price filter
    filtered = filtered.filter(
      course => (course.price || 0) >= priceRange[0] && (course.price || 0) <= priceRange[1]
    );
    
    setFilteredCourses(filtered);
  }, [courses, selectedSubject, selectedLevel, selectedMode, priceRange]);

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    
    try {
      const enrollment = await enrollInCourse(courseId, user.id);
      if (enrollment) {
        // Reload the enrollments to reflect the changes
        const updatedEnrollments = await getStudentEnrollments(user.id);
        setEnrollments(updatedEnrollments);
        
        // Show success notification
        toast.success("Successfully enrolled in the course and scheduled your first session!");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in the course. Please try again.");
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
    ? filteredCourses.filter(course => !enrolledCourseIds.includes(course.id))
    : filteredCourses;

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
        {isStudent && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Mode</label>
                  <Select value={selectedMode} onValueChange={setSelectedMode}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Modes</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium">Price Range</label>
                    <span className="text-sm text-muted-foreground">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  <Slider 
                    value={priceRange} 
                    min={0} 
                    max={maxPrice} 
                    step={10}
                    onValueChange={setPriceRange} 
                    className="py-4"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    setSelectedSubject('');
                    setSelectedLevel('');
                    setSelectedMode('');
                    setPriceRange([0, maxPrice]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
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
              <p className="text-muted-foreground">No available courses matching your filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyCourses;

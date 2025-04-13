import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Calendar, RefreshCw, AlertTriangle, Users, BookOpen } from "lucide-react";
import { getSubjects, searchTutors, getTutorReviews, getAllCourses } from "@/lib/api";
import type { Subject, Profile, Review, Course } from "@/types/database.types";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { TutorCardSkeleton, NoResultsMessage, ErrorDisplay, LoadingSpinner } from "@/components/ui/loading-states";

const TutorCard = ({ tutor }: { tutor: Profile }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const tutorReviews = await getTutorReviews(tutor.id);
        setReviews(tutorReviews);
      } catch (error) {
        console.error("Error loading reviews:", error);
        setError("Could not load reviews");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [tutor.id]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <ErrorBoundary
      fallback={
        <Card className="overflow-hidden border-red-200 bg-red-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600">Error loading tutor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">This tutor card could not be displayed properly.</p>
          </CardContent>
        </Card>
      }
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={tutor.avatar_url || ""} alt={tutor.name} />
              <AvatarFallback>{getInitials(tutor.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{tutor.name}</CardTitle>
              {tutor.location && (
                <CardDescription className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {tutor.location}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {loading ? (
                <Skeleton className="h-4 w-24" />
              ) : error ? (
                <span className="text-sm text-red-500 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Error loading reviews
                </span>
              ) : (
                <>
                  <div className="flex mr-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {reviews.length > 0
                      ? `${averageRating.toFixed(1)} (${reviews.length})`
                      : "No reviews yet"}
                  </span>
                </>
              )}
            </div>
            <div className="text-lg font-bold text-primary">
              ${tutor.hourly_rate}/hr
            </div>
          </div>
          <p className="text-sm line-clamp-2">{tutor.bio || "No bio available"}</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate(`/tutor/${tutor.id}`)} 
            variant="default" 
            className="w-full"
          >
            View Profile
          </Button>
        </CardFooter>
      </Card>
    </ErrorBoundary>
  );
};

const CourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <ErrorBoundary
      fallback={
        <Card className="overflow-hidden border-red-200 bg-red-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600">Error loading course</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">This course card could not be displayed properly.</p>
          </CardContent>
        </Card>
      }
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <Badge className={getLevelColor(course.level)}>
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {course.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
              <Clock className="h-4 w-4 mb-1 text-primary" />
              <span className="text-xs font-medium">{course.duration_weeks} Weeks</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
              <Users className="h-4 w-4 mb-1 text-primary" />
              <span className="text-xs font-medium">{course.current_students || 0} / {course.max_students}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
              <div className="text-lg font-bold text-primary">
                ${course.price}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={course.profiles?.avatar_url || ""} alt={course.profiles?.name} />
              <AvatarFallback>
                {course.profiles?.name?.charAt(0).toUpperCase() || "T"}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              {course.profiles?.name || "Tutor"}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate(`/courses/${course.id}`)} 
            variant="default" 
            className="w-full"
          >
            View Course
          </Button>
        </CardFooter>
      </Card>
    </ErrorBoundary>
  );
};

const Search = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [tutors, setTutors] = useState<Profile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tutors' | 'courses'>('tutors');

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setSubjectsLoading(true);
        setSubjectsError(null);
        const allSubjects = await getSubjects();
        setSubjects(allSubjects);
      } catch (error) {
        console.error("Error loading subjects:", error);
        setSubjectsError("Failed to load subjects");
        toast.error("Could not load subjects. Please try again later.");
      } finally {
        setSubjectsLoading(false);
      }
    };

    loadSubjects();
  }, []);

  useEffect(() => {
    const searchForResults = async () => {
      if (!selectedSubject && !location && !selectedLevel) return;
      
      setLoading(true);
      setSearchError(null);
      try {
        const subjectId = selectedSubject === "all-subjects" ? undefined : selectedSubject;
        
        const tutorResults = await searchTutors(subjectId, location || undefined);
        setTutors(tutorResults);
        
        // Get all courses and filter them client-side
        const allCourses = await getAllCourses();
        let filteredCourses = [...allCourses];
        
        // Apply subject filter
        if (subjectId) {
          filteredCourses = filteredCourses.filter(course => course.subject_id === subjectId);
        }
        
        // Apply level filter
        if (selectedLevel) {
          filteredCourses = filteredCourses.filter(course => course.level === selectedLevel);
        }
        
        // Apply location filter
        if (location) {
          filteredCourses = filteredCourses.filter(course => 
            course.profiles?.location?.toLowerCase().includes(location.toLowerCase())
          );
        }
        
        setCourses(filteredCourses);
      } catch (error) {
        console.error("Error searching for results:", error);
        setSearchError("Failed to search for tutors and courses");
        toast.error("Error searching. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchForResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedSubject, selectedLevel, location]);

  const handleRetrySubjects = async () => {
    try {
      setSubjectsLoading(true);
      setSubjectsError(null);
      const allSubjects = await getSubjects();
      setSubjects(allSubjects);
      toast.success("Subjects loaded successfully");
    } catch (error) {
      console.error("Error retrying subjects:", error);
      setSubjectsError("Failed to load subjects");
      toast.error("Could not load subjects. Please try again later.");
    } finally {
      setSubjectsLoading(false);
    }
  };

  const handleRetrySearch = () => {
    setSearchError(null);
    setSelectedSubject("");
    setSelectedLevel("");
    setLocation("");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Find Tutors & Courses</h1>
      
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <ErrorBoundary>
            <Card>
              <CardHeader>
                <CardTitle>Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  {subjectsLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : subjectsError ? (
                    <div className="space-y-2">
                      <div className="text-sm text-red-500">{subjectsError}</div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center gap-2"
                        onClick={handleRetrySubjects}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Retry Loading Subjects
                      </Button>
                    </div>
                  ) : (
                    <Select
                      value={selectedSubject}
                      onValueChange={setSelectedSubject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-subjects">All Subjects</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Level</label>
                  <Select
                    value={selectedLevel}
                    onValueChange={setSelectedLevel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="Enter city or country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedSubject("");
                    setSelectedLevel("");
                    setLocation("");
                  }}
                  disabled={!selectedSubject && !selectedLevel && !location}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={activeTab === 'tutors' ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setActiveTab('tutors')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Tutors
                  </Button>
                  <Button 
                    variant={activeTab === 'courses' ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setActiveTab('courses')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Courses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ErrorBoundary>
        </div>
        
        <ErrorBoundary>
          <div className="space-y-6">
            {activeTab === 'tutors' ? (
              <>
                <h2 className="text-xl font-bold">Available Tutors</h2>
                {loading ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <TutorCardSkeleton key={i} />
                    ))}
                  </div>
                ) : searchError ? (
                  <ErrorDisplay 
                    message="There was an error searching for tutors. Please try again." 
                    retry={handleRetrySearch}
                  />
                ) : (
                  <>
                    {tutors.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tutors.map((tutor) => (
                          <TutorCard key={tutor.id} tutor={tutor} />
                        ))}
                      </div>
                    ) : (
                      <NoResultsMessage message="No tutors found. Try changing your search criteria" />
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">Available Courses</h2>
                {loading ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <TutorCardSkeleton key={i} />
                    ))}
                  </div>
                ) : searchError ? (
                  <ErrorDisplay 
                    message="There was an error searching for courses. Please try again." 
                    retry={handleRetrySearch}
                  />
                ) : (
                  <>
                    {courses.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                          <CourseCard key={course.id} course={course} />
                        ))}
                      </div>
                    ) : (
                      <NoResultsMessage message="No courses found. Try changing your search criteria" />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Search;

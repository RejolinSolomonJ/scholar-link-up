
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Calendar, RefreshCw, AlertTriangle } from "lucide-react";
import { getSubjects, searchTutors, getTutorReviews } from "@/lib/api";
import type { Subject, Profile, Review } from "@/types/database.types";
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

const Search = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [tutors, setTutors] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Load subjects only once
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

  // Search for tutors when filters change
  useEffect(() => {
    const searchForTutors = async () => {
      if (!selectedSubject && !location) return;
      
      setLoading(true);
      setSearchError(null);
      try {
        const subjectId = selectedSubject === "all-subjects" ? undefined : selectedSubject;
        const results = await searchTutors(subjectId, location || undefined);
        setTutors(results);
      } catch (error) {
        console.error("Error searching for tutors:", error);
        setSearchError("Failed to search for tutors");
        toast.error("Error searching for tutors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to avoid too many API calls
    const timeoutId = setTimeout(() => {
      searchForTutors();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedSubject, location]);

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
    // This will trigger the useEffect for searching
    const newSubject = selectedSubject === "" ? "all-subjects" : selectedSubject;
    setSelectedSubject(newSubject);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Find a Tutor</h1>
      
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <ErrorBoundary>
            <Card>
              <CardHeader>
                <CardTitle>Filter Tutors</CardTitle>
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
                    setLocation("");
                  }}
                  disabled={!selectedSubject && !location}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </ErrorBoundary>
        </div>
        
        <ErrorBoundary>
          <div className="space-y-6">
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
                  <NoResultsMessage message="Try changing your search criteria" />
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

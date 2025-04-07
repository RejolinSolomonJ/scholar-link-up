
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Calendar } from "lucide-react";
import { getSubjects, searchTutors, getTutorReviews } from "@/lib/api";
import type { Subject, Profile, Review } from "@/types/database.types";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const TutorCard = ({ tutor }: { tutor: Profile }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const tutorReviews = await getTutorReviews(tutor.id);
        setReviews(tutorReviews);
      } catch (error) {
        console.error("Error loading reviews:", error);
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
    <Card className="overflow-hidden">
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
  );
};

const Search = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [tutors, setTutors] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const allSubjects = await getSubjects();
        setSubjects(allSubjects);
      } catch (error) {
        console.error("Error loading subjects:", error);
      } finally {
        setSubjectsLoading(false);
      }
    };

    loadSubjects();
  }, []);

  useEffect(() => {
    const searchForTutors = async () => {
      if (!selectedSubject && !location) return;
      
      setLoading(true);
      try {
        const results = await searchTutors(
          selectedSubject || undefined,
          location || undefined
        );
        setTutors(results);
      } catch (error) {
        console.error("Error searching for tutors:", error);
      } finally {
        setLoading(false);
      }
    };

    searchForTutors();
  }, [selectedSubject, location]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Find a Tutor</h1>
      
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filter Tutors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                {subjectsLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subjects</SelectItem>
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
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {tutors.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {tutors.map((tutor) => (
                    <TutorCard key={tutor.id} tutor={tutor} />
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="py-8 text-center">
                    <p className="text-lg mb-2">No tutors found</p>
                    <p className="text-muted-foreground">
                      Try changing your search criteria
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;

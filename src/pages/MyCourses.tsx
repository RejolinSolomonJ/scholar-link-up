
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTutorCourses, type Course } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Pencil, Users, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const MyCourses = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: courses = [], isLoading, isError } = useQuery({
    queryKey: ['courses', user?.id],
    queryFn: () => user ? getTutorCourses(user.id) : Promise.resolve([]),
    enabled: !!user,
  });
  
  // Map course level to a badge color
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
  
  // Render loading skeletons
  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Skeleton className="h-10 w-64 mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (isError) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-lg text-muted-foreground mb-4">
              There was an error loading your courses.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Handle empty state
  if (courses.length === 0) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No courses yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first course to start teaching students.
            </p>
            <Button asChild>
              <Link to="/create-course">
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Button asChild>
          <Link to="/create-course">
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
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
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Course
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;

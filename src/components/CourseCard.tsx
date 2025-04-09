
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Course } from "@/types/database.types";

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

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden flex flex-col">
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
  );
};

export default CourseCard;

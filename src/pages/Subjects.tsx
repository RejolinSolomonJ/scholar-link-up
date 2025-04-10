
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSubjects } from "@/lib/api";
import { Subject } from "@/types/database.types";
import { Book, Clock, GraduationCap, Search } from "lucide-react";
import { LoadingSpinner, ErrorDisplay } from "@/components/ui/loading-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SubjectCard = ({ subject }: { subject: Subject }) => {
  const navigate = useNavigate();
  
  const getLevelColor = (level?: string) => {
    switch(level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center mb-2">
            <Book className="h-5 w-5 text-primary mr-2" />
            <CardTitle className="text-lg">{subject.name}</CardTitle>
          </div>
          {subject.level && (
            <Badge className={getLevelColor(subject.level)}>
              {subject.level.charAt(0).toUpperCase() + subject.level.slice(1)}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {subject.description || "Explore this subject with our experienced tutors."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="text-sm text-muted-foreground">
          {subject.category && (
            <div className="flex items-center mb-2">
              <GraduationCap className="h-4 w-4 mr-2" />
              <span>{subject.category}</span>
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => navigate(`/search?subject=${subject.id}`)}
        >
          Find Tutors
        </Button>
      </CardContent>
    </Card>
  );
};

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  
  // Get unique categories from subjects
  const categories = [...new Set(subjects.filter(s => s.category).map(s => s.category))];
  const levels = [...new Set(subjects.filter(s => s.level).map(s => s.level))];
  
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSubjects();
        setSubjects(data);
        setFilteredSubjects(data);
      } catch (error) {
        console.error("Error loading subjects:", error);
        setError("Failed to load subjects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadSubjects();
  }, []);
  
  useEffect(() => {
    let result = subjects;
    
    if (searchTerm) {
      result = result.filter(subject => 
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subject.description && subject.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory) {
      result = result.filter(subject => subject.category === selectedCategory);
    }
    
    if (selectedLevel) {
      result = result.filter(subject => subject.level === selectedLevel);
    }
    
    setFilteredSubjects(result);
  }, [searchTerm, selectedCategory, selectedLevel, subjects]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <LoadingSpinner className="py-16" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-12">
        <ErrorDisplay message={error} />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Subjects We Offer</h1>
      
      <div className="max-w-4xl mx-auto mb-10">
        <p className="text-center text-muted-foreground mb-8">
          Browse our comprehensive list of subjects taught by expert tutors. Filter by category or level to find exactly what you're looking for.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category || ""}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level || ""}>
                  {level?.charAt(0).toUpperCase() + level?.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No subjects found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
};

export default Subjects;

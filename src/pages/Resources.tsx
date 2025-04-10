
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Resource } from "@/types/database.types";
import { Book, Download, ExternalLink, FileText, Search, Video } from "lucide-react";
import { LoadingSpinner, ErrorDisplay } from "@/components/ui/loading-states";

// This would be fetched from the API in a real application
const mockResources: Resource[] = [
  {
    id: "1",
    title: "Effective Study Techniques for College Students",
    description: "Learn how to study more effectively and efficiently with these proven techniques.",
    type: "blog",
    url: "#",
    thumbnail_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    subject_id: "study-skills"
  },
  {
    id: "2",
    title: "Introduction to Calculus",
    description: "A comprehensive guide to understanding the fundamentals of calculus.",
    type: "document",
    url: "#",
    file_url: "#",
    thumbnail_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    subject_id: "mathematics"
  },
  {
    id: "3",
    title: "How to Write a Great Essay",
    description: "Step-by-step guide to writing compelling essays for academic purposes.",
    type: "blog",
    url: "#",
    thumbnail_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    subject_id: "english"
  },
  {
    id: "4",
    title: "Understanding Chemical Reactions",
    description: "Video tutorial explaining the basics of chemical reactions with examples.",
    type: "video",
    url: "#",
    thumbnail_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    subject_id: "chemistry"
  },
  {
    id: "5",
    title: "Physics Formula Cheat Sheet",
    description: "A downloadable PDF with all essential physics formulas for high school and early college.",
    type: "document",
    url: "#",
    file_url: "#",
    thumbnail_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    subject_id: "physics"
  },
  {
    id: "6",
    title: "History Timeline Maker",
    description: "Online tool to create beautiful history timelines for your projects.",
    type: "link",
    url: "#",
    thumbnail_url: "/placeholder.svg",
    created_at: new Date().toISOString(),
    subject_id: "history"
  },
];

// Get unique subjects from resources
const subjects = [...new Set(mockResources.map(r => r.subject_id))].map(id => ({
  id,
  name: id?.charAt(0).toUpperCase() + id?.slice(1).replace(/-/g, ' ') || ""
}));

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const getIconByType = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="h-5 w-5" />;
      case 'document':
        return <Book className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'link':
        return <ExternalLink className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const getActionByType = (type: string) => {
    switch (type) {
      case 'blog':
        return { text: "Read Article", icon: <ExternalLink className="h-4 w-4 ml-2" /> };
      case 'document':
        return { text: "Download", icon: <Download className="h-4 w-4 ml-2" /> };
      case 'video':
        return { text: "Watch Video", icon: <Video className="h-4 w-4 ml-2" /> };
      case 'link':
        return { text: "Visit Website", icon: <ExternalLink className="h-4 w-4 ml-2" /> };
      default:
        return { text: "View Resource", icon: <ExternalLink className="h-4 w-4 ml-2" /> };
    }
  };
  
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return "bg-blue-100 text-blue-800";
      case 'document':
        return "bg-amber-100 text-amber-800";
      case 'video':
        return "bg-red-100 text-red-800";
      case 'link':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const action = getActionByType(resource.type);
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between mb-2">
          <Badge className={getBadgeColor(resource.type)}>
            <span className="flex items-center">
              {getIconByType(resource.type)}
              <span className="ml-1 capitalize">{resource.type}</span>
            </span>
          </Badge>
          {resource.subject_id && (
            <Badge variant="outline">
              {resource.subject_id.charAt(0).toUpperCase() + resource.subject_id.slice(1).replace(/-/g, ' ')}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {resource.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="aspect-video relative overflow-hidden rounded-md bg-muted">
          <img 
            src={resource.thumbnail_url || "/placeholder.svg"} 
            alt={resource.title}
            className="object-cover w-full h-full"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <a href={resource.url || resource.file_url || "#"} target="_blank" rel="noopener noreferrer">
            <span className="flex items-center">
              {action.text}
              {action.icon}
            </span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  
  useEffect(() => {
    // Simulate API call
    const fetchResources = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        setTimeout(() => {
          setResources(mockResources);
          setFilteredResources(mockResources);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setError("Failed to load resources. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);
  
  useEffect(() => {
    let result = resources;
    
    if (searchTerm) {
      result = result.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedType) {
      result = result.filter(resource => resource.type === selectedType);
    }
    
    if (selectedSubject) {
      result = result.filter(resource => resource.subject_id === selectedSubject);
    }
    
    setFilteredResources(result);
  }, [searchTerm, selectedType, selectedSubject, resources]);
  
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
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Learning Resources</h1>
      
      <div className="max-w-4xl mx-auto mb-10">
        <p className="text-center text-muted-foreground mb-8">
          Explore our collection of educational resources to enhance your learning journey. Filter by type or subject to find exactly what you need.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id || ""}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No resources found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
};

export default Resources;

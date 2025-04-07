
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Video } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data - would come from API
const tutors = [
  {
    id: 1,
    name: "Dr. Maria Chen",
    subjects: ["Physics", "Math"],
    rating: 4.9,
    hourlyRate: 45,
    location: "Boston, MA",
    online: true,
    inPerson: true,
    avatar: "",
    bio: "PhD in Physics with 10+ years of teaching experience. Specialized in making complex concepts easy to understand.",
    reviews: 48
  },
  {
    id: 2,
    name: "James Wilson",
    subjects: ["English", "Literature"],
    rating: 4.7,
    hourlyRate: 35,
    location: "Chicago, IL",
    online: true,
    inPerson: false,
    avatar: "",
    bio: "English Literature professor with expertise in essay writing, critical analysis, and creative writing.",
    reviews: 32
  },
  {
    id: 3,
    name: "Sarah Johnson",
    subjects: ["Chemistry", "Biology"],
    rating: 4.8,
    hourlyRate: 40,
    location: "New York, NY",
    online: true,
    inPerson: true,
    avatar: "",
    bio: "Molecular biologist passionate about making science accessible. Experience with AP and IB curricula.",
    reviews: 56
  },
  {
    id: 4,
    name: "Robert Davis",
    subjects: ["Math", "Computer Science"],
    rating: 4.6,
    hourlyRate: 50,
    location: "San Francisco, CA",
    online: true,
    inPerson: true,
    avatar: "",
    bio: "Software engineer with teaching background. Expert in algorithms, programming, and math fundamentals.",
    reviews: 29
  }
];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [modeFilter, setModeFilter] = useState("all");

  // Filter tutors based on search and filters
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = 
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tutor.subjects.some(subject => 
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesPrice = 
      tutor.hourlyRate >= priceRange[0] && 
      tutor.hourlyRate <= priceRange[1];
    
    const matchesMode = 
      modeFilter === "all" || 
      (modeFilter === "online" && tutor.online) || 
      (modeFilter === "inPerson" && tutor.inPerson);
    
    return matchesSearch && matchesPrice && matchesMode;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Find a Tutor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">Filters</h3>
              
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="language">Languages</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Hourly Rate</Label>
                <div className="pt-2">
                  <Slider 
                    defaultValue={[0, 100]} 
                    max={100} 
                    step={5}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Mode</Label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="online" checked={modeFilter === "all" || modeFilter === "online"} onCheckedChange={() => setModeFilter(modeFilter === "online" ? "all" : "online")} />
                    <Label htmlFor="online" className="font-normal">Online</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="inperson" checked={modeFilter === "all" || modeFilter === "inPerson"} onCheckedChange={() => setModeFilter(modeFilter === "inPerson" ? "all" : "inPerson")} />
                    <Label htmlFor="inperson" className="font-normal">In-Person</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Availability</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any time</SelectItem>
                    <SelectItem value="weekday">Weekdays</SelectItem>
                    <SelectItem value="weekend">Weekends</SelectItem>
                    <SelectItem value="evening">Evenings</SelectItem>
                    <SelectItem value="morning">Mornings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="Enter a location" />
              </div>
              
              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Search results */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <Input
              placeholder="Search by subject or tutor name..."
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Tabs defaultValue="grid" className="w-auto">
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTutors.length > 0 ? (
              filteredTutors.map((tutor) => (
                <Card key={tutor.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={tutor.avatar} />
                        <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{tutor.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                            <span className="text-sm">{tutor.rating}</span>
                            <span className="text-xs text-muted-foreground ml-1">({tutor.reviews})</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tutor.subjects.map((subject, idx) => (
                            <Badge key={idx} variant="secondary">{subject}</Badge>
                          ))}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {tutor.bio}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {tutor.location}
                          </div>
                          
                          {tutor.online && (
                            <div className="flex items-center text-green-600">
                              <Video className="h-3 w-3 mr-1" />
                              Online
                            </div>
                          )}
                          
                          <div className="font-medium text-primary ml-auto">
                            ${tutor.hourlyRate}/hr
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button className="w-full">View Profile</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium">No tutors found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

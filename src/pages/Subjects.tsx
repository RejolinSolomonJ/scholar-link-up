
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, GraduationCap, Lightbulb } from "lucide-react";

const Subjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const subjectCategories = [
    {
      id: "academic",
      name: "Academic",
      icon: BookOpen,
      subjects: [
        { name: "Mathematics", level: "All Levels", description: "Algebra, Calculus, Statistics, Geometry, and more", popularity: "high" },
        { name: "Science", level: "All Levels", description: "Physics, Chemistry, Biology, Earth Science", popularity: "high" },
        { name: "English", level: "All Levels", description: "Literature, Writing, Grammar, ESL", popularity: "high" },
        { name: "History", level: "All Levels", description: "World History, US History, European History", popularity: "medium" },
        { name: "Geography", level: "All Levels", description: "Physical Geography, Human Geography, Map Skills", popularity: "medium" },
        { name: "Economics", level: "High School, College", description: "Micro/Macroeconomics, Finance, Business Economics", popularity: "medium" },
        { name: "Computer Science", level: "All Levels", description: "Programming, Algorithms, Data Structures", popularity: "high" },
        { name: "Psychology", level: "High School, College", description: "Basic and Advanced Psychology Concepts", popularity: "medium" },
      ]
    },
    {
      id: "testprep",
      name: "Test Preparation",
      icon: GraduationCap,
      subjects: [
        { name: "SAT Prep", level: "High School", description: "Comprehensive preparation for all SAT sections", popularity: "high" },
        { name: "ACT Prep", level: "High School", description: "Strategies and practice for ACT success", popularity: "high" },
        { name: "AP Exams", level: "High School", description: "Preparation for all AP subject tests", popularity: "high" },
        { name: "GRE", level: "College Graduate", description: "Verbal, Quantitative, and Analytical Writing", popularity: "medium" },
        { name: "GMAT", level: "College Graduate", description: "Business school entrance exam preparation", popularity: "medium" },
        { name: "MCAT", level: "College Graduate", description: "Medical school entrance exam preparation", popularity: "medium" },
        { name: "LSAT", level: "College Graduate", description: "Law school entrance exam preparation", popularity: "medium" },
        { name: "TOEFL/IELTS", level: "All Levels", description: "English proficiency test preparation", popularity: "high" },
      ]
    },
    {
      id: "skills",
      name: "Professional Skills",
      icon: Lightbulb,
      subjects: [
        { name: "Programming", level: "All Levels", description: "Python, Java, JavaScript, C++, and more", popularity: "high" },
        { name: "Data Science", level: "Intermediate, Advanced", description: "Data Analysis, Machine Learning, Statistics", popularity: "high" },
        { name: "Digital Marketing", level: "All Levels", description: "SEO, SEM, Social Media Marketing", popularity: "medium" },
        { name: "Graphic Design", level: "All Levels", description: "Photoshop, Illustrator, Design Principles", popularity: "medium" },
        { name: "Business Writing", level: "All Levels", description: "Proposals, Reports, Business Communication", popularity: "medium" },
        { name: "Public Speaking", level: "All Levels", description: "Presentation Skills, Speech Writing", popularity: "medium" },
        { name: "Project Management", level: "Intermediate, Advanced", description: "Agile, Scrum, Traditional Methodologies", popularity: "medium" },
        { name: "Foreign Languages", level: "All Levels", description: "Spanish, French, Mandarin, and more", popularity: "high" },
      ]
    }
  ];
  
  // Filter subjects based on search term
  const getFilteredCategories = () => {
    if (!searchTerm) return subjectCategories;
    
    return subjectCategories.map(category => ({
      ...category,
      subjects: category.subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        subject.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.subjects.length > 0);
  };
  
  const filteredCategories = getFilteredCategories();
  
  // Get badge color based on popularity
  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container py-12 px-4 mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Subjects</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover the wide range of subjects offered by our expert tutors. 
          Whether you're looking for academic help, test preparation, or professional skills development, 
          we have qualified tutors ready to assist you.
        </p>
      </div>
      
      <div className="max-w-lg mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for subjects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredCategories.length > 0 ? (
        <Tabs defaultValue="academic" className="max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            {filteredCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center">
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {filteredCategories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.subjects.map((subject, index) => (
                  <Card key={index} className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between mb-2">
                        <Badge variant="outline">{subject.level}</Badge>
                        <Badge className={getPopularityColor(subject.popularity)}>
                          {subject.popularity === "high" ? "Popular" : "Growing"}
                        </Badge>
                      </div>
                      <CardTitle>{subject.name}</CardTitle>
                      <CardDescription>
                        {subject.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="text-sm text-muted-foreground">
                        <p className="mb-1">✓ One-on-one personalized lessons</p>
                        <p className="mb-1">✓ Experienced, verified tutors</p>
                        <p>✓ Flexible scheduling options</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="default" className="w-full" asChild>
                        <a href={`/search?subject=${subject.name}`}>Find Tutors</a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No subjects found</h3>
          <p className="text-muted-foreground mb-6">Try a different search term</p>
          <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
        </div>
      )}
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          We're constantly expanding our subject offerings. Contact us to request a subject 
          or to get matched with a tutor for specialized topics.
        </p>
        <Button asChild>
          <a href="/contact">Contact Us</a>
        </Button>
      </div>
    </div>
  );
};

export default Subjects;

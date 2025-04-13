
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Video, Download } from "lucide-react";
import { Link } from "react-router-dom";

const Resources = () => {
  const resourceCategories = [
    {
      id: "students",
      name: "For Students",
      resources: [
        {
          id: 1,
          title: "Study Skills: Time Management Guide",
          type: "PDF Guide",
          description: "Learn effective techniques to manage your study time and improve productivity.",
          icon: FileText,
          link: "#",
          category: "Study Skills"
        },
        {
          id: 2,
          title: "Note-Taking Strategies for Different Subjects",
          type: "Video Tutorial",
          description: "Discover the best note-taking methods for different types of courses and learning styles.",
          icon: Video,
          link: "#",
          category: "Study Skills"
        },
        {
          id: 3,
          title: "Test Preparation Toolkit",
          type: "Workbook",
          description: "A comprehensive guide to preparing for exams with practice exercises and strategies.",
          icon: Download,
          link: "#",
          category: "Exam Prep"
        },
        {
          id: 4,
          title: "Mathematics Formula Quick Reference",
          type: "PDF Guide",
          description: "Essential formulas and concepts for algebra, calculus, geometry, and statistics.",
          icon: FileText,
          link: "#",
          category: "Mathematics"
        }
      ]
    },
    {
      id: "tutors",
      name: "For Tutors",
      resources: [
        {
          id: 5,
          title: "Effective Online Teaching Techniques",
          type: "Workshop Recording",
          description: "Learn strategies to engage students effectively in virtual learning environments.",
          icon: Video,
          link: "#",
          category: "Teaching Skills"
        },
        {
          id: 6,
          title: "Creating Engaging Lesson Plans",
          type: "Template Pack",
          description: "Downloadable templates to help structure your lessons for maximum student engagement.",
          icon: Download,
          link: "#",
          category: "Lesson Planning"
        },
        {
          id: 7,
          title: "Student Assessment Strategies",
          type: "PDF Guide",
          description: "Techniques for evaluating student progress and providing constructive feedback.",
          icon: FileText,
          link: "#",
          category: "Assessment"
        },
        {
          id: 8,
          title: "Building Your Tutoring Business",
          type: "Webinar",
          description: "Expert advice on marketing your services and growing your tutoring practice.",
          icon: Video,
          link: "#",
          category: "Business"
        }
      ]
    },
    {
      id: "subjects",
      name: "Subject Resources",
      resources: [
        {
          id: 9,
          title: "Mathematics Resource Collection",
          type: "Resource Library",
          description: "Comprehensive collection of math resources from algebra to calculus.",
          icon: BookOpen,
          link: "#",
          category: "Mathematics"
        },
        {
          id: 10,
          title: "Science Laboratory Simulation Guide",
          type: "Interactive Tool",
          description: "Virtual lab simulations for biology, chemistry, and physics experiments.",
          icon: Video,
          link: "#",
          category: "Science"
        },
        {
          id: 11,
          title: "Essay Writing and Structure Guide",
          type: "PDF Handbook",
          description: "Comprehensive guide to writing essays across different subjects and formats.",
          icon: FileText,
          link: "#",
          category: "English"
        },
        {
          id: 12,
          title: "Programming Languages Cheat Sheets",
          type: "PDF Collection",
          description: "Quick reference guides for Python, Java, JavaScript, and more.",
          icon: Download,
          link: "#",
          category: "Computer Science"
        }
      ]
    }
  ];

  return (
    <div className="container py-12 px-4 mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Learning Resources</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access our collection of carefully curated resources designed to support both students and tutors in their educational journey.
        </p>
      </div>

      <Tabs defaultValue="students" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          {resourceCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {resourceCategories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.resources.map(resource => (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-xl">{resource.title}</CardTitle>
                      <CardDescription>{resource.type}</CardDescription>
                    </div>
                    <Badge variant="outline">{resource.category}</Badge>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <resource.icon className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-muted-foreground">{resource.description}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={resource.link}>Access Resource</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="bg-secondary p-8 rounded-lg mt-16 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Need Specific Resources?</h2>
        <p className="text-muted-foreground mb-6">
          If you can't find what you're looking for, let us know. Our team is continuously adding new educational resources.
        </p>
        <Button asChild>
          <Link to="/contact">Request Resources</Link>
        </Button>
      </div>
    </div>
  );
};

export default Resources;

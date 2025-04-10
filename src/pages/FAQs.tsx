
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { FAQ } from "@/types/database.types";

// This would be fetched from the API in a real application
const mockFAQs: FAQ[] = [
  // General category
  {
    id: "1",
    question: "How does Scholar LinkUp work?",
    answer: "Scholar LinkUp connects students with qualified tutors based on subject, availability, and learning preferences. Students can search for tutors, book sessions, and learn online or in-person. Tutors create profiles, set their rates and availability, and provide personalized instruction.",
    category: "general",
    order: 1
  },
  {
    id: "2",
    question: "What subjects are offered on Scholar LinkUp?",
    answer: "We offer a wide range of subjects including mathematics, science, languages, humanities, test preparation, music, programming, and more. You can browse our full list of subjects on the Subjects page.",
    category: "general",
    order: 2
  },
  {
    id: "3",
    question: "Is Scholar LinkUp available worldwide?",
    answer: "Yes, Scholar LinkUp is available globally. For online tutoring, you can connect with tutors from anywhere in the world. For in-person tutoring, you can search for tutors in your local area.",
    category: "general",
    order: 3
  },
  
  // For Students category
  {
    id: "4",
    question: "How do I choose the right tutor?",
    answer: "When selecting a tutor, consider their expertise in your subject, teaching experience, reviews from other students, and their teaching style. You can message tutors before booking to ask questions and determine if they're a good fit for your learning needs.",
    category: "students",
    order: 1
  },
  {
    id: "5",
    question: "What happens if I need to cancel a session?",
    answer: "You can cancel or reschedule a session up to 24 hours before the scheduled time without any penalty. For cancellations made less than 24 hours in advance, the tutor's cancellation policy will apply, which you can find on their profile.",
    category: "students",
    order: 2
  },
  {
    id: "6",
    question: "How do I pay for tutoring sessions?",
    answer: "Scholar LinkUp handles all payments securely through our platform. You can pay using credit/debit cards or other supported payment methods. Payment is only released to the tutor after the session is completed, ensuring you receive the service you paid for.",
    category: "students",
    order: 3
  },
  
  // For Tutors category
  {
    id: "7",
    question: "How do I become a tutor on Scholar LinkUp?",
    answer: "To become a tutor, create an account, complete your profile with your qualifications and teaching experience, set your hourly rate and availability, and specify the subjects you can teach. Your profile will be reviewed, and once approved, you can start accepting students.",
    category: "tutors",
    order: 1
  },
  {
    id: "8",
    question: "How much can I earn as a tutor?",
    answer: "Your earnings depend on your hourly rate, which you set yourself, and the number of sessions you conduct. Experienced tutors with positive reviews typically can charge higher rates. Scholar LinkUp takes a small service fee from each session to maintain the platform.",
    category: "tutors",
    order: 2
  },
  {
    id: "9",
    question: "When and how do I get paid?",
    answer: "Payments are processed after each completed session, with funds becoming available in your account within 24 hours. You can withdraw your earnings to your bank account at any time, with standard transfer times applying based on your location and banking system.",
    category: "tutors",
    order: 3
  },
  
  // Technical Issues category
  {
    id: "10",
    question: "What do I need for online tutoring sessions?",
    answer: "For online sessions, you need a computer or tablet with a stable internet connection, a webcam, and a microphone. We recommend using a headset for better audio quality. Our video platform works on most modern browsers without requiring additional software.",
    category: "technical",
    order: 1
  },
  {
    id: "11",
    question: "What if I experience technical difficulties during a session?",
    answer: "If you encounter technical issues during a session, try refreshing your browser or reconnecting. If problems persist, both parties can agree to reschedule. Contact our support team if you need assistance troubleshooting or if you need to dispute a session due to technical problems.",
    category: "technical",
    order: 2
  },
  {
    id: "12",
    question: "Is my personal information secure on Scholar LinkUp?",
    answer: "Yes, we take data security seriously. We use encryption for all sensitive data, implement strict access controls, and never share your personal information with third parties without your consent. You can review our privacy policy for more details on how we protect your information.",
    category: "technical",
    order: 3
  }
];

const FAQs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const categories = [
    { id: "all", name: "All FAQs" },
    { id: "general", name: "General" },
    { id: "students", name: "For Students" },
    { id: "tutors", name: "For Tutors" },
    { id: "technical", name: "Technical" }
  ];
  
  const filterFAQs = () => {
    let filtered = mockFAQs;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        faq =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeTab !== "all") {
      filtered = filtered.filter(faq => faq.category === activeTab);
    }
    
    // Sort by order
    return filtered.sort((a, b) => a.order - b.order);
  };
  
  const filteredFAQs = filterFAQs();
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      
      <div className="max-w-4xl mx-auto mb-10">
        <p className="text-center text-muted-foreground mb-8">
          Find answers to common questions about using Scholar LinkUp for students and tutors.
        </p>
        
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {filteredFAQs.length > 0 ? (
            <div className="space-y-6">
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {category.id === "all" ? "All Frequently Asked Questions" : `${category.name} Questions`}
                      </CardTitle>
                      <CardDescription>
                        {category.id === "all" 
                          ? "Browse all frequently asked questions across all categories"
                          : `Questions specifically about ${category.name.toLowerCase()}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {filteredFAQs.map((faq) => (
                          <AccordionItem key={faq.id} value={faq.id}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any FAQs matching your search criteria.
                  </p>
                  <Button onClick={() => {
                    setSearchTerm("");
                    setActiveTab("all");
                  }}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </Tabs>
      </div>
      
      <div className="max-w-2xl mx-auto mt-16 bg-muted p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="text-muted-foreground mb-6">
          If you couldn't find the answer you were looking for, feel free to reach out to our support team.
        </p>
        <Button asChild>
          <a href="/contact">Contact Support</a>
        </Button>
      </div>
    </div>
  );
};

export default FAQs;

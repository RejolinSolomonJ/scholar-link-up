
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const FAQs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const faqCategories = [
    {
      id: "general",
      name: "General",
      faqs: [
        {
          question: "What is ScholarLinkUp?",
          answer: "ScholarLinkUp is an online platform that connects students with qualified tutors across various subjects. Our mission is to make quality education accessible to everyone through personalized learning experiences."
        },
        {
          question: "How do I get started?",
          answer: "Getting started is easy! Simply create an account, complete your profile, and start searching for tutors that match your learning needs. You can filter by subject, price range, availability, and more."
        },
        {
          question: "Is ScholarLinkUp available globally?",
          answer: "Yes, ScholarLinkUp is available worldwide. We have tutors and students from across the globe, making it possible to find help regardless of your location or time zone."
        }
      ]
    },
    {
      id: "students",
      name: "For Students",
      faqs: [
        {
          question: "How do I choose the right tutor?",
          answer: "You can browse tutor profiles which include their qualifications, teaching experience, reviews from other students, and their teaching style. We recommend contacting several tutors before making your decision to find the best match for your learning style."
        },
        {
          question: "What if I'm not satisfied with my tutor?",
          answer: "If you're not completely satisfied with your learning experience, you can end the session and choose a different tutor. We also encourage providing feedback to help tutors improve their services."
        },
        {
          question: "How much does tutoring cost?",
          answer: "Tutoring rates vary depending on the subject, tutor experience, and session length. Tutors set their own rates, which are clearly displayed on their profiles. You can filter tutors based on your budget."
        }
      ]
    },
    {
      id: "tutors",
      name: "For Tutors",
      faqs: [
        {
          question: "How do I become a tutor on ScholarLinkUp?",
          answer: "To become a tutor, you'll need to create an account, complete your tutor profile with your qualifications and expertise, set your availability and rates, and pass our verification process which includes a background check and credential verification."
        },
        {
          question: "How do I get paid?",
          answer: "Tutors receive payments through our secure payment system. Payments are processed after each completed session, with funds typically available within 3-5 business days depending on your payment method."
        },
        {
          question: "Can I set my own schedule and rates?",
          answer: "Absolutely! As a tutor on ScholarLinkUp, you have complete control over your availability and rates. You can update these at any time through your tutor dashboard."
        }
      ]
    },
    {
      id: "technical",
      name: "Technical",
      faqs: [
        {
          question: "What technology do I need to use ScholarLinkUp?",
          answer: "You'll need a computer or mobile device with a stable internet connection, a microphone, and preferably a webcam for video sessions. Our platform works on most modern browsers without requiring additional software installation."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we take data security very seriously. All personal information and payment details are encrypted and stored securely. We never share your information with third parties without your consent."
        },
        {
          question: "What if I experience technical issues during a session?",
          answer: "If you encounter technical difficulties, we provide real-time support through our help center. You can also reschedule sessions that were interrupted by technical problems at no additional cost."
        }
      ]
    }
  ];

  const filteredFAQs = searchTerm 
    ? faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0)
    : faqCategories;

  return (
    <div className="container py-12 px-4 mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about ScholarLinkUp. If you can't find what you're looking for, 
          feel free to contact our support team.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="general" className="max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          {faqCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {filteredFAQs.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <CardTitle>{category.name} Questions</CardTitle>
                <CardDescription>
                  Common questions about {category.name.toLowerCase()} aspects of ScholarLinkUp.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
        
        {searchTerm && filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No FAQs matching your search.</p>
            <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
          </div>
        )}
      </Tabs>
      
      <div className="mt-16 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="text-muted-foreground mb-6">
          Our support team is here to help. Contact us and we'll get back to you as soon as possible.
        </p>
        <Button asChild>
          <Link to="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
};

export default FAQs;

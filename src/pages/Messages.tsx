
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";

// Mock data - would come from API
const conversations = [
  {
    id: 1,
    user: {
      id: 101,
      name: "Alex Johnson",
      avatar: "",
      lastActive: "2 min ago",
      online: true
    },
    lastMessage: {
      text: "Hi, I'd like to schedule a session for next week",
      time: "2:45 PM",
      isRead: false,
      sentByMe: false
    }
  },
  {
    id: 2,
    user: {
      id: 102,
      name: "Sarah Brown",
      avatar: "",
      lastActive: "1 hour ago",
      online: false
    },
    lastMessage: {
      text: "Thanks for the session yesterday!",
      time: "Yesterday",
      isRead: true,
      sentByMe: false
    }
  },
  {
    id: 3,
    user: {
      id: 103,
      name: "Michael Chen",
      avatar: "",
      lastActive: "3 hours ago",
      online: false
    },
    lastMessage: {
      text: "I'll see you on Friday for our physics session.",
      time: "Yesterday",
      isRead: true,
      sentByMe: true
    }
  }
];

// Mock message history
const messageHistory = {
  1: [
    { id: 1, text: "Hi, I'm interested in physics tutoring.", sentByMe: false, time: "2:30 PM" },
    { id: 2, text: "Hi Alex! I'd be happy to help with physics. What topics are you looking to cover?", sentByMe: true, time: "2:35 PM" },
    { id: 3, text: "I'm struggling with quantum mechanics concepts for my upcoming exam.", sentByMe: false, time: "2:40 PM" },
    { id: 4, text: "I understand, quantum mechanics can be challenging. When would you like to schedule a session?", sentByMe: true, time: "2:42 PM" },
    { id: 5, text: "Hi, I'd like to schedule a session for next week", sentByMe: false, time: "2:45 PM" }
  ],
  2: [
    { id: 1, text: "Hello! Are you available for a math tutoring session this week?", sentByMe: false, time: "Monday 10:15 AM" },
    { id: 2, text: "Hi Sarah! Yes, I have availability on Wednesday afternoon or Thursday morning.", sentByMe: true, time: "Monday 10:30 AM" },
    { id: 3, text: "Wednesday at 4pm works for me!", sentByMe: false, time: "Monday 11:45 AM" },
    { id: 4, text: "Great! I'll send you a calendar invite for Wednesday at 4pm.", sentByMe: true, time: "Monday 12:00 PM" },
    { id: 5, text: "Thanks for the session yesterday!", sentByMe: false, time: "Yesterday 9:30 AM" }
  ],
  3: [
    { id: 1, text: "Do you have any availability next Friday for a physics session?", sentByMe: false, time: "Monday 3:15 PM" },
    { id: 2, text: "Yes, I'm free between 2pm and 6pm next Friday.", sentByMe: true, time: "Monday 3:45 PM" },
    { id: 3, text: "Let's do 3pm then, if that works for you.", sentByMe: false, time: "Monday 4:00 PM" },
    { id: 4, text: "3pm on Friday works perfectly! I've made a note of it.", sentByMe: true, time: "Monday 4:15 PM" },
    { id: 5, text: "I'll see you on Friday for our physics session.", sentByMe: true, time: "Yesterday 2:00 PM" }
  ]
};

const Messages = () => {
  const [searchParams] = useSearchParams();
  const initialUser = searchParams.get("user");
  const [selectedConversation, setSelectedConversation] = useState<number | null>(
    initialUser ? 
      conversations.find(c => c.user.name.toLowerCase().includes(initialUser))?.id ?? 1 : 
      1
  );
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    
    // In a real app, this would send the message to the API
    setNewMessage("");
  };

  const currentMessages = selectedConversation ? messageHistory[selectedConversation as keyof typeof messageHistory] : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>
      
      <Card className="shadow-sm">
        <CardContent className="p-0 overflow-hidden flex">
          <div className="w-full md:w-1/3 border-r">
            <Tabs defaultValue="all" className="w-full">
              <div className="pt-2 px-2 border-b">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="border-b p-2">
                <Input placeholder="Search messages..." className="w-full" />
              </div>
              
              <ScrollArea className="h-[500px]">
                <TabsContent value="all" className="m-0">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-3 flex items-start space-x-3 cursor-pointer hover:bg-muted/50 ${selectedConversation === conversation.id ? 'bg-muted' : ''}`}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.user.avatar} />
                          <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conversation.user.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium truncate">{conversation.user.name}</h3>
                          <span className="text-xs text-muted-foreground">{conversation.lastMessage.time}</span>
                        </div>
                        <p className={`text-sm truncate ${!conversation.lastMessage.isRead && !conversation.lastMessage.sentByMe ? 'font-medium' : 'text-muted-foreground'}`}>
                          {conversation.lastMessage.sentByMe && "You: "}
                          {conversation.lastMessage.text}
                        </p>
                      </div>
                      {!conversation.lastMessage.isRead && !conversation.lastMessage.sentByMe && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="unread" className="m-0">
                  {conversations.filter(c => !c.lastMessage.isRead && !c.lastMessage.sentByMe).map((conversation) => (
                    <div 
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-3 flex items-start space-x-3 cursor-pointer hover:bg-muted/50 ${selectedConversation === conversation.id ? 'bg-muted' : ''}`}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.user.avatar} />
                          <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conversation.user.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium truncate">{conversation.user.name}</h3>
                          <span className="text-xs text-muted-foreground">{conversation.lastMessage.time}</span>
                        </div>
                        <p className="text-sm truncate font-medium">
                          {conversation.lastMessage.text}
                        </p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                    </div>
                  ))}
                  
                  {conversations.filter(c => !c.lastMessage.isRead && !c.lastMessage.sentByMe).length === 0 && (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">No unread messages</p>
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
          
          <div className="hidden md:flex flex-col flex-1">
            {selectedConversation ? (
              <>
                <div className="p-3 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.user.avatar} />
                      <AvatarFallback>
                        {conversations.find(c => c.id === selectedConversation)?.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {conversations.find(c => c.id === selectedConversation)?.user.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {conversations.find(c => c.id === selectedConversation)?.user.online ? 
                          "Online" : 
                          `Last active ${conversations.find(c => c.id === selectedConversation)?.user.lastActive}`
                        }
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button size="sm" variant="outline">View Profile</Button>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-4 h-[400px]">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sentByMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sentByMe ? 
                              'bg-primary text-primary-foreground' : 
                              'bg-muted text-foreground'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sentByMe ? 
                              'text-primary-foreground/70' : 
                              'text-muted-foreground'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="p-3 border-t">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit">Send</Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="font-medium text-lg">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation from the sidebar</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;


import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { format, isToday, isYesterday } from "date-fns";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Conversation, Message } from "@/types/database.types";

// Define extended types to match what comes from the API
type ConversationWithProfiles = Conversation & {
  profiles?: {
    name?: string;
    avatar_url?: string;
    role?: string;
  };
};

const Messages = () => {
  const [searchParams] = useSearchParams();
  const initialUser = searchParams.get("user");
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const {
    conversations,
    selectedConversationId,
    messages,
    loading,
    newMessage,
    setNewMessage,
    handleSendMessage,
    selectConversation,
  } = useConversations();

  // Find the initially selected conversation by name if provided in URL
  useEffect(() => {
    if (initialUser && conversations.length > 0) {
      const convo = conversations.find(c => {
        const otherUserName = user?.id === c.student_id 
          ? (c as ConversationWithProfiles)?.profiles?.name?.toLowerCase() 
          : (c as ConversationWithProfiles)?.profiles?.name?.toLowerCase();
        
        return otherUserName?.includes(initialUser.toLowerCase());
      });
      
      if (convo) {
        selectConversation(convo.id);
      }
    }
  }, [initialUser, conversations, user?.id]);

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    const otherUser = user?.id === conversation.student_id 
      ? (conversation as ConversationWithProfiles).profiles 
      : (conversation as ConversationWithProfiles).profiles;
    
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get the other user in the selected conversation
  const getOtherUser = (conversation: any) => {
    if (!user || !conversation) return null;
    return user.id === conversation.student_id 
      ? conversation.profiles 
      : conversation.profiles;
  };

  // Get the selected conversation
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const otherUser = selectedConversation ? getOtherUser(selectedConversation) : null;

  // Format timestamp for messages
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Count unread messages
  const hasUnreadMessages = (conversation: any) => {
    if (!user) return false;
    return messages.some(m => 
      m.conversation_id === conversation.id && 
      m.recipient_id === user.id && 
      !m.is_read
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>
      
      <Card className="shadow-sm">
        <CardContent className="p-0 overflow-hidden flex h-[600px]">
          <div className="w-full md:w-1/3 border-r flex flex-col">
            <Tabs defaultValue="all" className="w-full flex flex-col h-full">
              <div className="pt-2 px-2 border-b">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="border-b p-2">
                <Input 
                  placeholder="Search messages..." 
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <ScrollArea className="flex-1">
                <TabsContent value="all" className="m-0 h-full">
                  {loading ? (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">Loading conversations...</p>
                    </div>
                  ) : filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => {
                      const otherPerson = getOtherUser(conversation);
                      const lastMessage = messages.filter(m => m.conversation_id === conversation.id)
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                        
                      return (
                        <div 
                          key={conversation.id}
                          onClick={() => selectConversation(conversation.id)}
                          className={`p-3 flex items-start space-x-3 cursor-pointer hover:bg-muted/50 ${selectedConversationId === conversation.id ? 'bg-muted' : ''}`}
                        >
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={otherPerson?.avatar_url || ""} />
                              <AvatarFallback>{otherPerson?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-medium truncate">{otherPerson?.name}</h3>
                              {lastMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {formatMessageTime(lastMessage.created_at)}
                                </span>
                              )}
                            </div>
                            {lastMessage && (
                              <p className={`text-sm truncate ${
                                !lastMessage.is_read && lastMessage.recipient_id === user?.id 
                                  ? 'font-medium' 
                                  : 'text-muted-foreground'
                              }`}>
                                {lastMessage.sender_id === user?.id && "You: "}
                                {lastMessage.content}
                              </p>
                            )}
                          </div>
                          {hasUnreadMessages(conversation) && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">No conversations found</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="unread" className="m-0">
                  {loading ? (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">Loading conversations...</p>
                    </div>
                  ) : (
                    filteredConversations.filter(c => hasUnreadMessages(c)).map((conversation) => {
                      const otherPerson = getOtherUser(conversation);
                      const lastMessage = messages.filter(m => m.conversation_id === conversation.id)
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                        
                      return (
                        <div 
                          key={conversation.id}
                          onClick={() => selectConversation(conversation.id)}
                          className={`p-3 flex items-start space-x-3 cursor-pointer hover:bg-muted/50 ${selectedConversationId === conversation.id ? 'bg-muted' : ''}`}
                        >
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={otherPerson?.avatar_url || ""} />
                              <AvatarFallback>{otherPerson?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-medium truncate">{otherPerson?.name}</h3>
                              {lastMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {formatMessageTime(lastMessage.created_at)}
                                </span>
                              )}
                            </div>
                            {lastMessage && (
                              <p className="text-sm truncate font-medium">
                                {lastMessage.sender_id === user?.id && "You: "}
                                {lastMessage.content}
                              </p>
                            )}
                          </div>
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                        </div>
                      );
                    })
                  )}
                  
                  {!loading && filteredConversations.filter(c => hasUnreadMessages(c)).length === 0 && (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">No unread messages</p>
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
          
          <div className="hidden md:flex md:flex-col flex-1">
            {selectedConversationId && otherUser ? (
              <>
                <div className="p-3 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={otherUser?.avatar_url || ""} />
                      <AvatarFallback>{otherUser?.name?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{otherUser?.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {otherUser?.role === 'tutor' ? 'Tutor' : 'Student'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button size="sm" variant="outline">View Profile</Button>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.filter(m => m.conversation_id === selectedConversationId).map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sender_id === user?.id ? 
                              'bg-primary text-primary-foreground' : 
                              'bg-muted text-foreground'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_id === user?.id ? 
                              'text-primary-foreground/70' : 
                              'text-muted-foreground'
                          }`}>
                            {formatMessageTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="p-3 border-t">
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Textarea 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 min-h-[80px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button type="submit">Send</Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full flex-col gap-4 p-6 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                <div>
                  <h3 className="font-medium text-lg">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation from the sidebar or start a new one</p>
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

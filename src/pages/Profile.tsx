
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Star, MapPin, Clock, Pencil } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  // Mock data - would come from API in a real app
  const [user, setUser] = useState({
    name: "Maria Chen",
    email: "maria.chen@example.com",
    role: "teacher",
    avatar: "",
    bio: "PhD in Physics with 10+ years of teaching experience. I specialize in making complex concepts easy to understand for students of all levels.",
    subjects: ["Physics", "Mathematics", "Calculus"],
    hourlyRate: 45,
    location: "Boston, MA",
    availability: {
      weekdays: true,
      weekends: true,
      mornings: true,
      afternoons: true,
      evenings: false
    },
    teachingModes: {
      online: true,
      inPerson: true
    },
    education: [
      { degree: "PhD in Physics", institution: "MIT", year: "2012" },
      { degree: "MS in Physics", institution: "Stanford University", year: "2008" },
      { degree: "BS in Physics", institution: "University of Michigan", year: "2006" }
    ],
    reviews: [
      { 
        id: 1, 
        student: "Alex Johnson", 
        rating: 5, 
        comment: "Dr. Chen is an excellent tutor! She explained quantum physics in a way I could finally understand.", 
        date: "March 15, 2023" 
      },
      { 
        id: 2, 
        student: "Sarah Brown", 
        rating: 4, 
        comment: "Very knowledgeable and patient. Helped me prepare for my AP Physics exam.", 
        date: "February 3, 2023" 
      }
    ]
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subjects">Subjects & Pricing</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-28 w-28">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm">Change Photo</Button>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={user.email} onChange={e => setUser({...user, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" value={user.location} onChange={e => setUser({...user, location: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select disabled value={user.role}>
                            <SelectTrigger id="role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="teacher">Teacher</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          rows={4} 
                          value={user.bio} 
                          onChange={e => setUser({...user, bio: e.target.value})}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {user.location}
                        </div>
                        {user.role === "teacher" && (
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                            <span>4.8</span>
                            <span className="text-xs text-muted-foreground ml-1">(48 reviews)</span>
                          </div>
                        )}
                      </div>
                      <p className="text-muted-foreground">{user.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {user.subjects.map((subject, idx) => (
                          <Badge key={idx} variant="secondary">{subject}</Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {user.role === "teacher" && (
            <Card>
              <CardHeader>
                <CardTitle>Education & Qualifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    {user.education.map((edu, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input value={edu.degree} />
                        </div>
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input value={edu.institution} />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input value={edu.year} />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm">+ Add Education</Button>
                  </>
                ) : (
                  <>
                    {user.education.map((edu, idx) => (
                      <div key={idx} className="pb-4 border-b last:border-b-0 last:pb-0">
                        <h3 className="font-medium">{edu.degree}</h3>
                        <p className="text-muted-foreground">
                          {edu.institution}, {edu.year}
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subjects & Expertise</CardTitle>
              <CardDescription>Manage the subjects you teach and your experience level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Subjects</Label>
                    <div className="flex flex-wrap gap-2">
                      {user.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="secondary" className="px-2 py-1">
                          {subject}
                          <button className="ml-1 hover:text-destructive">×</button>
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm">+ Add Subject</Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.subjects.map((subject, idx) => (
                    <Badge key={idx} variant="secondary">{subject}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set your hourly rate</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input 
                    id="hourlyRate" 
                    type="number" 
                    value={user.hourlyRate} 
                    onChange={e => setUser({...user, hourlyRate: parseInt(e.target.value)})}
                  />
                </div>
              ) : (
                <p className="text-2xl font-bold">${user.hourlyRate}/hour</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teaching Mode</CardTitle>
              <CardDescription>How you prefer to teach</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="online" 
                      checked={user.teachingModes.online}
                      onCheckedChange={(checked) => 
                        setUser({
                          ...user, 
                          teachingModes: {...user.teachingModes, online: checked}
                        })
                      }
                    />
                    <Label htmlFor="online">Online Tutoring</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="inPerson" 
                      checked={user.teachingModes.inPerson}
                      onCheckedChange={(checked) => 
                        setUser({
                          ...user, 
                          teachingModes: {...user.teachingModes, inPerson: checked}
                        })
                      }
                    />
                    <Label htmlFor="inPerson">In-Person Tutoring</Label>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {user.teachingModes.online && <Badge>Online</Badge>}
                  {user.teachingModes.inPerson && <Badge>In-Person</Badge>}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Set your general availability for sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Days</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="weekdays" 
                          checked={user.availability.weekdays}
                          onCheckedChange={(checked) => 
                            setUser({
                              ...user, 
                              availability: {...user.availability, weekdays: checked}
                            })
                          }
                        />
                        <Label htmlFor="weekdays">Weekdays</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="weekends" 
                          checked={user.availability.weekends}
                          onCheckedChange={(checked) => 
                            setUser({
                              ...user, 
                              availability: {...user.availability, weekends: checked}
                            })
                          }
                        />
                        <Label htmlFor="weekends">Weekends</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Times</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="mornings" 
                          checked={user.availability.mornings}
                          onCheckedChange={(checked) => 
                            setUser({
                              ...user, 
                              availability: {...user.availability, mornings: checked}
                            })
                          }
                        />
                        <Label htmlFor="mornings">Mornings</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="afternoons" 
                          checked={user.availability.afternoons}
                          onCheckedChange={(checked) => 
                            setUser({
                              ...user, 
                              availability: {...user.availability, afternoons: checked}
                            })
                          }
                        />
                        <Label htmlFor="afternoons">Afternoons</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="evenings" 
                          checked={user.availability.evenings}
                          onCheckedChange={(checked) => 
                            setUser({
                              ...user, 
                              availability: {...user.availability, evenings: checked}
                            })
                          }
                        />
                        <Label htmlFor="evenings">Evenings</Label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <h3 className="font-medium">Available Days:</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.availability.weekdays && <Badge variant="outline">Weekdays</Badge>}
                    {user.availability.weekends && <Badge variant="outline">Weekends</Badge>}
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <h3 className="font-medium">Available Times:</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.availability.mornings && <Badge variant="outline">Mornings</Badge>}
                    {user.availability.afternoons && <Badge variant="outline">Afternoons</Badge>}
                    {user.availability.evenings && <Badge variant="outline">Evenings</Badge>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Manage your detailed availability calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 border rounded-md">
                <p className="text-muted-foreground">Calendar functionality coming soon</p>
                <Button className="mt-4" disabled>Open Calendar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
              <CardDescription>What your students say about you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-4">
                    <Star className="h-8 w-8 text-primary fill-primary" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">4.8</h3>
                    <p className="text-muted-foreground">Based on {user.reviews.length} reviews</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {user.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{review.student}</p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="mt-2 text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;

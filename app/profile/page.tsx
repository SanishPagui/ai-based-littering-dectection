"use client"

import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useUser } from "@stackframe/stack"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Mail, Edit, UserCheck, Award, Shield, Star, Trophy, Briefcase, MapPin } from "lucide-react"
import { GlareCard } from "@/components/ui/glare-card"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export default function ProfilePage() {
  const userLoged = useUser()
  const email = userLoged?.primaryEmail
  const user = useQuery(api.users.GetUser, { email: email || "" })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const achievements = [
    {
      id: 1,
      title: "Clean Hero",
      description: "Completed 10+ cleanup events",
      icon: <Trophy size={20} />,
      color: "bg-gradient-to-br from-green-400 to-indigo-600",
    },
    { 
      id: 2, 
      title: "Eco Warrior", 
      description: "Reduced carbon footprint by 20%",
      icon: <Shield size={20} />, 
      color: "bg-gradient-to-br from-purple-400 to-pink-600" 
    },
    {
      id: 3,
      title: "Community Star",
      description: "Top contributor in local initiatives",
      icon: <Star size={20} />,
      color: "bg-gradient-to-br from-amber-400 to-orange-600",
    },
  ]

  if (email && user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="shadow-lg h-full">
                <CardHeader className="pb-2">
                  <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
                  <CardDescription><Skeleton className="h-4 w-24" /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-28 rounded-lg" />
                    ))}
                  </div>
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (email && user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">User Not Found</CardTitle>
            <CardDescription>We couldn't find your profile information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6">
            <div className="bg-red-50 p-4 rounded-full mb-4 shadow-inner">
              <User size={48} className="text-red-500" />
            </div>
            <p className="text-gray-600">The email {email} is not registered in our system.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button className="bg-green-600 hover:bg-green-700">Register Account</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-800">Profile</CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 font-medium">
                    <UserCheck size={14} className="mr-1" />
                    Active
                  </Badge>
                </div>
                <CardDescription className="text-gray-500">Personal Details</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <User size={64} className="text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-center">{user?.name}</h2>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={16} className="text-green-600" />
                    <span>New York, USA</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Briefcase size={16} className="text-green-600" />
                    <span>Environmental Specialist</span>
                  </div>
                </div>
                
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Achievements Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <div className="flex items-center mb-1">
                  <Award className="text-green-600 mr-2" size={20} />
                  <CardTitle className="text-xl font-bold text-gray-800">Achievements & Titles</CardTitle>
                </div>
                <CardDescription className="text-gray-500">Your earned recognitions and badges</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Achievements grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <GlareCard
                      key={achievement.id}
                      className={`${achievement.color} text-white rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-md
                        transition-all duration-300 hover:scale-105 hover:translate-y-1 cursor-pointer
                        ${hoveredCard !== null && hoveredCard !== achievement.id ? 'opacity-50 scale-90' : ''}`}
                      onMouseEnter={() => setHoveredCard(achievement.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="bg-white/30 p-3 rounded-full mb-3">{achievement.icon}</div>
                      <h3 className="text-lg font-bold mb-1">{achievement.title}</h3>
                      <p className="text-sm text-white/80">{achievement.description}</p>
                    </GlareCard>
                  ))}
                </div>
                
                {/* Recent activity */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Recent Activity</h3>
                  <Separator className="mb-4 bg-gray-200" />
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Trophy size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Earned "Clean Hero" badge</p>
                        <p className="text-sm text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Shield size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Completed Eco Challenge</p>
                        <p className="text-sm text-gray-500">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
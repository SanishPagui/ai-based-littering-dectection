"use client";

import { useState } from 'react';
import { Award, MapPin, Calendar, ChevronRight, User, Shield, Star, Trophy } from 'lucide-react';
import { GlareCardDemo } from '../../components/glareCard';

type Achievement = {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: string;
  color: string;
};

type Reward = {
  id: number;
  title: string;
  description: string;
  expires: string;
  claimed: boolean;
};

type UserData = {
  name: string;
  username: string;
  joinDate: string;
  level: string;
  points: number;
  heroRank: number;
  contributions: number;
  location: string;
  achievements: Achievement[];
  rewards: Reward[];
};

export default function CleanGoaHeroProfile(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'achievements' | 'rewards'>('achievements');
  
  // Mock data for the user profile
  const userData: UserData = {
    name: "Anjali Patel",
    username: "anjali_eco",
    joinDate: "February 12, 2025",
    level: "Gold Hero",
    points: 1250,
    heroRank: 23,
    contributions: 47,
    location: "Panjim, Goa",
    achievements: [
      { 
        id: 1, 
        title: "Weekly Champion", 
        description: "Top contributor for the week of March 28", 
        date: "March 28, 2025",
        icon: "trophy",
        color: "amber"
      },
      { 
        id: 2, 
        title: "Miramar Beach Guardian", 
        description: "10 proper disposals at Miramar Beach area", 
        date: "March 21, 2025",
        icon: "shield",
        color: "blue" 
      },
      { 
        id: 3, 
        title: "Cleanup Marathon", 
        description: "Participated in the Panjim cleanup drive", 
        date: "March 15, 2025",
        icon: "star",
        color: "green" 
      },
      { 
        id: 4, 
        title: "Early Adopter", 
        description: "Among the first 100 citizens to join the initiative", 
        date: "February 15, 2025",
        icon: "user",
        color: "purple" 
      }
    ],
    rewards: [
      {
        id: 1,
        title: "10% Off at Eco Café",
        description: "Discount on all beverages",
        expires: "April 30, 2025",
        claimed: false
      },
      {
        id: 2,
        title: "Free Beach Tour",
        description: "Complimentary tour of Goa's pristine beaches",
        expires: "May 15, 2025",
        claimed: false
      },
      {
        id: 3,
        title: "Eco-friendly Water Bottle",
        description: "Collect from Municipal Office",
        expires: "April 20, 2025",
        claimed: true
      }
    ]
  };

  const renderIcon = (iconName: string): JSX.Element => {
    switch(iconName) {
      case 'trophy': return <Trophy className="w-8 h-8" />;
      case 'shield': return <Shield className="w-8 h-8" />;
      case 'star': return <Star className="w-8 h-8" />;
      case 'user': return <User className="w-8 h-8" />;
      default: return <Award className="w-8 h-8" />;
    }
  };

  const getColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      'amber': 'bg-amber-100 text-amber-800 border-amber-300',
      'blue': 'bg-blue-100 text-blue-800 border-blue-300',
      'green': 'bg-green-100 text-green-800 border-green-300',
      'purple': 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Profile Header */}
      <GlareCardDemo />
      <GlareCardDemo />
      <div className="bg-green-600 px-4 pt-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-white text-3xl font-bold">Clean Goa Hero</h1>
        </div>
      </div>
      
      {/* Profile Card */}
      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="relative">
              <div className="bg-blue-600 text-white w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold">
                {userData.name.charAt(0)}
              </div>
              <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-2">
                <Award className="w-4 h-4" />
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <p className="text-gray-600">@{userData.username}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {userData.level}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{userData.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Joined {userData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">{userData.points}</p>
              <p className="text-gray-600 text-sm">Total Points</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-600">#{userData.heroRank}</p>
              <p className="text-gray-600 text-sm">Hero Rank</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-purple-600">{userData.contributions}</p>
              <p className="text-gray-600 text-sm">Contributions</p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="flex border-b">
            <button 
              className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'achievements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
            <button 
              className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'rewards' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('rewards')}
            >
              Rewards
            </button>
          </div>
          
          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {userData.achievements.map(achievement => (
                  <div key={achievement.id} className={`border rounded-lg p-4 flex ${getColorClass(achievement.color)}`}>
                    <div className="mr-4">
                      {renderIcon(achievement.icon)}
                    </div>
                    <div>
                      <h3 className="font-bold">{achievement.title}</h3>
                      <p className="text-sm">{achievement.description}</p>
                      <p className="text-xs mt-2 opacity-75">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <div className="p-6">
              <div className="space-y-4">
                {userData.rewards.map(reward => (
                  <div key={reward.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{reward.title}</h3>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                        <p className="text-xs mt-1 text-gray-500">Expires: {reward.expires}</p>
                      </div>
                      <div>
                        {reward.claimed ? (
                          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm">
                            Claimed
                          </span>
                        ) : (
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm">
                            Claim
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
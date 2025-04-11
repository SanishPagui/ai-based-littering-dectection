'use client'
import { useState, useEffect, SetStateAction } from 'react';
import Head from 'next/head';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Bell, 
  User, 
  Map, 
  BarChart2, 
  Calendar, 
  Settings, 
  LogOut, 
  Camera, 
  AlertTriangle,
  Video,
  Users,
  Filter,
  Download,
  Trash2,                                                                                                                                       
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ChevronUp
} from 'lucide-react';
import { UserButton, useUser } from '@stackframe/stack';
import Link from 'next/link';

// Mock data for the dashboard
const mockIncidents = [
  { id: 1, location: "Miramar Beach", timestamp: "2025-04-10T09:32:15", severity: "high", status: "pending", image: "/api/placeholder/100/80" },
  { id: 2, location: "Dona Paula Viewpoint", timestamp: "2025-04-10T10:15:42", severity: "medium", status: "verified", image: "/api/placeholder/100/80" },
  { id: 3, location: "Panjim Market", timestamp: "2025-04-09T16:24:33", severity: "low", status: "resolved", image: "/api/placeholder/100/80" },
  { id: 4, location: "Campal Gardens", timestamp: "2025-04-09T14:05:22", severity: "medium", status: "pending", image: "/api/placeholder/100/80" },
  { id: 5, location: "Fontainhas", timestamp: "2025-04-08T11:47:19", severity: "high", status: "verified", image: "/api/placeholder/100/80" },
  { id: 6, location: "Caranzalem Beach", timestamp: "2025-04-08T10:22:51", severity: "low", status: "resolved", image: "/api/placeholder/100/80" }
];

const mockStats = {
  totalIncidents: 458,
  pendingReview: 24,
  resolvedToday: 18,
  activeAlerts: 7,
  litterReduction: 73,
  publicAwareness: 85,
  properDisposal: 65,
  deployedDevices: 32
};

const mockLitterByLocation = [
  { location: "Miramar Beach", count: 127 },
  { location: "Panjim Market", count: 95 },
  { location: "Dona Paula", count: 82 },
  { location: "Caranzalem", count: 73 },
  { location: "Fontainhas", count: 47 },
  { location: "Campal", count: 34 }
];

const mockRecentActivities = [
  { id: 1, action: "New littering incident detected", location: "Miramar Beach", time: "10 minutes ago" },
  { id: 2, action: "Incident #245 verified", location: "Panjim Market", time: "25 minutes ago" },
  { id: 3, action: "Alert resolved", location: "Dona Paula Viewpoint", time: "42 minutes ago" },
  { id: 4, action: "New camera installed", location: "Caranzalem Beach", time: "2 hours ago" },
  { id: 5, action: "System maintenance completed", location: "All locations", time: "3 hours ago" }
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('today');
  const [notificationCount, setNotificationCount] = useState(5);
  const [litterCount, setLitterCount] = useState<number>(0);

  const user = useUser()
  
  // Functions to handle different actions
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleTabChange = (tab: SetStateAction<string>) => setActiveTab(tab);
  const handleDateRangeChange = (range: SetStateAction<string>) => setDateRange(range);
  
  // Format date for display
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true
    });
  };
  
  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'verified': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchLitterCount = async () => {
    try {
      const response = await fetch('http://192.168.203.87:5000/litter_count');
      const data = await response.json();
      setLitterCount(data.litter_count);
    } catch (error) {
      console.error('Error fetching litter count:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 lg:hidden" onClick={toggleMobileMenu}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">CIDROY</h1>
              </div>
              <button onClick={toggleMobileMenu} className="text-gray-500">
                <X size={24} />
              </button>
            </div>
            {/* Mobile Navigation Menu */}
            <nav className="mt-8">
              <div className="space-y-2">
                <button
                  onClick={() => {handleTabChange('overview'); toggleMobileMenu();}}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'overview' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <BarChart2 size={20} />
                  <span>Overview</span>
                </button>
                
                <button
                  onClick={() => {handleTabChange('incidents'); toggleMobileMenu();}}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'incidents' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <AlertTriangle size={20} />
                  <span>Incidents</span>
                </button>
                
                
                <button
                  onClick={() => {handleTabChange('map'); toggleMobileMenu();}}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'map' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Map size={20} />
                  <span>Map View</span>
                </button>
                
                <button
                  onClick={() => {handleTabChange('reports'); toggleMobileMenu();}}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'reports' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Calendar size={20} />
                  <span>Reports</span>
                </button>
                
                <button
                  onClick={() => {handleTabChange('users'); toggleMobileMenu();}}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'users' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Users size={20} />
                  <span>Users</span>
                </button>
                
                <button
                  onClick={() => {handleTabChange('settings'); toggleMobileMenu();}}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'settings' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              </div>
            </nav>
            
            {/* Mobile logout button */}
            <div className="absolute bottom-6 left-6 right-6">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200`}>
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} h-16 px-6 border-b border-gray-200`}>
            {sidebarOpen ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-800">CIDROY</h1>
                </div>
                <button onClick={toggleSidebar} className="text-gray-500">
                  <ChevronLeft size={20} />
                </button>
              </>
            ) : (
              <button onClick={toggleSidebar} className="text-gray-500">
                <ChevronRight size={20} />
              </button>
            )}
          </div>
          
          {/* Sidebar navigation */}
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            <button
              onClick={() => handleTabChange('overview')}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-4 py-3 rounded-lg ${activeTab === 'overview' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <BarChart2 size={20} />
              {sidebarOpen && <span>Overview</span>}
            </button>
            
            <button
              onClick={() => handleTabChange('incidents')}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-4 py-3 rounded-lg ${activeTab === 'incidents' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <AlertTriangle size={20} />
              {sidebarOpen && <span>Incidents</span>}
            </button>
            
            
            <button
              onClick={() => handleTabChange('map')}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-4 py-3 rounded-lg ${activeTab === 'map' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Map size={20} />
              {sidebarOpen && <span>Map View</span>}
            </button>
            
            <button
              onClick={() => handleTabChange('reports')}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-4 py-3 rounded-lg ${activeTab === 'reports' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Calendar size={20} />
              {sidebarOpen && <span>Reports</span>}
            </button>

            <Link href={"/profile"}>
            <button
              onClick={() => handleTabChange('users')}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-4 py-3 rounded-lg ${activeTab === 'users' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
              <Users size={20} />
              {sidebarOpen && <span>Users</span>}
            </button>
              </Link>
            
          </nav>
          
          {/* Sidebar footer - User info */}
          <div className={`p-4 border-t border-gray-200 ${sidebarOpen ? '' : 'flex justify-center'}`}>
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserButton/>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user?.displayName}</p>
                  <p className="text-sm text-gray-500">{user?.primaryEmail}</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <UserButton/>
              </div>
            )}
          </div>
          
          {/* Sign out button */}
          {sidebarOpen && (
            <div className="p-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex flex-col min-h-screen ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left side with menu toggle and page title */}
            <div className="flex items-center space-x-4">
              <button onClick={toggleMobileMenu} className="lg:hidden text-gray-500">
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === 'overview' && 'Overview Dashboard'}
                {activeTab === 'incidents' && 'Incident Management'}
                {activeTab === 'cameras' && 'Camera Network'}
                {activeTab === 'map' && 'Geographic Map View'}
                {activeTab === 'reports' && 'Analytics & Reports'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'settings' && 'System Settings'}
              </h2>
            </div>
            
            {/* Right side with notifications and user dropdown */}
            <div className="flex items-center space-x-4">
              {/* Date filter dropdown */}
              <div className="hidden md:block">
                <div className="relative">
                  <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm">
                    <Calendar size={16} />
                    <span>
                      {dateRange === 'today' && 'Today'}
                      {dateRange === 'week' && 'This Week'}
                      {dateRange === 'month' && 'This Month'}
                      {dateRange === 'custom' && 'Custom Range'}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  {/* Date range dropdown would go here */}
                </div>
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button className="relative p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100">
                  <Bell size={22} />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </div>
              
              {/* User dropdown */}
              <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserButton/>
                  </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content based on active tab */}
        <main className="flex-1 p-6">
          {/* Overview Dashboard */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Incidents</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">437</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <AlertTriangle size={24} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-green-600 font-medium">+12% </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pending Review</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{mockStats.pendingReview}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                      <AlertTriangle size={24} className="text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-red-600 font-medium">+5% </span>
                    <span className="text-sm text-gray-500 ml-1">from yesterday</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Resolved Today</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{mockStats.resolvedToday}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <Check size={24} className="text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-green-600 font-medium">+23% </span>
                    <span className="text-sm text-gray-500 ml-1">from yesterday</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Alerts</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{mockStats.activeAlerts}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                      <Bell size={24} className="text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-red-600 font-medium">+3 </span>
                    <span className="text-sm text-gray-500 ml-1">new alerts</span>
                  </div>
                </div>
              </div>
              
              {/* Performance metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Litter Reduction</p>
                      <div className="flex items-end mt-2">
                        <span className="text-2xl font-bold text-gray-800">{mockStats.litterReduction}%</span>
                        <span className="text-sm text-green-600 ml-2">↑</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Public Awareness</p>
                      <div className="flex items-end mt-2">
                        <span className="text-2xl font-bold text-gray-800">{mockStats.publicAwareness}%</span>
                        <span className="text-sm text-green-600 ml-2">↑</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Proper Disposal</p>
                      <div className="flex items-end mt-2">
                        <span className="text-2xl font-bold text-gray-800">{mockStats.properDisposal}%</span>
                        <span className="text-sm text-green-600 ml-2">↑</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Deployed Devices</p>
                      <div className="flex items-end mt-2">
                        <span className="text-2xl font-bold text-gray-800">{mockStats.deployedDevices}</span>
                        <span className="text-sm text-blue-600 ml-2">→</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Littering by Location</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
                  </div>
                  <div className="space-y-4">
                    {mockLitterByLocation.slice(0, 4).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">{item.location}</p>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-green-600 h-2.5 rounded-full" 
                              style={{ width: `${(item.count / mockLitterByLocation[0].count) * 100}%` }}>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{item.count}</span>
                        </div> 
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Recent incidents and activities */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Incidents</h3>
                    <button 
                      onClick={() => handleTabChange('incidents')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left">ID</th>
                          <th scope="col" className="px-4 py-3 text-left">Location</th>
                          <th scope="col" className="px-4 py-3 text-left">Date & Time</th>
                          <th scope="col" className="px-4 py-3 text-left">Severity</th>
                          <th scope="col" className="px-4 py-3 text-left">Status</th>
                          <th scope="col" className="px-4 py-3 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockIncidents.slice(0, 4).map((incident) => (
                          <tr key={incident.id} className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700">{formatDate(incident.timestamp)}</td>
              <td className={`px-4 py-3 text-sm font-medium ${getSeverityColor(incident.severity)}`}>{incident.severity}</td>
              <td className={`px-4 py-3 text-sm font-medium ${getStatusColor(incident.status)}`}>{incident.status}</td>
              <td className="px-4 py-3 text-sm text-blue-600 cursor-pointer">View</td>
              </tr>
            ))}
            </tbody>
          </table>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
          <button 
            onClick={() => handleTabChange('incidents')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View All
          </button>
          </div>
          <div className="space-y-4">
          {mockRecentActivities.slice(0, 4).map((activity) => (
            <div key={activity.id} className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Camera size={16} className="text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-700">{activity.action}</p>
              <p className="text-xs text-gray-500">{activity.location} - {activity.time}</p>
            </div>
            </div>
          ))}
          </div>
        </div>
        </div>
      </div>
      )}

      {/* Incidents Management */}
      {activeTab === 'incidents' && (
      <div>
        {/* Incidents table */}
        <table className="w-full">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
          <th scope="col" className="px-4 py-3 text-left">ID</th>
          <th scope="col" className="px-4 py-3 text-left">Location</th>
          <th scope="col" className="px-4 py-3 text-left">Date & Time</th>
          <th scope="col" className="px-4 py-3 text-left">Severity</th>
          <th scope="col" className="px-4 py-3 text-left">Status</th>
          <th scope="col" className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {mockIncidents.map((incident) => (
          <tr key={incident.id} className="border-b">
            <td className="px-4 py-3 text-sm font-medium text-gray-900">#{incident.id}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{incident.location}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{formatDate(incident.timestamp)}</td>
            <td className={`px-4 py-3 text-sm font-medium ${getSeverityColor(incident.severity)}`}>{incident.severity}</td>
            <td className={`px-4 py-3 text-sm font-medium ${getStatusColor(incident.status)}`}>{incident.status}</td>
            <td className="px-4 py-3 text-sm text-blue-600 cursor-pointer">View</td>
          </tr>
          ))}
        </tbody>
        </table>
      </div>
      )}

{activeTab === 'cameras' && (
  <div className="space-y-6">
    {/* Camera Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Cameras</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{mockStats.deployedDevices}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <Camera size={24} className="text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm text-green-600 font-medium">+3 </span>
          <span className="text-sm text-gray-500 ml-1">from last month</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Online Cameras</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">29</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <Video size={24} className="text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm text-green-600 font-medium">90.6% </span>
          <span className="text-sm text-gray-500 ml-1">uptime</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Offline Cameras</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">3</p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm text-red-600 font-medium">9.4% </span>
          <span className="text-sm text-gray-500 ml-1">offline</span>
        </div>
      </div>
    </div>
    
    {/* Camera List with Filters */}
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Camera Network</h3>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search cameras..." 
                className="px-4 py-2 pl-9 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm flex items-center gap-2 hover:bg-gray-50">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 bg-green-600 rounded-lg text-white text-sm hover:bg-green-700">
              Add Camera
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">Camera ID</th>
              <th scope="col" className="px-4 py-3 text-left">Location</th>
              <th scope="col" className="px-4 py-3 text-left">Status</th>
              <th scope="col" className="px-4 py-3 text-left">Last Activity</th>
              <th scope="col" className="px-4 py-3 text-left">Incidents Detected</th>
              <th scope="col" className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockLitterByLocation.map((location, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">CAM-{100 + index}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{location.location}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${index % 5 === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {index % 5 === 0 ? 'Offline' : 'Online'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{index % 5 === 0 ? '2 days ago' : '10 minutes ago'}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{Math.floor(location.count * 0.8)}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-800">View</button>
                    <button className="text-gray-600 hover:text-gray-800">Settings</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{mockLitterByLocation.length}</span> of <span className="font-medium">{mockStats.deployedDevices}</span> cameras
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</button>
          <button className="px-3 py-1 bg-green-600 border border-green-600 rounded-md text-sm font-medium text-white hover:bg-green-700">Next</button>
        </div>
      </div>
    </div>
    
    {/* Recent Incidents from Cameras */}
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Detections</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockIncidents.slice(0, 3).map((incident) => (
          <div key={incident.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <img src={incident.image} alt={`Incident at ${incident.location}`} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                <p className="text-sm font-medium">{incident.location}</p>
                <p className="text-xs">{formatDate(incident.timestamp)}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Check size={16} />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

{/* Map View Tab */}
{activeTab === 'map' && (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Map sidebar */}
      <div className="md:col-span-1 bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Map Filters</h3>
        
        {/* Incident type filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Incident Type</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="high-severity" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" defaultChecked />
              <label htmlFor="high-severity" className="ml-2 block text-sm text-gray-700">High Severity</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="medium-severity" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" defaultChecked />
              <label htmlFor="medium-severity" className="ml-2 block text-sm text-gray-700">Medium Severity</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="low-severity" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" defaultChecked />
              <label htmlFor="low-severity" className="ml-2 block text-sm text-gray-700">Low Severity</label>
            </div>
          </div>
        </div>
        
        {/* Status filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="pending" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" defaultChecked />
              <label htmlFor="pending" className="ml-2 block text-sm text-gray-700">Pending</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="verified" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" defaultChecked />
              <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">Verified</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="resolved" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" defaultChecked />
              <label htmlFor="resolved" className="ml-2 block text-sm text-gray-700">Resolved</label>
            </div>
          </div>
        </div>
        
        {/* Date range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
            <option>Today</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Custom range</option>
          </select>
        </div>
        
        {/* Location filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
            <option>All Locations</option>
            {mockLitterByLocation.map((location, index) => (
              <option key={index}>{location.location}</option>
            ))}
          </select>
        </div>
        
        <div className="pt-4">
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Apply Filters
          </button>
        </div>
      </div>
      
      {/* Map area */}
      <div className="md:col-span-3 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Panjim, Goa - Littering Incidents</h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Satellite</button>
            <button className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700">Map</button>
          </div>
        </div>
        <div className="h-[600px] bg-gray-100 relative">
          {/* Placeholder for map - would be replaced with actual map component */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Map size={64} className="mx-auto mb-2" />
              <p>Interactive Map would be displayed here</p>
              <p className="text-sm">Showing {mockIncidents.length} incidents in Panjim, Goa</p>
            </div>
          </div>
          
          {/* Map controls */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
            <div className="grid grid-cols-1 gap-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronUp size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronRight size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronDown size={20} />
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Plus size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Minus size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Incident list under map */}
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Incidents on Map</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">ID</th>
              <th scope="col" className="px-4 py-3 text-left">Location</th>
              <th scope="col" className="px-4 py-3 text-left">Coordinates</th>
              <th scope="col" className="px-4 py-3 text-left">Date & Time</th>
              <th scope="col" className="px-4 py-3 text-left">Severity</th>
              <th scope="col" className="px-4 py-3 text-left">Status</th>
              <th scope="col" className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockIncidents.slice(0, 5).map((incident) => (
              <tr key={incident.id} className="border-b">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">#{incident.id}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{incident.location}</td>
                <td className="px-4 py-3 text-sm text-gray-700">15.4989° N, 73.8278° E</td>
                <td className="px-4 py-3 text-sm text-gray-700">{formatDate(incident.timestamp)}</td>
                <td className={`px-4 py-3 text-sm font-medium ${getSeverityColor(incident.severity)}`}>{incident.severity}</td>
                <td className={`px-4 py-3 text-sm font-medium ${getStatusColor(incident.status)}`}>{incident.status}</td>
                <td className="px-4 py-3 text-sm text-blue-600 cursor-pointer">View on Map</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{/* Reports Tab */}
{activeTab === 'reports' && (
  <div className="space-y-6">
    {/* Date and export filters */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Analytics & Reports</h3>
        <p className="text-sm text-gray-500">View and download reports for your littering prevention initiatives</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm">
            <Calendar size={16} />
            <span>
              {dateRange === 'today' && 'Today'}
              {dateRange === 'week' && 'This Week'}
              {dateRange === 'month' && 'This Month'}
              {dateRange === 'custom' && 'Custom Range'}
            </span>
            <ChevronDown size={16} />
          </button>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm hover:bg-gray-50">
          <Download size={16} />
          <span>Export</span>
        </button>
        <button className="px-4 py-2 bg-green-600 rounded-lg text-white text-sm hover:bg-green-700">
          Generate Report
        </button>
      </div>
    </div>
    
    {/* Reports cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-medium text-gray-800">Litter Reduction</h4>
          <div className="p-2 bg-green-50 rounded-lg">
            <Check size={20} className="text-green-600" />
          </div>
        </div>
        <div className="h-32 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
          {/* Placeholder for chart */}
          <BarChart2 size={48} className="text-gray-400" />
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{mockStats.litterReduction}%</div>
          <p className="text-sm text-gray-500 mt-1">Decrease in littering incidents</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
            View Detailed Report
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-medium text-gray-800">Public Awareness</h4>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users size={20} className="text-blue-600" />
          </div>
        </div>
        <div className="h-32 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
          {/* Placeholder for chart */}
          <BarChart2 size={48} className="text-gray-400" />
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{mockStats.publicAwareness}%</div>
          <p className="text-sm text-gray-500 mt-1">Increase in proper waste disposal</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
            View Detailed Report
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-medium text-gray-800">Deployed Devices</h4>
          <div className="p-2 bg-purple-50 rounded-lg">
            <Camera size={20} className="text-purple-600" />
          </div>
        </div>
        <div className="h-32 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
          {/* Placeholder for chart */}
          <BarChart2 size={48} className="text-gray-400" />
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{mockStats.deployedDevices}</div>
          <p className="text-sm text-gray-500 mt-1">Active cameras across Panjim</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
            View Detailed Report
          </button>
        </div>
      </div>
    </div>
    
    {/* Location-wise breakdown */}
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Littering by Location</h3>
        <div className="space-y-4">
          {mockLitterByLocation.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">{item.location}</p>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${(item.count / mockLitterByLocation[0].count) * 100}%` }}>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">{item.count}</span>
              </div> 
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detection Timeline</h3>
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
          {/* Placeholder for timeline chart */}
          <BarChart2 size={64} className="text-gray-400" />
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Daily littering incidents detection trend
        </div>
      </div>
    </div>
    </div>
)}
    </main>
    
    </div>
  </div>
);
}

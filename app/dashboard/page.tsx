// pages/dashboard.js
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
  ChevronRight
} from 'lucide-react';
import { UserButton, useUser } from '@stackframe/stack';

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
                  onClick={() => {handleTabChange('cameras'); toggleMobileMenu();}}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${activeTab === 'cameras' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Camera size={20} />
                  <span>Cameras</span>
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
              onClick={() => handleTabChange('cameras')}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-4 py-3 rounded-lg ${activeTab === 'cameras' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Camera size={20} />
              {sidebarOpen && <span>Cameras</span>}
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
            
            <button
              onClick={() => handleTabChange('users')}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-4 py-3 rounded-lg ${activeTab === 'users' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Users size={20} />
              {sidebarOpen && <span>Users</span>}
            </button>
            
            <button
              onClick={() => handleTabChange('settings')}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-4 py-3 rounded-lg ${activeTab === 'settings' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Settings size={20} />
              {sidebarOpen && <span>Settings</span>}
            </button>
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
                      <p className="text-2xl font-bold text-gray-800 mt-1">{mockStats.totalIncidents}</p>
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

      {/* ...other tabs... */}
    </main>
    </div>
  </div>
  );
}


                            
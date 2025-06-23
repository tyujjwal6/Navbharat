import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings,
  Bell,
  Search,
  User,
  ChevronDown,
  LogOut,
  UserCircle,
  Verified,
  NotebookTabs,
  FilesIcon,
  UserCheck2,
  PartyPopper
} from 'lucide-react';
import Blogs from './Admin/Blogs'
import { useNavigate } from 'react-router-dom';
import AllSites from './Admin/AllSites';
import DrawForms from './Admin/DrawForms';
import FilledForms from './Admin/FilledForms';
import Results from './Admin/Results';
import Advisor from './Admin/Advisor';
import LuckyDraw from './User/LuckyDraw';

const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState('sites');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const tabs = [
    { id: 'sites', label: 'All Sites', icon: Home, component: AllSites },
    { id: 'drawforms', label: 'Draw Forms', icon: BarChart3, component: DrawForms },
    { id: 'filledforms', label: 'Filled Forms', icon: Verified, component:FilledForms },
    { id: 'luckydraw', label: 'Lucky Draws', icon: PartyPopper, component:LuckyDraw },
    { id: 'blogs', label: 'Blogs', icon: NotebookTabs, component: Blogs },
    { id: 'results', label: 'Results', icon: FilesIcon, component: Results },
    { id: 'advisor', label: 'Advisors', icon: UserCheck2, component: Advisor },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || AllSites;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfile = () => {
    console.log('Profile clicked');
    setUserMenuOpen(false);
    // Add your profile logic here
  };
const navigate = useNavigate();
  const handleLogout = () => {
    console.log('Logout clicked');
    setUserMenuOpen(false);
    localStorage.clear();
    navigate("/");
    
    // Add your logout logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-4">
            <img src="https://navbharatniwas.in/assets/blcklogo-CGNpodye.png" alt="Navbharat Niwas Logo" className='w-auto h-12'/>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
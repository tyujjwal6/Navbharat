import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Bell,
  User,
  ChevronDown,
  LogOut,
  UserCircle,
  File,
  Notebook,
  Banknote,
  UserCheck,
  Files
} from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert'; // Assuming you have this
import MyApplication from './User/MyApplication';
import FillDraw from './User/FillDraw';
import LuckyDraw from './User/LuckyDraw';
import Allotments from './User/Allotments';
import Projects from './User/Projects';
import { useNavigate } from 'react-router-dom';

const DashboardUser = () => {
  const [activeTab, setActiveTab] = useState('myapplication');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // --- Mobile Responsiveness Logic ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // --- End ---

  const tabs = [
    { id: 'myapplication', label: 'Applications', icon: File, component: MyApplication },
    { id: 'filldraw', label: 'Fill Draw', icon: Notebook, component: FillDraw },
    { id: 'luckydraw', label: 'Lucky Draw', icon: Banknote, component: LuckyDraw },
    { id: 'allotments', label: 'Allotments', icon: UserCheck, component: Allotments },
    { id: 'projects', label: 'Projects', icon: Files, component: Projects },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || MyApplication;

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
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    console.log('Logout clicked');
    setUserMenuOpen(false);
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={()=>navigate('/')}>
            <img src="https://navbharatniwas.in/assets/blcklogo-CGNpodye.png" alt="Navbharat Niwas Logo" className='w-auto h-12'/>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex cursor-pointer items-center space-x-1" onClick={()=>navigate('/')} >
             <Home/><span className='font-bold'>EXPLORE</span>
            </div>
            
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
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

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                  <button onClick={handleProfile} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <UserCircle className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
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
        {/* Sidebar (Desktop Only) */}
        {!isMobile && (
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
                          ? 'bg-blue-50 text-blue-700 font-semibold'
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
        )}

        {/* ======================= KEY CHANGE HERE ======================= */}
        {/* Main Content (Responsive Margin/Padding) */}
        <main className={`flex-1 transition-all duration-300 ${
            // On mobile, add padding to the bottom (pb-20) to make space for the bottom nav bar.
            // pb-20 (5rem) is more than the nav bar's height h-16 (4rem), giving some nice breathing room.
            isMobile ? 'p-4 pb-20' : 'ml-64 p-8'
          }`}
        >
        {/* =============================================================== */}
          <div className="max-w-7xl mx-auto">
            <ActiveComponent />
          </div>
        </main>
      </div>
      
      {/* ======================= KEY CHANGE HERE ======================= */}
      {/* Bottom Navigation (Mobile Only) */}
      {isMobile && (
        // The `fixed` class is crucial. It positions the nav relative to the viewport.
        // `bottom-0`, `left-0`, `right-0` pin it to the bottom edges of the screen.
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around h-16 z-40">
      {/* =============================================================== */}
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors ${
                  isActive ? 'text-blue-700' : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default DashboardUser;
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { 
  LayoutDashboard, Settings, Calendar, Newspaper, Users, 
  Mail, Image, LogOut, Menu, X, Cross, Bell, ChevronDown
} from 'lucide-react';

// Import admin components
import { DashboardOverview } from '../components/admin/DashboardOverview';
import { PageSettingsManager } from '../components/admin/PageSettingsManager';
import { EventsManager } from '../components/admin/EventsManager';
import { NewsManager } from '../components/admin/NewsManager';
import { MembersManager } from '../components/admin/MembersManager';
import { ContactsManager } from '../components/admin/ContactsManager';
import { NewsletterManager } from '../components/admin/NewsletterManager';
import { GalleryManager } from '../components/admin/GalleryManager';

export const AdminDashboard = () => {
  const { user, logout, loading, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // If user data was passed from AuthCallback, use it
    if (location.state?.user) {
      return;
    }
    
    // Otherwise check auth
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate, location.state]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0]">
        <div className="animate-spin w-8 h-8 border-4 border-[#C29B57] border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentUser = location.state?.user || user;

  if (!currentUser) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pages', label: 'Page Settings', icon: Settings },
    { id: 'events', label: 'Events & Calendar', icon: Calendar },
    { id: 'news', label: 'News & Blog', icon: Newspaper },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'contacts', label: 'Contact Messages', icon: Mail },
    { id: 'newsletter', label: 'Newsletter', icon: Bell },
    { id: 'gallery', label: 'Gallery', icon: Image },
  ];

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-[#EAE5DC]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#1C2522] text-[#F8F5F0] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#7A2E35] rounded-sm flex items-center justify-center">
            <Cross className="w-4 h-4" />
          </div>
          <span className="font-semibold">CMS Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#1C2522] text-[#F8F5F0]
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Logo */}
          <div className="p-6 border-b border-[#F8F5F0]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7A2E35] rounded-sm flex items-center justify-center">
                <Cross className="w-5 h-5" />
              </div>
              <div>
                <span className="font-['Cormorant_Garamond'] text-lg font-semibold">CPS PNG</span>
                <span className="block text-xs text-[#C29B57]">Admin Panel</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-200px)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                data-testid={`nav-${tab.id}`}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left text-sm
                  transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-[#C29B57] text-[#1C2522]' 
                    : 'text-[#F8F5F0]/70 hover:bg-[#F8F5F0]/10 hover:text-[#F8F5F0]'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#F8F5F0]/10">
            <div className="flex items-center gap-3 mb-4">
              {currentUser.picture ? (
                <img 
                  src={currentUser.picture} 
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-[#C29B57] rounded-full flex items-center justify-center text-[#1C2522] font-semibold">
                  {currentUser.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <p className="text-xs text-[#F8F5F0]/50 truncate">{currentUser.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              data-testid="logout-button"
              variant="outline"
              className="w-full border-[#F8F5F0]/20 text-[#F8F5F0] hover:bg-[#F8F5F0]/10 rounded-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1C2522]">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h1>
                <p className="text-[#4A5D54] text-sm mt-1">
                  Manage your website content and settings
                </p>
              </div>
              <Button
                onClick={() => window.open('/', '_blank')}
                variant="outline"
                className="hidden md:flex border-[#1C2522]/20 rounded-sm"
              >
                View Website
              </Button>
            </div>

            {/* Tab Content */}
            <div className="bg-[#F8F5F0] rounded-sm border border-[#1C2522]/10 p-6">
              {activeTab === 'overview' && <DashboardOverview />}
              {activeTab === 'pages' && <PageSettingsManager />}
              {activeTab === 'events' && <EventsManager />}
              {activeTab === 'news' && <NewsManager />}
              {activeTab === 'members' && <MembersManager />}
              {activeTab === 'contacts' && <ContactsManager />}
              {activeTab === 'newsletter' && <NewsletterManager />}
              {activeTab === 'gallery' && <GalleryManager />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

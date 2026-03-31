import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../ui/card';
import { Users, Calendar, Newspaper, Mail, Bell, Image, TrendingUp, Clock } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, contactsRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`, { withCredentials: true }),
        axios.get(`${API}/contact`, { withCredentials: true })
      ]);
      setStats(statsRes.data);
      setRecentContacts(contactsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  const statCards = [
    { label: 'Total Members', value: stats?.members || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Upcoming Events', value: stats?.events || 0, icon: Calendar, color: 'bg-green-500' },
    { label: 'News Articles', value: stats?.news || 0, icon: Newspaper, color: 'bg-purple-500' },
    { label: 'Pending Messages', value: stats?.contacts?.pending || 0, icon: Mail, color: 'bg-orange-500' },
    { label: 'Subscribers', value: stats?.subscribers || 0, icon: Bell, color: 'bg-pink-500' },
  ];

  return (
    <div data-testid="dashboard-overview" className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="p-6 bg-white border-none shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#4A5D54]">{stat.label}</p>
                <p className="text-3xl font-['Cormorant_Garamond'] font-bold text-[#1C2522] mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-2 rounded-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card className="p-6 bg-white border-none shadow-sm">
          <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522] mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#C29B57]" />
            Recent Messages
          </h3>
          {recentContacts.length === 0 ? (
            <p className="text-[#4A5D54] text-sm">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((contact, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-[#EAE5DC] rounded-sm">
                  <div className="w-10 h-10 bg-[#C29B57] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {contact.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[#1C2522] truncate">{contact.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        contact.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        contact.status === 'read' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#4A5D54] truncate">{contact.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 bg-white border-none shadow-sm">
          <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522] mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#C29B57]" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Event', icon: Calendar, color: 'bg-green-500' },
              { label: 'Write Article', icon: Newspaper, color: 'bg-purple-500' },
              { label: 'Add Member', icon: Users, color: 'bg-blue-500' },
              { label: 'Upload Photos', icon: Image, color: 'bg-pink-500' },
            ].map((action, idx) => (
              <button
                key={idx}
                className="flex items-center gap-3 p-4 bg-[#EAE5DC] rounded-sm hover:bg-[#1C2522] hover:text-[#F8F5F0] transition-colors group"
              >
                <div className={`${action.color} p-2 rounded-sm group-hover:bg-[#C29B57]`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* System Info */}
      <Card className="p-6 bg-white border-none shadow-sm">
        <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522] mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#C29B57]" />
          System Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-[#4A5D54]">Last Updated</p>
            <p className="font-medium text-[#1C2522]">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-[#4A5D54]">Total Contacts</p>
            <p className="font-medium text-[#1C2522]">{stats?.contacts?.total || 0}</p>
          </div>
          <div>
            <p className="text-[#4A5D54]">API Status</p>
            <p className="font-medium text-green-600">Online</p>
          </div>
          <div>
            <p className="text-[#4A5D54]">Version</p>
            <p className="font-medium text-[#1C2522]">2.0.0</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

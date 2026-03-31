import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Bell, Mail, UserX, Download, Search, Users } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const NewsletterManager = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get(`${API}/newsletter`, { withCredentials: true });
      setSubscribers(response.data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (email) => {
    if (!window.confirm(`Unsubscribe ${email}?`)) return;
    
    try {
      await axios.delete(`${API}/newsletter/${encodeURIComponent(email)}`, { withCredentials: true });
      toast.success('Subscriber removed');
      fetchSubscribers();
    } catch (error) {
      toast.error('Failed to unsubscribe');
    }
  };

  const exportCSV = () => {
    const activeSubscribers = subscribers.filter(s => s.subscribed);
    const csv = [
      ['Email', 'Name', 'Subscribed Date'],
      ...activeSubscribers.map(s => [s.email, s.name || '', new Date(s.created_at).toLocaleDateString()])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_subscribers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeCount = subscribers.filter(s => s.subscribed).length;

  if (loading) {
    return <div className="animate-pulse">Loading subscribers...</div>;
  }

  return (
    <div data-testid="newsletter-manager">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522]">
            Newsletter Subscribers
          </h3>
          <p className="text-sm text-[#4A5D54] mt-1">
            {activeCount} active subscribers
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5D54]" />
            <Input
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button 
            onClick={exportCSV}
            variant="outline"
            className="rounded-sm"
            disabled={activeCount === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-white border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-sm">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1C2522]">{activeCount}</p>
              <p className="text-sm text-[#4A5D54]">Active Subscribers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-sm">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1C2522]">{subscribers.length - activeCount}</p>
              <p className="text-sm text-[#4A5D54]">Unsubscribed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-sm">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1C2522]">{subscribers.length}</p>
              <p className="text-sm text-[#4A5D54]">Total Records</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Subscribers List */}
      {filteredSubscribers.length === 0 ? (
        <Card className="p-8 text-center bg-white border-none">
          <Bell className="w-12 h-12 text-[#C29B57] mx-auto mb-4" />
          <p className="text-[#4A5D54]">
            {searchTerm ? 'No subscribers match your search' : 'No subscribers yet'}
          </p>
        </Card>
      ) : (
        <Card className="bg-white border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#EAE5DC]">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-[#1C2522]">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-[#1C2522]">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-[#1C2522]">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-[#1C2522]">Subscribed</th>
                  <th className="text-right p-4 text-sm font-medium text-[#1C2522]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DC]">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-[#F8F5F0]/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#4A5D54]" />
                        <a href={`mailto:${subscriber.email}`} className="text-[#1C2522] hover:text-[#C29B57]">
                          {subscriber.email}
                        </a>
                      </div>
                    </td>
                    <td className="p-4 text-[#4A5D54]">
                      {subscriber.name || '-'}
                    </td>
                    <td className="p-4">
                      {subscriber.subscribed ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-[#4A5D54]">
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {subscriber.subscribed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnsubscribe(subscriber.email)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Mail, Trash2, Eye, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const ContactsManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API}/contact`, { withCredentials: true });
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/contact/${id}`, { status }, { withCredentials: true });
      toast.success('Status updated');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await axios.delete(`${API}/contact/${id}`, { withCredentials: true });
      toast.success('Message deleted');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const filteredContacts = filter === 'all' 
    ? contacts 
    : contacts.filter(c => c.status === filter);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'read': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'responded': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading messages...</div>;
  }

  return (
    <div data-testid="contacts-manager">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522]">
          Contact Messages ({contacts.length})
        </h3>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredContacts.length === 0 ? (
        <Card className="p-8 text-center bg-white border-none">
          <Mail className="w-12 h-12 text-[#C29B57] mx-auto mb-4" />
          <p className="text-[#4A5D54]">
            {filter === 'all' ? 'No messages yet' : `No ${filter} messages`}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="p-6 bg-white border-none shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#C29B57] rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    {contact.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C2522]">{contact.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-[#4A5D54]">
                      <Mail className="w-3 h-3" />
                      <a href={`mailto:${contact.email}`} className="hover:text-[#C29B57]">
                        {contact.email}
                      </a>
                      {contact.phone && (
                        <>
                          <span>•</span>
                          <span>{contact.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select 
                    value={contact.status} 
                    onValueChange={(value) => updateStatus(contact.id, value)}
                  >
                    <SelectTrigger className="w-32 h-8">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(contact.status)}
                        <span className="capitalize">{contact.status}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="read">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-500" />
                          Read
                        </div>
                      </SelectItem>
                      <SelectItem value="responded">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Responded
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(contact.id)}
                    className="rounded-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-[#EAE5DC] p-4 rounded-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-[#C29B57]" />
                  <span className="font-medium text-[#1C2522]">{contact.subject}</span>
                </div>
                <p className="text-[#4A5D54] whitespace-pre-wrap">{contact.message}</p>
              </div>

              <div className="mt-4 text-sm text-[#4A5D54]">
                Received: {formatDate(contact.created_at)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

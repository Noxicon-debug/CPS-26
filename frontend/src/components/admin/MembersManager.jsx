import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, Edit, Trash2, Users, Mail, Phone, Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const MembersManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    company: '',
    bio: '',
    image: '',
    featured: false,
    published: true
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${API}/members?published_only=false`, { withCredentials: true });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingMember) {
        await axios.put(`${API}/members/${editingMember.id}`, formData, { withCredentials: true });
        toast.success('Member updated successfully!');
      } else {
        await axios.post(`${API}/members`, formData, { withCredentials: true });
        toast.success('Member added successfully!');
      }
      fetchMembers();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    
    try {
      await axios.delete(`${API}/members/${id}`, { withCredentials: true });
      toast.success('Member deleted');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      profession: member.profession,
      company: member.company || '',
      bio: member.bio || '',
      image: member.image || '',
      featured: member.featured,
      published: member.published
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      profession: '',
      company: '',
      bio: '',
      image: '',
      featured: false,
      published: true
    });
  };

  if (loading) {
    return <div className="animate-pulse">Loading members...</div>;
  }

  return (
    <div data-testid="members-manager">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522]">
          Member Directory
        </h3>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-member-button" className="bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] rounded-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-['Cormorant_Garamond'] text-2xl">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Profession *</Label>
                  <Input
                    required
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="mt-1"
                    placeholder="Doctor, Lawyer, Engineer..."
                  />
                </div>
                <div>
                  <Label>Company/Organization</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="mt-1"
                  rows={3}
                  placeholder="Brief bio..."
                />
              </div>
              <div>
                <Label>Profile Image URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1"
                  placeholder="/images/..."
                />
              </div>

              <div className="flex gap-6 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label>Featured Member</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label>Visible on Website</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-[#1C2522] text-[#F8F5F0]">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {editingMember ? 'Update Member' : 'Add Member'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members Grid */}
      {members.length === 0 ? (
        <Card className="p-8 text-center bg-white border-none">
          <Users className="w-12 h-12 text-[#C29B57] mx-auto mb-4" />
          <p className="text-[#4A5D54]">No members yet. Add your first member!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card key={member.id} className="p-4 bg-white border-none shadow-sm">
              <div className="flex items-start gap-4">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-16 h-16 object-cover rounded-full" />
                ) : (
                  <div className="w-16 h-16 bg-[#C29B57] rounded-full flex items-center justify-center text-white text-xl font-semibold">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-[#1C2522] flex items-center gap-2">
                        {member.name}
                        {member.featured && (
                          <span className="text-xs bg-[#C29B57] text-white px-1.5 py-0.5 rounded-sm">★</span>
                        )}
                      </h4>
                      <p className="text-sm text-[#C29B57]">{member.profession}</p>
                    </div>
                  </div>
                  {member.company && (
                    <p className="text-sm text-[#4A5D54] flex items-center gap-1 mt-1">
                      <Briefcase className="w-3 h-3" />
                      {member.company}
                    </p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(member)} className="rounded-sm flex-1">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(member.id)} className="rounded-sm text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

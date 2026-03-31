import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, Calendar as CalendarIcon, Users, MapPin, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [rsvpDialogOpen, setRsvpDialogOpen] = useState(false);
  const [selectedEventRSVPs, setSelectedEventRSVPs] = useState([]);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    end_date: '',
    end_time: '',
    location: '',
    featured: false,
    recurring: false,
    recurrence_pattern: '',
    recurrence_end: '',
    rsvp_enabled: false,
    image: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingEvent) {
        await axios.put(`${API}/events/${editingEvent.id}`, formData, { withCredentials: true });
        toast.success('Event updated successfully!');
      } else {
        await axios.post(`${API}/events`, formData, { withCredentials: true });
        toast.success('Event created successfully!');
      }
      fetchEvents();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await axios.delete(`${API}/events/${id}`, { withCredentials: true });
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      end_date: event.end_date || '',
      end_time: event.end_time || '',
      location: event.location,
      featured: event.featured,
      recurring: event.recurring,
      recurrence_pattern: event.recurrence_pattern || '',
      recurrence_end: event.recurrence_end || '',
      rsvp_enabled: event.rsvp_enabled,
      image: event.image || ''
    });
    setDialogOpen(true);
  };

  const viewRSVPs = async (eventId) => {
    try {
      const response = await axios.get(`${API}/rsvp/${eventId}`, { withCredentials: true });
      setSelectedEventRSVPs(response.data);
      setRsvpDialogOpen(true);
    } catch (error) {
      toast.error('Failed to fetch RSVPs');
    }
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      end_date: '',
      end_time: '',
      location: '',
      featured: false,
      recurring: false,
      recurrence_pattern: '',
      recurrence_end: '',
      rsvp_enabled: false,
      image: ''
    });
  };

  if (loading) {
    return <div className="animate-pulse">Loading events...</div>;
  }

  return (
    <div data-testid="events-manager">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522]">
          Events & Calendar
        </h3>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-event-button" className="bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] rounded-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-['Cormorant_Garamond'] text-2xl">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>Event Title *</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Start Time *</Label>
                  <Input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Location *</Label>
                <Input
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1"
                  placeholder="/images/Highlights/..."
                />
              </div>
              
              {/* Recurring Event Options */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Recurring Event</Label>
                  <Switch
                    checked={formData.recurring}
                    onCheckedChange={(checked) => setFormData({ ...formData, recurring: checked })}
                  />
                </div>
                {formData.recurring && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Recurrence Pattern</Label>
                      <Select
                        value={formData.recurrence_pattern}
                        onValueChange={(value) => setFormData({ ...formData, recurrence_pattern: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select pattern" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Recurrence End Date</Label>
                      <Input
                        type="date"
                        value={formData.recurrence_end}
                        onChange={(e) => setFormData({ ...formData, recurrence_end: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Other Options */}
              <div className="flex gap-6 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label>Featured Event</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.rsvp_enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, rsvp_enabled: checked })}
                  />
                  <Label>Enable RSVP</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-[#1C2522] text-[#F8F5F0]">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <Card className="p-8 text-center bg-white border-none">
            <CalendarIcon className="w-12 h-12 text-[#C29B57] mx-auto mb-4" />
            <p className="text-[#4A5D54]">No events yet. Create your first event!</p>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="p-4 bg-white border-none shadow-sm">
              <div className="flex items-start gap-4">
                {event.image && (
                  <img src={event.image} alt={event.title} className="w-24 h-24 object-cover rounded-sm" />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-[#1C2522] flex items-center gap-2">
                        {event.title}
                        {event.featured && (
                          <span className="text-xs bg-[#C29B57] text-white px-2 py-0.5 rounded-sm">Featured</span>
                        )}
                        {event.recurring && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-sm">Recurring</span>
                        )}
                      </h4>
                      <p className="text-sm text-[#4A5D54] mt-1 line-clamp-2">{event.description}</p>
                    </div>
                    <div className="flex gap-2">
                      {event.rsvp_enabled && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewRSVPs(event.id)}
                          className="rounded-sm"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          {event.attendees}
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleEdit(event)} className="rounded-sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)} className="rounded-sm text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3 text-sm text-[#4A5D54]">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* RSVP Dialog */}
      <Dialog open={rsvpDialogOpen} onOpenChange={setRsvpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event RSVPs</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedEventRSVPs.length === 0 ? (
              <p className="text-[#4A5D54] text-center py-4">No RSVPs yet</p>
            ) : (
              selectedEventRSVPs.map((rsvp) => (
                <div key={rsvp.id} className="flex items-center justify-between p-3 bg-[#EAE5DC] rounded-sm">
                  <div>
                    <p className="font-medium text-[#1C2522]">{rsvp.name}</p>
                    <p className="text-sm text-[#4A5D54]">{rsvp.email}</p>
                  </div>
                  <span className="text-sm text-[#4A5D54]">{rsvp.guests} guest(s)</span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

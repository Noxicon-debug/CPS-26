import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const eventImages = [
  '/images/Highlights/AG8A2604.jpg',
  '/images/Highlights/AG8A2614.jpg',
  '/images/Highlights/AG8A2626.jpg',
  '/images/Highlights/AG8A2637.jpg',
];

const sampleEvents = [
  {
    id: '1',
    title: 'Annual General Meeting 2025',
    description: 'Join us for our Annual General Meeting where we will review the year\'s achievements and plan for the future.',
    date: '2025-03-15',
    time: '09:00 AM',
    location: 'Holiday Inn, Port Moresby',
    attendees: 75,
    featured: true,
    image: eventImages[0],
  },
  {
    id: '2',
    title: 'Professional Development Workshop',
    description: 'Enhance your skills with our professional development workshop focused on leadership and ethics.',
    date: '2025-04-10',
    time: '02:00 PM',
    location: 'Ela Beach Hotel',
    attendees: 45,
    featured: false,
    image: eventImages[1],
  },
  {
    id: '3',
    title: 'Lenten Retreat',
    description: 'A spiritual retreat to prepare our hearts and minds for the Easter season.',
    date: '2025-03-28',
    time: '06:00 AM',
    location: 'Holy Spirit Cathedral',
    attendees: 120,
    featured: false,
    image: eventImages[2],
  },
  {
    id: '4',
    title: 'Community Service Day',
    description: 'Give back to our community through various service projects across Port Moresby.',
    date: '2025-05-01',
    time: '08:00 AM',
    location: 'Various Locations',
    attendees: 60,
    featured: false,
    image: eventImages[3],
  },
];

export const Events = () => {
  const [events, setEvents] = useState(sampleEvents);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API}/events`);
        if (response.data && response.data.length > 0) {
          setEvents(response.data);
        }
      } catch (error) {
        console.log('Using sample events');
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const featuredEvent = events.find((e) => e.featured) || events[0];
  const otherEvents = events.filter((e) => e.id !== featuredEvent?.id);

  return (
    <div data-testid="events-page" className="pt-20">
      {/* Header */}
      <section className="py-16 md:py-24 bg-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
              Events
            </span>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl tracking-tighter font-medium text-[#1C2522] leading-tight mt-4">
              Upcoming Gatherings
            </h1>
            <p className="text-lg text-[#4A5D54] mt-4 max-w-2xl mx-auto">
              Join us for spiritual formation, professional development, and community fellowship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Featured Image */}
              <div className="lg:col-span-8">
                <div className="relative overflow-hidden rounded-sm h-[400px] md:h-[500px]">
                  <img
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    data-testid="featured-event-image"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#7A2E35] text-[#F8F5F0] px-4 py-2 rounded-sm text-sm font-medium">
                    Featured Event
                  </div>
                </div>
              </div>

              {/* Featured Info */}
              <div className="lg:col-span-4 flex flex-col justify-center">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                  {formatDate(featuredEvent.date)}
                </span>
                <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-medium text-[#1C2522] mt-3">
                  {featuredEvent.title}
                </h2>
                <p className="text-[#4A5D54] mt-4 leading-relaxed">
                  {featuredEvent.description}
                </p>

                <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-3 text-[#4A5D54]">
                    <Clock className="w-5 h-5 text-[#C29B57]" />
                    <span>{featuredEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#4A5D54]">
                    <MapPin className="w-5 h-5 text-[#C29B57]" />
                    <span>{featuredEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#4A5D54]">
                    <Users className="w-5 h-5 text-[#C29B57]" />
                    <span>{featuredEvent.attendees} expected attendees</span>
                  </div>
                </div>

                <Button
                  data-testid="featured-event-register"
                  className="bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] mt-8 px-6 rounded-sm w-fit"
                >
                  Register Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Other Events */}
      <section className="py-16 md:py-24 bg-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-['Cormorant_Garamond'] text-3xl font-medium text-[#1C2522]">
              More Events
            </h2>
            <div className="flex gap-2">
              <Button
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                onClick={() => setFilter('upcoming')}
                data-testid="filter-upcoming"
                className={`rounded-sm ${filter === 'upcoming' ? 'bg-[#1C2522] text-[#F8F5F0]' : 'border-[#1C2522]/20'}`}
              >
                Upcoming
              </Button>
              <Button
                variant={filter === 'past' ? 'default' : 'outline'}
                onClick={() => setFilter('past')}
                data-testid="filter-past"
                className={`rounded-sm ${filter === 'past' ? 'bg-[#1C2522] text-[#F8F5F0]' : 'border-[#1C2522]/20'}`}
              >
                Past
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  data-testid={`event-card-${idx}`}
                  className="bg-[#F8F5F0] border border-[#1C2522]/10 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[#C29B57] text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522] mb-2">
                      {event.title}
                    </h3>
                    <p className="text-[#4A5D54] text-sm line-clamp-2 mb-4">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 text-[#4A5D54] text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <Calendar className="w-16 h-16 text-[#C29B57] mx-auto mb-6" />
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-medium text-[#1C2522]">
            Stay Updated
          </h2>
          <p className="text-[#4A5D54] mt-4 max-w-xl mx-auto">
            Subscribe to our calendar to never miss an event. Join us for fellowship, formation, and service.
          </p>
          <Button
            data-testid="subscribe-calendar"
            className="bg-[#7A2E35] text-[#F8F5F0] hover:bg-[#5a222a] mt-8 px-8 rounded-sm"
          >
            Subscribe to Calendar
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Events;

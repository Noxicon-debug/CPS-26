import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Clock, User, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const newsImages = [
  '/images/Highlights/AG8A2590.jpg',
  '/images/Highlights/AG8A2598.jpg',
  '/images/Highlights/AG8A2607.jpg',
  '/images/Highlights/AG8A2617.jpg',
  '/images/Highlights/AG8A2628.jpg',
  '/images/Highlights/AG8A2635.jpg',
];

const sampleNews = [
  {
    id: 'sample-1',
    title: 'New Executive Committee Elected for 2025',
    excerpt: 'The Catholic Professionals Society PNG has elected a new executive committee to lead the organization through 2025 and beyond.',
    content: 'Full article content here...',
    date: '2025-01-15',
    author: 'Admin',
    category: 'Announcements',
    readTime: '3 min read',
    featured: true,
    image: newsImages[0],
  },
  {
    id: 'sample-2',
    title: 'Successful Charity Drive Raises K50,000',
    excerpt: 'Our annual charity drive exceeded expectations, raising over K50,000 for local schools and hospitals.',
    content: 'Full article content here...',
    date: '2025-01-10',
    author: 'Communications Team',
    category: 'Community',
    readTime: '5 min read',
    featured: false,
    image: newsImages[1],
  },
  {
    id: 'sample-3',
    title: 'Partnership with Local Universities Announced',
    excerpt: 'We are excited to announce new partnerships with leading universities to support Catholic student professionals.',
    content: 'Full article content here...',
    date: '2025-01-05',
    author: 'Admin',
    category: 'Partnerships',
    readTime: '4 min read',
    featured: false,
    image: newsImages[2],
  },
  {
    id: 'sample-4',
    title: 'Lenten Reflection Series Coming Soon',
    excerpt: 'Join us for a special Lenten reflection series designed for busy professionals seeking spiritual growth.',
    content: 'Full article content here...',
    date: '2024-12-28',
    author: 'Spiritual Director',
    category: 'Spirituality',
    readTime: '2 min read',
    featured: false,
    image: newsImages[3],
  },
  {
    id: 'sample-5',
    title: 'Member Spotlight: Dr. Maria Santos',
    excerpt: 'Learn about Dr. Maria Santos and her journey integrating faith with her medical practice.',
    content: 'Full article content here...',
    date: '2024-12-20',
    author: 'Communications Team',
    category: 'Member Stories',
    readTime: '6 min read',
    featured: false,
    image: newsImages[4],
  },
  {
    id: 'sample-6',
    title: 'Year in Review: 2024 Achievements',
    excerpt: 'A look back at our accomplishments, growth, and impact throughout 2024.',
    content: 'Full article content here...',
    date: '2024-12-15',
    author: 'Executive Committee',
    category: 'Annual Report',
    readTime: '8 min read',
    featured: false,
    image: newsImages[5],
  },
];

export const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const categories = ['All', 'Announcements', 'Community', 'Partnerships', 'Spirituality', 'Member Stories'];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API}/news`);
      if (response.data && response.data.length > 0) {
        // Add default images to news without images
        const newsWithImages = response.data.map((article, idx) => ({
          ...article,
          image: article.image || newsImages[idx % newsImages.length]
        }));
        setNews(newsWithImages);
      } else {
        setNews(sampleNews);
      }
    } catch (error) {
      console.log('Using sample news');
      setNews(sampleNews);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setSubscribing(true);
    try {
      await axios.post(`${API}/newsletter`, { email: newsletterEmail });
      toast.success('Successfully subscribed to newsletter!');
      setNewsletterEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const filteredNews = selectedCategory === 'All' 
    ? news 
    : news.filter((n) => n.category === selectedCategory);

  const featuredNews = news.find((n) => n.featured) || news[0];
  const otherNews = filteredNews.filter((n) => n.id !== featuredNews?.id);

  if (loading) {
    return (
      <div data-testid="news-page" className="pt-20 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C29B57] animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="news-page" className="pt-20">
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
              News & Updates
            </span>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl tracking-tighter font-medium text-[#1C2522] leading-tight mt-4">
              Latest From Our Community
            </h1>
            <p className="text-lg text-[#4A5D54] mt-4 max-w-2xl mx-auto">
              Stay informed about our activities, achievements, and member stories.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                data-testid={`category-${category.toLowerCase().replace(' ', '-')}`}
                className={`rounded-sm ${
                  selectedCategory === category 
                    ? 'bg-[#1C2522] text-[#F8F5F0]' 
                    : 'border-[#1C2522]/20 hover:bg-[#1C2522]/5'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredNews && selectedCategory === 'All' && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
            >
              <div className="relative overflow-hidden rounded-sm h-[400px]">
                <img
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  data-testid="featured-news-image"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#C29B57] text-[#1C2522] px-4 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">
                  {featuredNews.category}
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-4 text-[#4A5D54] text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(featuredNews.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredNews.readTime}</span>
                  </div>
                </div>

                <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-medium text-[#1C2522] leading-tight">
                  {featuredNews.title}
                </h2>

                <p className="text-[#4A5D54] mt-4 text-lg leading-relaxed">
                  {featuredNews.excerpt}
                </p>

                <div className="flex items-center gap-3 mt-6">
                  <User className="w-5 h-5 text-[#C29B57]" />
                  <span className="text-[#4A5D54]">By {featuredNews.author}</span>
                </div>

                <Button
                  data-testid="featured-news-read-more"
                  className="bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] mt-8 px-6 rounded-sm w-fit"
                >
                  Read Article
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-16 md:py-24 bg-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {otherNews.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-[#C29B57] mx-auto mb-4" />
              <p className="text-[#4A5D54]">No articles in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherNews.map((article, idx) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    data-testid={`news-card-${idx}`}
                    className="bg-[#F8F5F0] border border-[#1C2522]/10 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="relative h-48">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-[#F8F5F0] text-[#7A2E35] px-3 py-1 rounded-sm text-xs font-bold">
                        {article.category}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-[#4A5D54] text-sm mb-3">
                        <span>{formatDate(article.date)}</span>
                        <span className="text-[#1C2522]/20">|</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522] mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-[#4A5D54] text-sm line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>
                      <Button
                        variant="ghost"
                        className="mt-4 p-0 h-auto text-[#7A2E35] hover:text-[#1C2522] hover:bg-transparent justify-start"
                      >
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination placeholder */}
          {otherNews.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                data-testid="load-more-news"
                className="border-[#1C2522]/20 text-[#1C2522] hover:bg-[#EAE5DC] rounded-sm px-8"
              >
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24 bg-[#7A2E35]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-medium text-[#F8F5F0]">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-[#F8F5F0]/80 mt-4 max-w-xl mx-auto">
            Get the latest news, event updates, and member stories delivered to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center mt-8 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              data-testid="newsletter-email"
              className="flex-1 px-4 py-3 bg-[#F8F5F0] text-[#1C2522] rounded-sm outline-none focus:ring-2 focus:ring-[#C29B57]"
            />
            <Button
              type="submit"
              disabled={subscribing}
              data-testid="newsletter-subscribe"
              className="bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] px-6 rounded-sm"
            >
              {subscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default News;

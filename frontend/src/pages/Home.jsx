import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Calendar, BookOpen, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

// Sample images from the Highlights folder
const heroImages = [
  '/images/Highlights/AG8A2573.jpg',
  '/images/Highlights/AG8A2590.jpg',
  '/images/Highlights/AG8A2604.jpg',
  '/images/Highlights/AG8A2614.jpg',
];

const galleryPreview = [
  '/images/Highlights/AG8A2576.jpg',
  '/images/Highlights/AG8A2591.jpg',
  '/images/Highlights/AG8A2597.jpg',
  '/images/Highlights/AG8A2610.jpg',
  '/images/Highlights/AG8A2618.jpg',
  '/images/Highlights/AG8A2626.jpg',
];

export const Home = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with fellow Catholic professionals across Papua New Guinea.',
    },
    {
      icon: Calendar,
      title: 'Events',
      description: 'Regular gatherings, retreats, and professional development sessions.',
    },
    {
      icon: BookOpen,
      title: 'Formation',
      description: 'Grow in faith through spiritual formation and professional ethics.',
    },
    {
      icon: Heart,
      title: 'Service',
      description: 'Give back to our communities through charitable works and outreach.',
    },
  ];

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section className="min-h-screen pt-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                Faith & Excellence
              </span>
              <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl lg:text-7xl tracking-tighter font-medium text-[#1C2522] leading-tight mt-4">
                Catholic Professionals
                <span className="block text-[#7A2E35]">of Papua New Guinea</span>
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-[#4A5D54] mt-6 max-w-xl">
                Uniting professionals in faith, service, and excellence. Together, we build a community rooted in Catholic values while advancing our nation.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Button
                  asChild
                  data-testid="hero-cta-primary"
                  className="bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] px-8 py-6 rounded-sm text-base font-medium"
                >
                  <Link to="/contact">
                    Join Our Community
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  data-testid="hero-cta-secondary"
                  className="border-[#1C2522]/20 text-[#1C2522] hover:bg-[#EAE5DC] px-8 py-6 rounded-sm text-base font-medium"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right - Bento Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {heroImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                  className={`relative overflow-hidden rounded-sm ${
                    idx === 0 ? 'row-span-2' : ''
                  }`}
                >
                  <img
                    src={img}
                    alt={`Community highlight ${idx + 1}`}
                    data-testid={`hero-image-${idx}`}
                    className={`w-full object-cover ${
                      idx === 0 ? 'h-full min-h-[400px]' : 'h-48 md:h-56'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C2522]/30 to-transparent" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 md:py-32 bg-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                About Us
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#1C2522] leading-tight mt-4">
                Serving God Through Our Professions
              </h2>
              <p className="drop-cap text-base md:text-lg leading-relaxed text-[#4A5D54] mt-6">
                Catholic Professionals Society of Papua New Guinea brings together men and women who seek to integrate their Catholic faith with their professional lives. Founded on the principles of service, integrity, and community, we provide a platform for networking, spiritual growth, and collective action.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-[#4A5D54] mt-4">
                Our members come from diverse professional backgrounds—doctors, lawyers, engineers, educators, business leaders—united by a common commitment to live out their faith in the marketplace.
              </p>
              <Button
                asChild
                data-testid="about-cta"
                className="bg-[#7A2E35] text-[#F8F5F0] hover:bg-[#5a222a] mt-8 px-6 rounded-sm"
              >
                <Link to="/about">
                  Our Story
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="/images/Highlights/AG8A2627.jpg"
                alt="Community gathering"
                data-testid="about-preview-image"
                className="w-full h-[500px] object-cover rounded-sm"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#1C2522] text-[#F8F5F0] p-6 rounded-sm">
                <div className="text-4xl font-['Cormorant_Garamond'] font-bold text-[#C29B57]">
                  100+
                </div>
                <div className="text-sm uppercase tracking-wider mt-1">
                  Active Members
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
              What We Offer
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#1C2522] leading-tight mt-4">
              Growing Together in Faith & Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  data-testid={`feature-card-${idx}`}
                  className="bg-[#F8F5F0] border border-[#1C2522]/10 rounded-sm p-8 h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-[#C29B57]/10 rounded-sm flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-[#C29B57]" />
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#4A5D54] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 md:py-32 bg-[#1C2522]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                Gallery
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#F8F5F0] leading-tight mt-4">
                Community Highlights
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              data-testid="gallery-cta"
              className="border-[#F8F5F0]/20 text-[#F8F5F0] hover:bg-[#F8F5F0]/10 rounded-sm"
            >
              <Link to="/gallery">
                View All Photos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryPreview.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative group overflow-hidden rounded-sm"
              >
                <img
                  src={img}
                  alt={`Gallery preview ${idx + 1}`}
                  data-testid={`gallery-preview-${idx}`}
                  className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#1C2522]/0 group-hover:bg-[#1C2522]/40 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-[#7A2E35] rounded-sm p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0v40M0 20h40' stroke='%23fff' fill='none' stroke-width='1'/%3E%3C/svg%3E\")" }} />
            </div>
            <div className="relative z-10">
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#F8F5F0] leading-tight">
                Ready to Join Our Community?
              </h2>
              <p className="text-[#F8F5F0]/80 text-lg mt-4 max-w-xl mx-auto">
                Connect with Catholic professionals who share your values and commitment to excellence.
              </p>
              <Button
                asChild
                data-testid="bottom-cta"
                className="bg-[#F8F5F0] text-[#7A2E35] hover:bg-[#EAE5DC] mt-8 px-8 py-6 rounded-sm text-base font-medium"
              >
                <Link to="/contact">
                  Get Started Today
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

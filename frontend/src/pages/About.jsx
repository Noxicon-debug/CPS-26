import { motion } from 'framer-motion';
import { Target, Eye, Heart, Shield } from 'lucide-react';

const leadershipImages = [
  '/images/Highlights/AG8A2619.jpg',
  '/images/Highlights/AG8A2620.jpg',
  '/images/Highlights/AG8A2621.jpg',
  '/images/Highlights/AG8A2622.jpg',
];

export const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Faith',
      description: 'Grounded in Catholic teachings, we live our faith through our professional lives.',
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We uphold the highest ethical standards in all our professional dealings.',
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in our work as a form of service to God.',
    },
    {
      icon: Eye,
      title: 'Service',
      description: 'We are called to serve our communities and the nation of Papua New Guinea.',
    },
  ];

  return (
    <div data-testid="about-page" className="pt-20">
      {/* Hero */}
      <section className="py-24 md:py-32 bg-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                About Us
              </span>
              <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl tracking-tighter font-medium text-[#1C2522] leading-tight mt-4">
                Our Story
              </h1>
              <p className="text-lg leading-relaxed text-[#4A5D54] mt-6">
                The Catholic Professionals Society of Papua New Guinea was established to create a vibrant community of Catholic professionals dedicated to integrating faith with professional excellence.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src="/images/Highlights/AG8A2637.jpg"
                alt="Community gathering"
                data-testid="about-hero-image"
                className="w-full h-[400px] object-cover rounded-sm"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#1C2522] p-10 rounded-sm"
            >
              <div className="w-12 h-12 bg-[#C29B57] rounded-sm flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#1C2522]" />
              </div>
              <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#F8F5F0] mb-4">
                Our Mission
              </h2>
              <p className="text-[#F8F5F0]/80 leading-relaxed">
                To unite Catholic professionals in Papua New Guinea, fostering a community that promotes Christian values in the workplace, provides networking opportunities, and encourages service to the Church and society.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#7A2E35] p-10 rounded-sm"
            >
              <div className="w-12 h-12 bg-[#F8F5F0] rounded-sm flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-[#7A2E35]" />
              </div>
              <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#F8F5F0] mb-4">
                Our Vision
              </h2>
              <p className="text-[#F8F5F0]/80 leading-relaxed">
                To be a leading voice for Catholic professionals in Papua New Guinea, inspiring excellence, integrity, and service across all sectors of society while contributing to the nation's development.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
              Our Values
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#1C2522] leading-tight mt-4">
              What Guides Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                data-testid={`value-card-${idx}`}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#C29B57]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-[#C29B57]" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1C2522] mb-3">
                  {value.title}
                </h3>
                <p className="text-[#4A5D54] leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
              Leadership
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#1C2522] leading-tight mt-4">
              Our Team
            </h2>
            <p className="text-[#4A5D54] mt-4">
              Dedicated professionals leading our community forward.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {leadershipImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                data-testid={`leader-card-${idx}`}
                className="text-center"
              >
                <div className="relative overflow-hidden rounded-sm mb-4">
                  <img
                    src={img}
                    alt={`Leadership member ${idx + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <h4 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1C2522]">
                  Executive Member
                </h4>
                <p className="text-[#4A5D54] text-sm">
                  Leadership Team
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-24 md:py-32 bg-[#1C2522]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/images/Highlights/AG8A2638.jpg"
                alt="Historical moment"
                data-testid="history-image"
                className="w-full h-[500px] object-cover rounded-sm"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                Our History
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#F8F5F0] leading-tight mt-4">
                A Journey of Faith & Service
              </h2>
              <p className="text-[#F8F5F0]/80 leading-relaxed mt-6">
                The Catholic Professionals Society of Papua New Guinea began as a small gathering of like-minded professionals seeking to deepen their faith while excelling in their careers. What started as informal meetings has grown into a vibrant organization impacting communities across the nation.
              </p>
              <p className="text-[#F8F5F0]/80 leading-relaxed mt-4">
                Today, we continue to grow, welcoming new members who share our vision of integrating Catholic values with professional excellence. Our events, formations, and community service initiatives touch lives throughout Papua New Guinea.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

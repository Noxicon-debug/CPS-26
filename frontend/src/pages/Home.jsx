import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Heart, Landmark, Target, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { BrandLogo } from '../components/BrandLogo';
import { cpsProfile } from '../content/cpsProfile';

const heroImages = [
  '/images/Highlights/AG8A2573.jpg',
  '/images/Highlights/AG8A2604.jpg',
  '/images/Highlights/AG8A2614.jpg'
];

const galleryPreview = [
  '/images/Highlights/AG8A2576.jpg',
  '/images/Highlights/AG8A2591.jpg',
  '/images/Highlights/AG8A2597.jpg',
  '/images/Highlights/AG8A2610.jpg',
  '/images/Highlights/AG8A2618.jpg',
  '/images/Highlights/AG8A2626.jpg'
];

const previewSections = [
  {
    icon: Target,
    title: 'Vision',
    description: cpsProfile.vision.statement
  },
  {
    icon: Heart,
    title: 'Mission',
    description: cpsProfile.mission.commitments[0]
  },
  {
    icon: Users,
    title: 'Membership',
    description: `The Society recognizes ${cpsProfile.membershipCategories.length} categories of membership for Catholic professionals, students, affiliate groups, and distinguished witnesses.`
  },
  {
    icon: Landmark,
    title: 'Governance',
    description: cpsProfile.governance.structure[0]
  }
];

const quickFacts = [
  {
    label: 'First Formal Gathering',
    value: cpsProfile.foundingGatheringDate
  },
  {
    label: 'Approved by CBC PNGSI',
    value: cpsProfile.approvalYear
  },
  {
    label: 'Spiritual Patron',
    value: cpsProfile.spiritualPatron
  }
];

export const Home = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div data-testid="home-page">
      <section className="min-h-screen pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(194,155,87,0.16),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(122,46,53,0.12),_transparent_35%)]" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <BrandLogo showText={false} size="lg" className="mb-6" />
              <span className="text-xs uppercase tracking-[0.24em] font-bold text-[#C29B57]">
                {cpsProfile.overview.heroTag}
              </span>
              <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl lg:text-7xl tracking-tighter font-medium text-[#1C2522] leading-tight mt-4 max-w-3xl">
                Catholic Professionals Society
                <span className="block text-[#7A2E35]">of Papua New Guinea</span>
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-[#4A5D54] mt-6 max-w-2xl">
                {cpsProfile.overview.paragraphs[0]}
              </p>
              <p className="text-base md:text-lg leading-relaxed text-[#4A5D54] mt-4 max-w-2xl">
                {cpsProfile.overview.paragraphs[1]}
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Button
                  asChild
                  data-testid="hero-cta-primary"
                  className="bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] px-8 py-6 rounded-sm text-base font-medium"
                >
                  <Link to="/about">
                    Read Full Profile
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  data-testid="hero-cta-secondary"
                  className="border-[#1C2522]/20 text-[#1C2522] hover:bg-[#EAE5DC] px-8 py-6 rounded-sm text-base font-medium"
                >
                  <Link to="/contact">Join Our Community</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                {cpsProfile.overview.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="inline-flex items-center rounded-full border border-[#1C2522]/10 bg-white/70 px-4 py-2 text-sm text-[#4A5D54] backdrop-blur"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="col-span-2 relative overflow-hidden rounded-sm shadow-xl">
                <img
                  src={heroImages[currentHeroImage]}
                  alt="Catholic professionals gathering"
                  data-testid="hero-image-primary"
                  className="w-full h-[430px] md:h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C2522]/55 via-[#1C2522]/10 to-transparent" />
                <div className="absolute left-6 bottom-6 right-6 rounded-sm bg-[#F8F5F0]/92 p-5 backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.22em] font-bold text-[#C29B57]">
                    Profile Snapshot
                  </div>
                  <p className="mt-3 text-[#1C2522] leading-relaxed">
                    Rooted in Catholic faith, the Society brings professionals and groups together to know, live, defend, and grow that faith through service.
                  </p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-sm">
                <img
                  src="/images/Highlights/AG8A2627.jpg"
                  alt="Community fellowship"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="bg-[#1C2522] text-[#F8F5F0] rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-[#C29B57] font-bold">
                    Approved
                  </div>
                  <div className="font-['Cormorant_Garamond'] text-4xl mt-3 leading-none">
                    {cpsProfile.approvalYear}
                  </div>
                </div>
                <p className="text-sm text-[#F8F5F0]/80 leading-relaxed mt-4">
                  Guided by a Constitution, Rule of Life, and the witness of {cpsProfile.spiritualPatron}.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                Profile At A Glance
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#1C2522] leading-tight mt-4">
                A Catholic professional body shaped by faith, formation, and public witness
              </h2>
              <div className="space-y-4 mt-6">
                {cpsProfile.overview.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base md:text-lg leading-relaxed text-[#4A5D54]">
                    {paragraph}
                  </p>
                ))}
              </div>
              <Button
                asChild
                data-testid="about-cta"
                className="bg-[#7A2E35] text-[#F8F5F0] hover:bg-[#5a222a] mt-8 px-6 rounded-sm"
              >
                <Link to="/about">
                  Explore the Full Profile
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickFacts.map((fact) => (
                <Card key={fact.label} className="border-[#1C2522]/10 shadow-none rounded-sm p-6 bg-[#F8F5F0]">
                  <CalendarDays className="w-8 h-8 text-[#C29B57]" />
                  <div className="mt-5 text-xs uppercase tracking-[0.2em] font-bold text-[#7A2E35]">
                    {fact.label}
                  </div>
                  <div className="font-['Cormorant_Garamond'] text-2xl text-[#1C2522] mt-2 leading-tight">
                    {fact.value}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
              What The Profile Covers
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#1C2522] leading-tight mt-4">
              Vision, mission, belonging, and governance in one place
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewSections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#F8F5F0] border border-[#1C2522]/10 rounded-sm p-8 h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-[#C29B57]/10 rounded-sm flex items-center justify-center mb-6">
                    <section.icon className="w-6 h-6 text-[#C29B57]" />
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1C2522] mb-3">
                    {section.title}
                  </h3>
                  <p className="text-[#4A5D54] text-sm leading-relaxed">
                    {section.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#1C2522]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <img
                src="/images/Highlights/AG8A2638.jpg"
                alt="Historical society gathering"
                className="w-full h-[460px] object-cover rounded-sm"
              />
              <div className="absolute -bottom-6 -right-6 bg-[#F8F5F0] text-[#1C2522] p-6 rounded-sm max-w-xs shadow-lg">
                <div className="text-xs uppercase tracking-[0.22em] font-bold text-[#C29B57]">
                  Founding Working Committee
                </div>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#4A5D54]">
                  {cpsProfile.background.workingCommittee.slice(0, 4).map((member) => (
                    <li key={member}>{member}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                Our Background
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#F8F5F0] leading-tight mt-4">
                From a Port Moresby gathering to a national Catholic professional society
              </h2>
              <div className="space-y-4 mt-6">
                {cpsProfile.background.paragraphs.slice(0, 3).map((paragraph) => (
                  <p key={paragraph} className="text-[#F8F5F0]/80 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <Button
                asChild
                variant="outline"
                data-testid="history-cta"
                className="border-[#F8F5F0]/20 text-[#F8F5F0] hover:bg-[#F8F5F0]/10 mt-8 rounded-sm"
              >
                <Link to="/about">
                  Continue Reading
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#1C2522] border-t border-[#F8F5F0]/10">
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
                key={img}
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

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-[#7A2E35] rounded-sm p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0v40M0 20h40' stroke='%23fff' fill='none' stroke-width='1'/%3E%3C/svg%3E\")" }} />
            </div>
            <div className="relative z-10">
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#F8F5F0] leading-tight">
                Ready to journey with Catholic professionals across PNG?
              </h2>
              <p className="text-[#F8F5F0]/80 text-lg mt-4 max-w-2xl mx-auto">
                Learn the Society's full vision and mission, then reach out if you would like to participate, affiliate, or grow with the community.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button
                  asChild
                  data-testid="bottom-cta-about"
                  className="bg-[#F8F5F0] text-[#7A2E35] hover:bg-[#EAE5DC] px-8 py-6 rounded-sm text-base font-medium"
                >
                  <Link to="/about">
                    View Full Profile
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  data-testid="bottom-cta-contact"
                  className="border-[#F8F5F0]/25 text-[#F8F5F0] hover:bg-[#F8F5F0]/10 px-8 py-6 rounded-sm text-base font-medium"
                >
                  <Link to="/contact">Contact the Society</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

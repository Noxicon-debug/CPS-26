import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, FileText, Heart, Landmark, Target, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { BrandLogo } from '../components/BrandLogo';
import { cpsProfile } from '../content/cpsProfile';

const overviewCards = [
  {
    icon: FileText,
    label: 'Approved',
    value: `CBC PNGSI ${cpsProfile.approvalYear}`
  },
  {
    icon: Users,
    label: 'Membership Categories',
    value: `${cpsProfile.membershipCategories.length} pathways of belonging`
  },
  {
    icon: Heart,
    label: 'Spiritual Patron',
    value: cpsProfile.spiritualPatron
  }
];

export const About = () => {
  return (
    <div data-testid="about-page" className="pt-20">
      <section className="py-24 md:py-32 bg-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <BrandLogo showText={false} size="lg" className="mb-6" />
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                Full Society Profile
              </span>
              <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl tracking-tighter font-medium text-[#1C2522] leading-tight mt-4">
                Catholic Professionals Society of Papua New Guinea
              </h1>
              <div className="space-y-4 mt-6">
                {cpsProfile.overview.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-relaxed text-[#4A5D54]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src="/images/Highlights/AG8A2637.jpg"
                alt="Catholic professionals community gathering"
                data-testid="about-hero-image"
                className="w-full h-[420px] md:h-[500px] object-cover rounded-sm shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-start">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                Overview
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#1C2522] leading-tight mt-4">
                A society of lay Catholics bringing faith into every profession
              </h2>
              <div className="space-y-4 mt-6">
                {cpsProfile.overview.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[#4A5D54] leading-relaxed text-base md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4">
              {overviewCards.map((card) => (
                <Card key={card.label} className="rounded-sm border-[#1C2522]/10 shadow-none p-6">
                  <card.icon className="w-8 h-8 text-[#C29B57]" />
                  <div className="mt-5 text-xs uppercase tracking-[0.2em] font-bold text-[#7A2E35]">
                    {card.label}
                  </div>
                  <div className="font-['Cormorant_Garamond'] text-2xl text-[#1C2522] mt-2 leading-tight">
                    {card.value}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#1C2522]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-20 items-start">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                Background
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#F8F5F0] leading-tight mt-4">
                The history behind the Society's formation
              </h2>
              <div className="space-y-5 mt-6">
                {cpsProfile.background.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[#F8F5F0]/80 leading-relaxed text-base md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Card className="rounded-sm border-none bg-[#F8F5F0] p-8 shadow-none">
                <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                  Founding Working Committee
                </div>
                <ul className="mt-5 space-y-3 text-[#4A5D54] leading-relaxed">
                  {cpsProfile.background.workingCommittee.map((member) => (
                    <li key={member} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#7A2E35] mt-0.5 flex-shrink-0" />
                      <span>{member}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <img
                src="/images/Highlights/AG8A2638.jpg"
                alt="Historical Catholic professionals gathering"
                className="w-full h-[320px] object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
              Vision And Mission
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#1C2522] leading-tight mt-4">
              Knowing, living, defending, and growing the Catholic faith together
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#7A2E35] p-10 rounded-sm"
            >
              <div className="w-12 h-12 bg-[#F8F5F0] rounded-sm flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#7A2E35]" />
              </div>
              <h3 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#F8F5F0] mb-4">
                Our Vision
              </h3>
              <p className="text-[#F8F5F0]/90 leading-relaxed text-lg">
                {cpsProfile.vision.statement}
              </p>
              <ul className="mt-6 space-y-3 text-[#F8F5F0]/80 leading-relaxed">
                {cpsProfile.vision.commitments.map((commitment) => (
                  <li key={commitment} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C29B57] mt-0.5 flex-shrink-0" />
                    <span>{commitment}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-[#1C2522] p-10 rounded-sm"
            >
              <div className="w-12 h-12 bg-[#C29B57] rounded-sm flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-[#1C2522]" />
              </div>
              <h3 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#F8F5F0] mb-4">
                Our Mission
              </h3>
              <p className="text-[#F8F5F0]/90 leading-relaxed text-lg">
                {cpsProfile.mission.statement}
              </p>
              <ul className="mt-6 space-y-3 text-[#F8F5F0]/80 leading-relaxed">
                {cpsProfile.mission.commitments.map((commitment) => (
                  <li key={commitment} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C29B57] mt-0.5 flex-shrink-0" />
                    <span>{commitment}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
              Core Values
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#1C2522] leading-tight mt-4">
              The convictions that shape our witness and service
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cpsProfile.coreValues.map((value, idx) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full rounded-sm border-[#1C2522]/10 bg-[#F8F5F0] p-7 shadow-none">
                  <CheckCircle2 className="w-7 h-7 text-[#7A2E35]" />
                  <p className="mt-5 text-[#1C2522] leading-relaxed text-base md:text-lg">
                    {value}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
              Membership
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#1C2522] leading-tight mt-4">
              Six ways Catholics participate in the Society
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cpsProfile.membershipCategories.map((category, idx) => (
              <motion.div
                key={category.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
              >
                <Card className="h-full rounded-sm border-[#1C2522]/10 p-8 shadow-none">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-sm bg-[#1C2522] text-[#F8F5F0] flex items-center justify-center font-['Cormorant_Garamond'] text-2xl uppercase">
                      {category.code}
                    </div>
                    <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1C2522] leading-tight">
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-[#4A5D54] leading-relaxed">
                    {category.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#1C2522]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                Governance And Spiritual Leadership
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-[#F8F5F0] leading-tight mt-4">
                Structured for service, guided by pastoral care
              </h2>
              <div className="space-y-4 mt-6">
                {cpsProfile.governance.structure.map((paragraph) => (
                  <p key={paragraph} className="text-[#F8F5F0]/80 leading-relaxed text-base md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-8 space-y-3">
                {cpsProfile.governance.constitutionNotes.map((note) => (
                  <div key={note} className="flex items-start gap-3 text-[#F8F5F0]/80 leading-relaxed">
                    <FileText className="w-5 h-5 text-[#C29B57] mt-0.5 flex-shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              {cpsProfile.governance.spiritualLeadership.map((leader, idx) => (
                <motion.div
                  key={leader.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Card className="rounded-sm border-none bg-[#F8F5F0] p-8 shadow-none">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-sm bg-[#C29B57]/15 flex items-center justify-center flex-shrink-0">
                        <Landmark className="w-6 h-6 text-[#7A2E35]" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                          {leader.period}
                        </div>
                        <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1C2522] mt-2">
                          {leader.name}
                        </h3>
                        <p className="text-[#4A5D54] leading-relaxed mt-3">
                          {leader.detail}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-[#7A2E35] rounded-sm p-12 md:p-16 text-center text-[#F8F5F0]">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium leading-tight">
                Continue the conversation with the Society
              </h2>
              <p className="text-[#F8F5F0]/80 text-lg mt-4 leading-relaxed">
                If this profile resonates with your vocation, profession, or apostolate, the next step is simple: get in touch and connect with the wider Catholic professional community.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button
                  asChild
                  className="bg-[#F8F5F0] text-[#7A2E35] hover:bg-[#EAE5DC] px-8 py-6 rounded-sm text-base font-medium"
                >
                  <Link to="/contact">
                    Contact The Society
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#F8F5F0]/25 text-[#F8F5F0] hover:bg-[#F8F5F0]/10 px-8 py-6 rounded-sm text-base font-medium"
                >
                  <Link to="/">Return Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

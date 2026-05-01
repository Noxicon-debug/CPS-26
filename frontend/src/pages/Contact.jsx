import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import { cpsContact } from '../content/cpsContact';

const API = process.env.REACT_APP_BACKEND_URL
  ? `${process.env.REACT_APP_BACKEND_URL}/api`
  : null;

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!API) {
        throw new Error('Contact form preview mode');
      }
      await axios.post(`${API}/contact`, formData);
      setIsSubmitted(true);
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      if (!API) {
        toast.info(`Preview mode: please email ${cpsContact.footer.email} or call ${cpsContact.footer.phone}.`);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: cpsContact.addressLines.map((value) => ({ value })),
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: cpsContact.emails,
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: cpsContact.phones,
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: cpsContact.officeHours.map((value) => ({ value })),
    },
  ];

  return (
    <div data-testid="contact-page" className="pt-20">
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
              Get In Touch
            </span>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl tracking-tighter font-medium text-[#1C2522] leading-tight mt-4">
              Contact Us
            </h1>
            <p className="text-lg text-[#4A5D54] mt-4 max-w-2xl mx-auto">
              Reach out to learn more about our community, membership, and upcoming programs across Papua New Guinea.
            </p>
            <p className="text-sm text-[#4A5D54] mt-3 max-w-2xl mx-auto">
              {cpsContact.supportNote}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-['Cormorant_Garamond'] text-3xl font-medium text-[#1C2522] mb-8">
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#EAE5DC] p-12 rounded-sm text-center"
                >
                  <CheckCircle className="w-16 h-16 text-[#7A2E35] mx-auto mb-6" />
                  <h3 className="font-['Cormorant_Garamond'] text-2xl font-medium text-[#1C2522] mb-4">
                    Message Sent!
                  </h3>
                  <p className="text-[#4A5D54]">
                    Thank you for reaching out. We'll get back to you within 1-2 business days.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] rounded-sm"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#1C2522] font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        data-testid="contact-name"
                        className="bg-transparent border-0 border-b border-[#1C2522]/20 rounded-none px-0 py-3 focus:border-[#C29B57] focus:ring-0 outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#1C2522] font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        data-testid="contact-email"
                        className="bg-transparent border-0 border-b border-[#1C2522]/20 rounded-none px-0 py-3 focus:border-[#C29B57] focus:ring-0 outline-none transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#1C2522] font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        data-testid="contact-phone"
                        className="bg-transparent border-0 border-b border-[#1C2522]/20 rounded-none px-0 py-3 focus:border-[#C29B57] focus:ring-0 outline-none transition-colors"
                        placeholder="e.g. +675 7123 4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-[#1C2522] font-medium">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        data-testid="contact-subject"
                        className="bg-transparent border-0 border-b border-[#1C2522]/20 rounded-none px-0 py-3 focus:border-[#C29B57] focus:ring-0 outline-none transition-colors"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#1C2522] font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      data-testid="contact-message"
                      className="bg-transparent border-0 border-b border-[#1C2522]/20 rounded-none px-0 py-3 focus:border-[#C29B57] focus:ring-0 outline-none transition-colors min-h-[150px] resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="contact-submit-button"
                    className="bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] px-8 py-6 rounded-sm w-full md:w-auto disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="font-['Cormorant_Garamond'] text-3xl font-medium text-[#1C2522] mb-8">
                Contact Information
              </h2>

              <div className="space-y-8">
                {contactInfo.map((info, idx) => (
                  <div
                    key={info.title}
                    data-testid={`contact-info-${idx}`}
                    className="flex items-start gap-5"
                  >
                    <div className="w-12 h-12 bg-[#C29B57]/10 rounded-sm flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-[#C29B57]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1C2522] mb-1">
                        {info.title}
                      </h3>
                      {info.details.map((detail, i) => (
                        detail.href ? (
                          <a
                            key={`${info.title}-${i}`}
                            href={detail.href}
                            className="block text-[#4A5D54] hover:text-[#C29B57] transition-colors"
                          >
                            {detail.label ? `${detail.label}: ` : ''}
                            {detail.value}
                          </a>
                        ) : (
                          <p key={`${info.title}-${i}`} className="text-[#4A5D54]">
                            {detail.value}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-12 relative h-64 bg-[#EAE5DC] rounded-sm overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-[#C29B57] mx-auto mb-4" />
                    <p className="text-[#4A5D54]">{cpsContact.addressLines[0]}</p>
                    <p className="text-[#4A5D54]">{cpsContact.addressLines[1]}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ / Join CTA */}
      <section className="py-16 md:py-24 bg-[#1C2522]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C29B57]">
                Join Our Community
              </span>
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-medium text-[#F8F5F0] leading-tight mt-4">
                Become a Member Today
              </h2>
              <p className="text-[#F8F5F0]/80 mt-4 leading-relaxed">
                Connect with like-minded Catholic professionals, access exclusive events, and grow in both faith and career. Membership is open to all Catholic professionals in Papua New Guinea.
              </p>
              <ul className="mt-6 space-y-3">
                {['Networking opportunities', 'Spiritual formation programs', 'Professional development workshops', 'Community service initiatives'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-[#F8F5F0]/80">
                    <CheckCircle className="w-5 h-5 text-[#C29B57]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#7A2E35] p-8 md:p-10 rounded-sm">
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-medium text-[#F8F5F0] mb-6">
                Quick Membership Inquiry
              </h3>
              <form className="space-y-4">
                <Input
                  type="text"
                  placeholder="Your Name"
                  data-testid="membership-name"
                  className="bg-[#F8F5F0]/10 border-0 text-[#F8F5F0] placeholder:text-[#F8F5F0]/50 rounded-sm"
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  data-testid="membership-email"
                  className="bg-[#F8F5F0]/10 border-0 text-[#F8F5F0] placeholder:text-[#F8F5F0]/50 rounded-sm"
                />
                <Input
                  type="text"
                  placeholder="Your Profession"
                  data-testid="membership-profession"
                  className="bg-[#F8F5F0]/10 border-0 text-[#F8F5F0] placeholder:text-[#F8F5F0]/50 rounded-sm"
                />
                <Button
                  type="submit"
                  data-testid="membership-submit"
                  className="w-full bg-[#F8F5F0] text-[#7A2E35] hover:bg-[#EAE5DC] rounded-sm font-medium"
                >
                  Request Membership Info
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

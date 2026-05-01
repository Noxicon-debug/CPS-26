import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Facebook, Twitter } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { cpsContact } from '../content/cpsContact';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer data-testid="footer" className="bg-[#1C2522] text-[#F8F5F0]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <BrandLogo
              inverted
              size="sm"
              title="Catholic Professionals Society"
              subtitle="Papua New Guinea"
              className="mb-6"
            />
            <p className="text-[#F8F5F0]/70 text-sm leading-relaxed">
              Uniting Catholic professionals across Papua New Guinea to witness faith, serve society, and grow together in excellence.
            </p>
          </div>

          <div>
            <h4 className="font-['Cormorant_Garamond'] text-lg font-semibold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['About', 'Gallery', 'Events', 'News', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-[#F8F5F0]/70 hover:text-[#C29B57] transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-['Cormorant_Garamond'] text-lg font-semibold mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C29B57] mt-0.5 flex-shrink-0" />
                <span className="text-[#F8F5F0]/70 text-sm">
                  {cpsContact.footer.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#C29B57] flex-shrink-0" />
                <a
                  href={`mailto:${cpsContact.footer.email}`}
                  className="text-[#F8F5F0]/70 hover:text-[#C29B57] transition-colors text-sm"
                >
                  {cpsContact.footer.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#C29B57] flex-shrink-0" />
                <a
                  href={cpsContact.phones[0].href}
                  className="text-[#F8F5F0]/70 hover:text-[#C29B57] transition-colors text-sm"
                >
                  {cpsContact.footer.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-['Cormorant_Garamond'] text-lg font-semibold mb-6">
              Follow Us
            </h4>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                data-testid="social-facebook"
                className="w-10 h-10 rounded-sm bg-[#F8F5F0]/10 flex items-center justify-center hover:bg-[#C29B57] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                data-testid="social-twitter"
                className="w-10 h-10 rounded-sm bg-[#F8F5F0]/10 flex items-center justify-center hover:bg-[#C29B57] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-[#F8F5F0]/50 text-xs">
              Stay connected with our community and receive updates on events, formation, and Society news.
            </p>
          </div>
        </div>

        <div className="border-t border-[#F8F5F0]/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#F8F5F0]/50 text-sm">
            &copy; {currentYear} Catholic Professionals Society PNG. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-[#F8F5F0]/50 hover:text-[#C29B57] text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[#F8F5F0]/50 hover:text-[#C29B57] text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

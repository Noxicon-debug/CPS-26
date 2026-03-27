import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cross } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Events', path: '/events' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-xl bg-[#F8F5F0]/90 border-b border-[#1C2522]/10 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            data-testid="nav-logo"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-[#7A2E35] rounded-sm flex items-center justify-center">
              <Cross className="w-5 h-5 text-[#F8F5F0]" />
            </div>
            <div className="hidden sm:block">
              <span className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522] tracking-tight">
                Catholic Professionals
              </span>
              <span className="block text-xs uppercase tracking-[0.2em] text-[#C29B57] font-bold">
                Papua New Guinea
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.name.toLowerCase()}`}
                className={`text-sm font-medium transition-colors relative ${
                  isActive(link.path)
                    ? 'text-[#7A2E35]'
                    : 'text-[#4A5D54] hover:text-[#1C2522]'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C29B57]"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              asChild
              data-testid="nav-join-button"
              className="bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] px-6 rounded-sm font-medium"
            >
              <Link to="/contact">Join Us</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-button"
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#1C2522]" />
            ) : (
              <Menu className="w-6 h-6 text-[#1C2522]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#F8F5F0] border-t border-[#1C2522]/10"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`mobile-nav-${link.name.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-lg font-medium py-2 ${
                    isActive(link.path)
                      ? 'text-[#7A2E35]'
                      : 'text-[#4A5D54]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Button
                asChild
                data-testid="mobile-join-button"
                className="w-full bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] mt-4 rounded-sm"
              >
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  Join Us
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

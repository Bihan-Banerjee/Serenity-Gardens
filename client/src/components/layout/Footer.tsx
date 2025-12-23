import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="font-serif text-xl font-bold">Serenity Gardens</span>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Experience the tranquility of nature at our beautiful garden sanctuary. 
              A perfect escape from the everyday hustle.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="font-serif text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Gallery', 'Explore', 'Shop'].map((link) => (
                <li key={link}>
                  <Link 
                    to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="text-muted text-sm hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-serif text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Garden Lane, Serenity Valley, Nature State 12345</span>
              </li>
              <li className="flex items-center gap-3 text-muted text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-muted text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hello@serenitygardens.com</span>
              </li>
            </ul>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-serif text-lg font-semibold">Opening Hours</h4>
            <ul className="space-y-2 text-muted text-sm">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>11:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-muted text-sm">
          <p>© {new Date().getFullYear()} Serenity Gardens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

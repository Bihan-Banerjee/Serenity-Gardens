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
              Discover the beauty of nature and tranquility in our serene gardens. Explore, relax, and rejuvenate your senses in a peaceful environment.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/serenity__gardens?igsh=MWZrN2t0YW1naHRjYg==" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61585491844132" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://x.com/SerenityTematha" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-foreground transition-colors">
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
                <span>Chakbaria, Baruipur, West Bengal 743330, India</span>
              </li>
              <li className="flex items-center gap-3 text-muted text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 9830414950 | +91 9830020452</span>
              </li>
              <li className="flex items-center gap-3 text-muted text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>bihanbanerjee04@gmail.com</span>
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
                <span>8:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>9:00 AM - 6:00 PM</span>
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

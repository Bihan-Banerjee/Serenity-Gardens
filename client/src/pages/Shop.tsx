import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, ShieldCheck, LogIn } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';

const shopOptions = [
  {
    title: 'Sign In',
    description: 'Already have an account? Sign in to access your orders and wishlist.',
    icon: LogIn,
    href: '/login',
    variant: 'default' as const,
  },
  {
    title: 'Create Account',
    description: 'New to Serenity Gardens? Create an account to start shopping.',
    icon: User,
    href: '/register',
    variant: 'outline' as const,
  },
  {
    title: 'Admin Portal',
    description: 'Staff access only. Manage inventory and orders.',
    icon: ShieldCheck,
    href: '/admin/login',
    variant: 'secondary' as const,
  },
];

const Shop = () => {
  return (
    <Layout>
      <section className="py-20 px-4 min-h-[80vh] flex items-center">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Shop
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
              Welcome to Our Store
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Choose how you'd like to continue. Sign in to browse our beautiful collection
              of plants and garden accessories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {shopOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={option.href}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-card border border-border rounded-2xl p-8 text-center h-full hover:border-primary/50 hover:shadow-lg transition-all"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <option.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      {option.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      {option.description}
                    </p>
                    <Button variant={option.variant} className="w-full">
                      {option.title}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              Want to browse first?{' '}
              <Link to="/menu" className="text-primary hover:underline font-medium">
                View our menu
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;

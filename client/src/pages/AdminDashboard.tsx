import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Shield, Package, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) {
      toast.error('Admin access required');
      navigate('/admin/login');
    }
    setLoading(false);
  }, [user, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage inventory, orders, and operations for Serenity Gardens
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/admin/items" className="group">
              <div className="bg-card border border-border rounded-xl p-8 h-full hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors">
                  <ShoppingBag className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4 text-center">Item Manager</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Add, edit, finalize, and manage inventory stock levels
                </p>
              </div>
            </Link>

            <Link to="/admin/orders" className="group">
              <div className="bg-card border border-border rounded-xl p-8 h-full hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4 text-center">Order Manager</h3>
                <p className="text-muted-foreground text-center mb-6">
                  View all orders, mark as paid, and manage customer orders
                </p>
              </div>
            </Link>

            <div className="group">
              <div className="bg-card border border-border rounded-xl p-8 h-full hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 group-hover:bg-destructive/20 flex items-center justify-center transition-colors">
                  <Shield className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4 text-center">User Management</h3>
                <p className="text-muted-foreground text-center mb-6 opacity-50">
                  Coming soon...
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/menu">← Back to Store</Link>
            </Button>
            <Button variant="destructive" size="lg" onClick={logout} className="w-full sm:w-auto">
              Sign Out
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;

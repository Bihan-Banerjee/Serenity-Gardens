"use client";

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/hooks/useAuthStore';
import api from '@/lib/axiosConfig';
import toast from 'react-hot-toast';
import { Package, User, DollarSign, Trash2, CheckCircle } from 'lucide-react';

interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price?: number;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

interface Order {
  _id: string;
  paid: boolean;
  userId: UserInfo | null;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error('Session expired. Please log in again.');
        logout();
      } else {
        toast.error('Error fetching orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await api.patch(`/orders/${id}`, { paid: true });
      toast.success('Order marked as paid!');
      fetchOrders();
    } catch (err: any) {
      toast.error('Error marking as paid');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (err: any) {
      toast.error('Error deleting order');
    }
  };

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading orders...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Order Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage all customer orders and payment status
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
            {orders.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">No Orders Found</h3>
                <p className="text-muted-foreground mb-6">No orders to manage at the moment.</p>
                <Button onClick={fetchOrders} variant="outline">
                  Refresh
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">Order ID</th>
                      <th className="text-left p-4 font-semibold text-foreground">Customer</th>
                      <th className="text-left p-4 font-semibold text-foreground">Date</th>
                      <th className="text-left p-4 font-semibold text-foreground">Total</th>
                      <th className="text-left p-4 font-semibold text-foreground">Status</th>
                      <th className="text-left p-4 font-semibold text-foreground">Items</th>
                      <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-t border-border hover:bg-muted/50">
                        <td className="p-4 font-mono text-sm text-foreground/80">
                          {order._id.slice(-8)}
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-foreground">
                              {order.userId?.name || 'Guest'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.userId?.email || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-mono font-semibold text-lg text-foreground">
                          ₹{order.totalAmount.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={order.paid ? "default" : "secondary"}
                            className={order.paid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}
                          >
                            {order.paid ? 'Paid' : 'Pending'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="text-sm truncate text-foreground/80">
                                {item.name} × {item.quantity}
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{order.items.length - 3} more
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 space-x-2">
                          {!order.paid && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkPaid(order._id)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Paid
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteOrder(order._id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-12 flex gap-4 justify-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/admin/dashboard">← Back to Dashboard</Link>
            </Button>
            <Button onClick={fetchOrders} variant="outline" size="lg">
              Refresh Orders
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OrderManager;

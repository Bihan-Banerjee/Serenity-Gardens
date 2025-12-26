import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/hooks/useAuthStore';
import api from '@/lib/axiosConfig';
import toast from 'react-hot-toast';
import { ShoppingBag, Trash2, CheckCircle, Edit3 } from 'lucide-react';

interface Item {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  finalized?: boolean;
}

const ItemManager = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null as File | null,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStock, setNewStock] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const fetchItems = async () => {
    try {
      const res = await api.get('/items/all');
      setItems(res.data);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error('Admin access required');
        logout();
      } else {
        toast.error('Error fetching items');
      }
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    if (formData.image) formDataToSend.append('image', formData.image);

    try {
      await api.post('/items', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Item added!');
      setFormData({ name: '', description: '', price: '', stock: '', image: null });
      fetchItems();
    } catch (err: any) {
      toast.error('Error adding item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      toast.success('Item deleted!');
      fetchItems();
    } catch (err) {
      toast.error('Error deleting item');
    }
  };

  const handleFinalize = async (id: string) => {
    try {
      await api.patch(`/items/finalize/${id}`);
      toast.success('Item finalized!');
      fetchItems();
    } catch (err) {
      toast.error('Error finalizing item');
    }
  };

  const handleStockUpdate = async (id: string) => {
    try {
      await api.patch(`/items/${id}`, { stock: parseInt(newStock) });
      toast.success('Stock updated!');
      setEditingId(null);
      fetchItems();
    } catch (err) {
      toast.error('Error updating stock');
    }
  };

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchItems();
  }, [user, navigate]);

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Item Management
              </h1>
              <p className="text-muted-foreground mt-1">Manage inventory and product catalog</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Add Item Form */}
            <div className="lg:col-span-1 bg-card border border-border rounded-xl p-8">
              <h3 className="font-serif text-xl font-bold text-foreground mb-6">Add New Item</h3>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Rose Plant"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Beautiful red roses..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="299"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="50"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Add Item
                </Button>
              </form>
            </div>

            {/* Items List */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    Inventory ({items.length} items)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-semibold text-foreground">Image</th>
                        <th className="text-left p-4 font-semibold text-foreground">Name</th>
                        <th className="text-left p-4 font-semibold text-foreground">Price</th>
                        <th className="text-left p-4 font-semibold text-foreground">Stock</th>
                        <th className="text-left p-4 font-semibold text-foreground">Status</th>
                        <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item._id} className="border-t border-border hover:bg-muted/50">
                          <td className="p-4">
                            <img
                              src={item.image || '/placeholder.svg'}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          </td>
                          <td className="p-4 font-medium text-foreground max-w-xs truncate">
                            {item.name}
                          </td>
                          <td className="p-4 font-mono font-semibold text-lg">
                            ₹{item.price}
                          </td>
                          <td className="p-4">
                            {editingId === item._id ? (
                              <div className="flex gap-2 items-center">
                                <Input
                                  type="number"
                                  value={newStock}
                                  onChange={(e) => setNewStock(e.target.value)}
                                  className="w-20 h-10"
                                  size={4}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleStockUpdate(item._id)}
                                  className="h-10"
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <Badge variant={item.stock === 0 ? "destructive" : "default"}>
                                {item.stock}
                              </Badge>
                            )}
                          </td>
                          <td className="p-4">
                            <Badge variant={item.finalized ? "default" : "secondary"}>
                              {item.finalized ? 'Live' : 'Draft'}
                            </Badge>
                          </td>
                          <td className="p-4 space-x-2">
                            {!item.finalized && (
                              <Button
                                size="sm"
                                onClick={() => handleFinalize(item._id)}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Live
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(item._id);
                                setNewStock(item.stock.toString());
                              }}
                            >
                              <Edit3 className="w-4 h-4 mr-1" />
                              Stock
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(item._id)}
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
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4 justify-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/admin/dashboard">← Back to Dashboard</Link>
            </Button>
            <Button onClick={fetchItems} variant="outline" size="lg">
              Refresh Items
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ItemManager;

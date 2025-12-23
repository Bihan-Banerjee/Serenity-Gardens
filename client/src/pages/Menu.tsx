import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/hooks/useCartStore';
import { SkeletonCard } from '@/components/ui/loaders/Loaders';
import api from '@/lib/axiosConfig';
import toast from 'react-hot-toast';

interface Item {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  quantity: number;
  isFinalized: boolean;
}

const Menu = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items/all');
      setItems(response.data.filter((item: Item) => item.isFinalized && item.quantity > 0));
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (item: Item) => {
    addItem({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      availableQuantity: item.quantity,
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">Our Collection</span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">Shop Menu</h1>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No items available at the moment.</p>
              <Button variant="outline" className="mt-4 gap-2" onClick={fetchItems}>
                <RefreshCw className="w-4 h-4" /> Refresh
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-lg"
                >
                  {item.image && (
                    <div className="aspect-square overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-serif text-lg font-semibold text-foreground">{item.name}</h3>
                    {item.description && <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{item.description}</p>}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-primary">₹{item.price}</span>
                      <Button size="sm" className="gap-2" onClick={() => handleAddToCart(item)}>
                        <ShoppingCart className="w-4 h-4" /> Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{item.quantity} in stock</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Menu;

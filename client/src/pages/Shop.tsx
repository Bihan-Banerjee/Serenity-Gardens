import { FocusCards } from "@/components/ui/focus-cards";
const Shop = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-center">Shop</h2>
      </div>
      <section className="w-full min-w-4xl max-w-7xl mx-auto mt-10">
      <FocusCards
        cards={[
          { title: "First time? Register!", src: "register.jpg" },
          { title: "Login and shop!", src: "login.jpg" },
          { title: "Insight about catalogue", src: "robot.png" }
        ]}
      />
    </section>
    </div>
    );
  };
  
  export default Shop;
  
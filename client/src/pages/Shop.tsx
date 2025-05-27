import { FocusCards } from "@/components/ui/focus-cards";
const Shop = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-center">Shop</h2>
      </div>
      <section className="w-full min-w-4xl max-w-7xl mx-auto mt-10">
      <FocusCards
      redirectOnClick={true}
        cards={[
          { title: "First time? Register!", src: "register.jpg", link: "/register" },
          { title: "Login and shop!", src: "login.jpg", link: "/login" },
          { title: "Admin", src: "admin.jpg", link: "/admin" }
        ]}
      />
    </section>
    </div>
    );
  };
  
  export default Shop;
  
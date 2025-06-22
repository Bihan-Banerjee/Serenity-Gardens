import { FocusCards } from "@/components/ui/focus-cards";
import { AuroraText } from "@/components/magicui/aurora-text";
import useIsMobile from "@/hooks/useIsMobile";
const Shop = () => {
  const isMobile = useIsMobile();
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${isMobile ? "px-4 pt-20" : ""}`}>
      <div className={`${isMobile ? "mb-6" : "mt-10"}`}>
        <AuroraText className="text-4xl md:text-6xl font-bold flex items-center justify-center text-center">
          Sign In/Sign Up
        </AuroraText>
      </div>
      <section className={`w-full mx-auto ${isMobile ? "px-2 mt-6" : "min-w-4xl max-w-7xl mt-10"}`}>
      {isMobile ?
        (
        <FocusCards
          redirectOnClick={true}
            cards={[
              { title: "First time? Register!", src: "Sign Up_mobile.png", link: "/register" },
              { title: "Login and shop!", src: "Sign In_mobile.png", link: "/login" },
              { title: "Admin", src: "Admin_mobile.png", link: "/admin" }
            ]}
        />
        ):(
        <FocusCards
          redirectOnClick={true}
            cards={[
              { title: "First time? Register!", src: "Sign Up.png", link: "/register" },
              { title: "Login and shop!", src: "Sign In.png", link: "/login" },
              { title: "Admin", src: "Admin.png", link: "/admin" }
            ]}
          />
        )
      }
      
    </section>
    </div>
    );
  };
  
  export default Shop;
  
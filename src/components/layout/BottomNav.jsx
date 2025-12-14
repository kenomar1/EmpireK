import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const NAV_ITEMS = [
  { to: "/", key: "home", Icon: HomeIcon },
  { to: "/search", key: "search", Icon: MagnifyingGlassIcon },
  { to: "/cart", key: "cart", Icon: ShoppingBagIcon },
  { to: "/profile", key: "profile", Icon: UserIcon },
];

const BottomNav = () => {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // Show nav if scrolling up or near the top
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 100);

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const navItems = NAV_ITEMS.map((item) => ({
    ...item,
    label: t(`bottomNav.${item.key}`),
  }));

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="border-t rounded-tl-3xl rounded-tr-3xl bg-card/80 backdrop-blur-sm">
        <nav className="flex justify-around items-center py-1 px-4 max-w-3xl mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-primary bg-primary/10 scale-110"
                    : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                }`
              }
            >
              <item.Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;

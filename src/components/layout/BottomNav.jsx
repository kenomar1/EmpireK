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
      className={`fixed inset-x-0 bottom-6 z-50 transition-transform duration-500 ease-out px-4 pointer-events-none md:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-lg glass-panel premium-border rounded-full shadow-2xl pointer-events-auto bg-background/30 backdrop-blur-xl overflow-hidden">
        <nav className="flex justify-around items-center py-2 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all duration-500 relative ${
                  isActive
                    ? "text-primary"
                    : "text-foreground/40 hover:text-primary hover:bg-primary/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.Icon className={`h-6 w-6 transition-transform duration-500 ${isActive ? "scale-110" : ""}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-x-2 -bottom-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;

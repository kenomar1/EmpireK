"use client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "react-hot-toast";

// Lazy load route components
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/services"));
const ServiceGalleryPage = lazy(() => import("./pages/ServiceGalleryPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Blog = lazy(() => import("./pages/blogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard")); // Admin Dashboard

import { FixedNavbar } from "./components/layout/NavBar";
import { useTheme } from "./context/ThemeContext";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Lazy load heavy 3D components
const ShaderGradientCanvas = lazy(() =>
  import("@shadergradient/react").then((mod) => ({
    default: mod.ShaderGradientCanvas,
  }))
);
const ShaderGradient = lazy(() =>
  import("@shadergradient/react").then((mod) => ({
    default: mod.ShaderGradient,
  }))
);

const darkUrl =
  "https://shadergradient.co/customize?animate=on&axesHelper=off&brightness=1&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%231a002b&color2=%237e3ac2&color3=%235e5b42&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false";

const lightUrl =
  "https://shadergradient.co/customize?animate=on&axesHelper=off&brightness=1&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23fffcfc&color2=%238959cb&color3=%23ffffff&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false";

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function AppContent() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const location = useLocation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [isRTL, i18n.language, location.pathname]);

  const backgroundUrl = theme === "dark" ? darkUrl : lightUrl;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Global Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
          <ShaderGradientCanvas className="absolute inset-0">
            <ShaderGradient control="query" urlString={backgroundUrl} key={theme} />
          </ShaderGradientCanvas>
        </Suspense>
      </div>

      {/* Global Backdrop Blur & Tint Overlay */}
      <div className="fixed inset-0 -z-10 backdrop-blur-sm bg-background/30 pointer-events-none" />

      <FixedNavbar />

      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/gallery" element={<ServiceGalleryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/project/:slug" element={<ProjectDetailPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          },
        }}
      />
    </div>
  );
}
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
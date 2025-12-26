import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { FixedNavbar } from "./components/layout/NavBar";
import i18n from "./i18n/config";
import ServiceGalleryPage from "./pages/ServiceGalleryPage";
import ContactPage from "./pages/ContactPage";
import Blog from "./pages/blogPage";
import BlogPostPage from "./pages/BlogPostPage";
import Services from "./pages/services";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import { useTheme } from "./context/ThemeContext"; // Adjust path if needed
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

function App() {
  const isArabic = i18n.language === "ar";
  const { theme } = useTheme(); // "light" or "dark"

  // Same beautiful shader backgrounds from HeroPromo
  const darkUrl =
    "https://shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.3&cAzimuthAngle=250&cDistance=1.5&cPolarAngle=140&cameraZoom=12.5&color1=%230E001A&color2=%23A12EFF&color3=%235A00A3&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.5&rotationX=0&rotationY=0&rotationZ=140&shader=defaults&type=sphere&uAmplitude=7&uDensity=0.8&uFrequency=5.5&uSpeed=0.3&uStrength=0.4&uTime=0&wireframe=false";

  const lightUrl =
    "https://shadergradient.co/customize?animate=on&axesHelper=off&brightness=1.5&cAzimuthAngle=250&cDistance=1.5&cPolarAngle=140&cameraZoom=12.5&color1=%236a11d6&color2=%23ffffff&color3=%23ffffff&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.5&rotationX=0&rotationY=0&rotationZ=140&shader=defaults&type=sphere&uAmplitude=7&uDensity=0.8&uFrequency=5.5&uSpeed=0.3&uStrength=0.4&uTime=0&wireframe=false";

  const backgroundUrl = theme === "dark" ? darkUrl : lightUrl;

  return (
    <BrowserRouter>
      {/* Full-Screen Animated Shader Background for the Entire App */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <ShaderGradientCanvas className="absolute inset-0">
          <ShaderGradient
            control="query"
            urlString={backgroundUrl}
            key={theme} // Forces remount on theme change for smooth transition
          />
        </ShaderGradientCanvas>
      </div>

      {/* App Layout */}
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className={`relative min-h-screen flex flex-col ${
          isArabic ? "font-Cairo" : "font-playfair"
        }`}
      >
        <FixedNavbar />

        {/* Main Content - Now overlays beautifully on the shader background */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<ServiceGalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/project/:slug" element={<ProjectDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
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

function App() {
  const isArabic = i18n.language === "ar";

  return (
    <BrowserRouter>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className={`min-h-screen flex flex-col ${
          isArabic ? "font-Cairo" : "font-playfair"
        }`}
      >
        <FixedNavbar />

        {/* Main Content */}
        <main className="flex-grow bg-transparent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<ServiceGalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/project/:slug" element={<ProjectDetailPage />} />

            {/* Catch-all route for 404 - MUST BE LAST */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
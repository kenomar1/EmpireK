import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound"; // Make sure this is the component we just made!
import { FixedNavbar } from "./components/layout/NavBar";
import i18n from "./i18n/config";
import ServiceGalleryPage from "./pages/ServiceGalleryPage";
import ContactPage from "./pages/ContactPage";
import Blog from "./pages/blogPage";
import BlogPostPage from "./pages/BlogPostPage";
import Services from "./pages/services";
import ProjectDetailPage from "./pages/ProjectDetailPage";

function App() {
  return (
    <BrowserRouter>
      <div
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        className="min-h-screen flex flex-col font-Cairo font-playfair"
      >
        <FixedNavbar />

        {/* Main Content */}
        <main className="flex-grow">
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

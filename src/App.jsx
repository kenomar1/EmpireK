import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound"; // Make sure this is the component we just made!
import { FixedNavbar } from "./components/layout/NavBar";
import i18n from "./i18n/config";
import AgencyServicesPage from "./pages/services";
import ServiceGalleryPage from "./pages/ServiceGalleryPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/blogPage";
import BlogPostPage from "./pages/BlogPostPage";

function App() {
  return (
    <BrowserRouter>
      <div
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        className="min-h-screen flex flex-col"
      >
        <FixedNavbar />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<AgencyServicesPage />} />
            <Route path="/gallery" element={<ServiceGalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blogpost" element={<BlogPostPage />} />

            {/* Catch-all route for 404 - MUST BE LAST */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  LayoutGrid,
  ShoppingBag,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  ImageIcon,
  Trash2,
  MessageSquare,
  Briefcase,
  HelpCircle,
  Send,
  Eye,
  EyeOff,
  Users
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { client } from "../lib/sanityClient";

// --- Types ---
type Tab = "services" | "templates" | "projects" | "comments" | "faqs" | "team";

type Author = {
  _id: string;
  name: string;
  role?: string;
  avatar?: { asset?: { url: string } };
  bio?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
};

type SanityCategory = {
  _id: string;
  title: string;
};

type Comment = {
  _id: string;
  name: string;
  email?: string;
  message: string;
  createdAt: string;
  post?: {
    title: string;
  };
};

type FAQ = {
  _id: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  category: string;
  submitterName?: string;
  submitterEmail?: string;
  submittedAt?: string;
  isActive: boolean;
};

// --- Components ---

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-foreground/80">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  </div>
);

const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  required = false
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-foreground/80">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px]"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  </div>
);

const ImageUpload = ({
  label,
  onUpload,
  previewUrl,
  uploading
}: {
  label: string;
  onUpload: (file: File) => void;
  previewUrl?: string;
  uploading?: boolean;
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-foreground/80">{label}</label>
      <div className="relative group cursor-pointer border-2 border-dashed border-white/20 rounded-xl p-6 transition-all hover:border-primary/50 hover:bg-white/5 text-center">
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          disabled={uploading}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-4">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
             <span className="text-sm text-foreground/60">Uploading...</span>
          </div>
        ) : previewUrl ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
             <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <p className="text-white font-bold">Click to Change</p>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white/60 group-hover:text-primary transition-colors">
              <ImageIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-foreground/60 group-hover:text-foreground transition-colors">
              Drag & Drop or Click to Upload
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
// --- Main Dashboard Component ---

export default function Dashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("services");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<SanityCategory[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [faqAnswer, setFaqAnswer] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);

  // Fetch Categories for Service Dropdown
  useEffect(() => {
    client.fetch(`*[_type == "category"]{_id, title}`).then(setCategories).catch(console.error);
  }, []);

  // Fetch Comments on Tab Change
  useEffect(() => {
    if (activeTab === 'comments') {
        const query = `*[_type == "comment"] | order(createdAt desc) {
            _id,
            name,
            email,
            message,
            createdAt,
            post->{title}
        }`;
        client.fetch(query).then(setComments).catch(console.error);
    }
  }, [activeTab]);

  // Fetch FAQs on Tab Change
  useEffect(() => {
    if (activeTab === 'faqs') {
      const query = `*[_type == "faq"] | order(status asc, submittedAt desc) {
        _id,
        question,
        answer,
        status,
        category,
        submitterName,
        submitterEmail,
        submittedAt,
        isActive
      }`;
      client.fetch(query).then(setFaqs).catch(console.error);
    }
  }, [activeTab]);

  // Fetch Team on Tab Change
  useEffect(() => {
    if (activeTab === 'team') {
       const query = `*[_type == "author"] | order(_createdAt desc) {
         _id, name, role, bio, avatar { asset-> { url } }, linkedin, twitter, github, email
       }`;
       client.fetch(query).then(setAuthors).catch(console.error);
    }
  }, [activeTab]);

  // Form States - Service
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [serviceFeatures, setServiceFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  
  // Form States - Template
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateCode, setTemplateCode] = useState("");
  const [templatePrice, setTemplatePrice] = useState("");
  const [templateCategory, setTemplateCategory] = useState("fashion");
  const [templateType, setTemplateType] = useState("sale");
  const [templatePreviewUrl, setTemplatePreviewUrl] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [templateImageId, setTemplateImageId] = useState<string | null>(null);
  const [templateImagePreview, setTemplateImagePreview] = useState<string>("");

  // Form States - Project
  const [projectTitle, setProjectTitle] = useState("");
  const [projectClient, setProjectClient] = useState("");
  const [projectYear, setProjectYear] = useState(new Date().getFullYear().toString());
  const [projectCategory, setProjectCategory] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectDesc, setProjectDesc] = useState(""); // Simplified body
  const [projectImageId, setProjectImageId] = useState<string | null>(null);
  const [projectImagePreview, setProjectImagePreview] = useState<string>("");


  const resetForms = () => {
    setServiceName(""); setServicePrice(""); setServiceDesc("");
    setServiceCategory(""); setServiceFeatures([]); setFeatureInput("");
    
    setTemplateTitle(""); setTemplateCode(""); setTemplatePrice("");
    setTemplateCategory("fashion"); setTemplateType("sale");
    setTemplatePreviewUrl(""); setTemplateDesc("");
    setTemplateImageId(null); setTemplateImagePreview("");

    setProjectTitle(""); setProjectClient(""); 
    setProjectYear(new Date().getFullYear().toString());
    setProjectCategory(""); setProjectLink(""); setProjectDesc("");
    setProjectImageId(null); setProjectImagePreview("");

    setError(null);
    setSuccess(null);
  };

  const handleImageUpload = (file: File, type: "template" | "project") => {
    setUploadingImage(true);
    client.assets.upload('image', file)
      .then(asset => {
        if (type === "template") {
            setTemplateImageId(asset._id);
            setTemplateImagePreview(asset.url);
        } else {
            setProjectImageId(asset._id);
            setProjectImagePreview(asset.url);
        }
        setUploadingImage(false);
      })
      .catch(err => {
        console.error("Upload error:", err);
        setError("Image upload failed.");
        setUploadingImage(false);
      });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setServiceFeatures([...serviceFeatures, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    setServiceFeatures(serviceFeatures.filter((_, i) => i !== idx));
  };

  // --- Handlers ---

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    if (!serviceCategory) { setError("Please select a category."); setLoading(false); return; }

    try {
      await client.create({
        _type: "service",
        name: serviceName,
        title: serviceName,
        price: servicePrice,
        shortDesc: serviceDesc,
        language: "en",
        category: { _type: 'reference', _ref: serviceCategory },
        features: serviceFeatures
      });
      setSuccess("Service created successfully!");
      resetForms();
    } catch (err) { setError("Failed to create service."); } 
    finally { setLoading(false); }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    if (!templateImageId) { setError("Please upload a preview image."); setLoading(false); return; }

    try {
      await client.create({
        _type: "template",
        title: templateTitle,
        slug: { _type: "slug", current: templateTitle.toLowerCase().replace(/\s+/g, "-") },
        code: templateCode,
        category: templateCategory,
        price: templatePrice,
        previewUrl: templatePreviewUrl,
        description: templateDesc,
        type: templateType,
        mainImage: { _type: 'image', asset: { _type: "reference", _ref: templateImageId } }
      });
      setSuccess("Template created successfully!");
      resetForms();
    } catch (err) { setError("Failed to create template."); }
    finally { setLoading(false); }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true); setError(null);
      if (!projectCategory) { setError("Please select a category."); setLoading(false); return; }
      if (!projectImageId) { setError("Please upload a main image."); setLoading(false); return; }

      try {
          await client.create({
              _type: "project",
              title: projectTitle,
              slug: { _type: "slug", current: projectTitle.toLowerCase().replace(/\s+/g, "-") },
              language: "en",
              category: { _type: 'reference', _ref: projectCategory },
              client: projectClient,
              year: parseInt(projectYear),
              link: projectLink,
              mainImage: { _type: 'image', asset: { _type: "reference", _ref: projectImageId } },
              body: [
                  {
                      _type: 'block',
                      children: [{ _type: 'span', text: projectDesc }],
                      markDefs: [],
                      style: 'normal'
                  }
              ] // Simplified definition
          });
          setSuccess("Project created successfully!");
          resetForms();
      } catch (err) { setError("Failed to create project."); console.error(err); }
      finally { setLoading(false); }
  };

  const deleteComment = async (id: string) => {
      if(!window.confirm("Are you sure you want to delete this comment?")) return;
      try {
          await client.delete(id);
          setComments(comments.filter(c => c._id !== id));
          setSuccess("Comment deleted.");
      } catch (err) {
          setError("Failed to delete comment.");
      }
  };

  const handleAnswerFaq = async (faqId: string) => {
    if (!faqAnswer.trim()) {
      setError("Please provide an answer.");
      return;
    }
    setLoading(true);
    try {
      await client
        .patch(faqId)
        .set({
          answer: faqAnswer,
          status: 'answered',
          isActive: true
        })
        .commit();
      
      setSuccess("FAQ answered and published!");
      setFaqAnswer("");
      setSelectedFaq(null);
      
      // Refresh FAQ list
      const query = `*[_type == "faq"] | order(status asc, submittedAt desc) {
        _id, question, answer, status, category, submitterName, submitterEmail, submittedAt, isActive
      }`;
      client.fetch(query).then(setFaqs).catch(console.error);
    } catch (err) {
      setError("Failed to answer FAQ.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaqVisibility = async (faqId: string, currentStatus: boolean) => {
    try {
      await client.patch(faqId).set({ isActive: !currentStatus }).commit();
      setFaqs(faqs.map(f => f._id === faqId ? {...f, isActive: !currentStatus} : f));
      setSuccess(`FAQ ${!currentStatus ? 'published' : 'hidden'}.`);
    } catch (err) {
      setError("Failed to update FAQ visibility.");
    }
  };

  const deleteAuthor = async (id: string) => {
    if(!window.confirm("Are you sure you want to delete this team member?")) return;
    try {
        await client.delete(id);
        setAuthors(authors.filter(a => a._id !== id));
        setSuccess("Team member removed.");
    } catch (err) {
        setError("Failed to delete team member.");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden font-jakarta">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black -z-50" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 -z-40 pointer-events-none mix-blend-overlay" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel bg-white/5 border border-white/10 mb-6">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Admin Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Content Control Center
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Full control over your digital empire's Services, Products, and Engagement.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12 flex-wrap gap-2">
          <div className="glass-panel p-1 rounded-full flex gap-1 bg-black/40 border border-white/10 overflow-x-auto max-w-full">
            {[
                { id: 'services', label: 'Services', icon: LayoutGrid },
                { id: 'templates', label: 'Templates', icon: ShoppingBag },
                { id: 'projects', label: 'Projects', icon: Briefcase },
                { id: 'faqs', label: 'FAQs', icon: HelpCircle },
                { id: 'team', label: 'Team', icon: Users },
                { id: 'comments', label: 'Comments', icon: MessageSquare },
            ].map((tab) => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="glass-panel bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden min-h-[400px]">
          
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3 text-red-200"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
                <button onClick={() => setError(null)} className="ml-auto hover:text-white"><X className="w-5 h-5"/></button>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 bg-green-500/20 border border-green-500/50 rounded-2xl p-4 flex items-center gap-3 text-green-200"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p>{success}</p>
                <button onClick={() => setSuccess(null)} className="ml-auto hover:text-white"><X className="w-5 h-5"/></button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Service Form */}
          {activeTab === "services" && (
             <motion.form
              key="service-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
              onSubmit={handleCreateService}
             >
               <h2 className="text-2xl font-bold text-white mb-6">Create New Service</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField label="Service Name" value={serviceName} onChange={setServiceName} placeholder="e.g. Web Development" required />
                 
                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-foreground/80">Category <span className="text-red-500">*</span></label>
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                      required
                    >
                      <option value="" className="text-black">Select Category...</option>
                      {categories.map((cat) => (
                         <option key={cat._id} value={cat._id} className="text-black">{cat.title}</option>
                      ))}
                    </select>
                 </div>
               </div>
               
               <InputField label="Price Display" value={servicePrice} onChange={setServicePrice} placeholder="e.g. Starting at $300" required />
               <TextArea label="Short Description" value={serviceDesc} onChange={setServiceDesc} placeholder="Brief overview..." required />
               
               <div className="space-y-2">
                 <label className="block text-sm font-bold text-foreground/80">Features List</label>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground"
                      placeholder="Add a feature..."
                    />
                    <button type="button" onClick={addFeature} className="px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                       <Plus className="w-5 h-5 text-white" />
                    </button>
                 </div>
                 <div className="flex flex-wrap gap-2 mt-3">
                    {serviceFeatures.map((feat, idx) => (
                       <span key={idx} className="px-3 py-1 rounded-lg bg-primary/20 text-primary-foreground text-sm flex items-center gap-2">
                          {feat}
                          <button type="button" onClick={() => removeFeature(idx)}><X className="w-3 h-3 hover:text-white" /></button>
                       </span>
                    ))}
                 </div>
               </div>

               <div className="pt-4">
                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Plus className="w-5 h-5" />}
                   {loading ? "Creating..." : "Create Service"}
                 </button>
               </div>
             </motion.form>
          )}

          {/* Template Form */}
          {activeTab === "templates" && (
            <motion.form
              key="template-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
              onSubmit={handleCreateTemplate}
             >
               <h2 className="text-2xl font-bold text-white mb-6">Create New Template</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField label="Template Title" value={templateTitle} onChange={setTemplateTitle} placeholder="e.g. Luxe Store Theme" required />
                 <InputField label="Unique Code" value={templateCode} onChange={setTemplateCode} placeholder="e.g. ECOM-002" required />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-foreground/80">Category</label>
                    <select
                      value={templateCategory}
                      onChange={(e) => setTemplateCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                    >
                      <option value="fashion" className="text-black">Fashion Store</option>
                      <option value="food" className="text-black">Food / Restaurant</option>
                      <option value="portfolio" className="text-black">Portfolio</option>
                      <option value="startup" className="text-black">Startup / SaaS</option>
                      <option value="other" className="text-black">Other</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-foreground/80">Type</label>
                    <select
                      value={templateType}
                      onChange={(e) => setTemplateType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                    >
                      <option value="sale" className="text-black">One-Time Sale</option>
                      <option value="subscription" className="text-black">Subscription</option>
                    </select>
                 </div>
               </div>
               
               <InputField label="Price" value={templatePrice} onChange={setTemplatePrice} placeholder="e.g. $49" required />
               <InputField label="Preview URL" value={templatePreviewUrl} onChange={setTemplatePreviewUrl} placeholder="https://..." />
               
               <ImageUpload 
                 label="Preview Image" 
                 onUpload={(f) => handleImageUpload(f, "template")} 
                 previewUrl={templateImagePreview} 
                 uploading={uploadingImage}
               />
               
               <TextArea label="Description" value={templateDesc} onChange={setTemplateDesc} placeholder="Describe the template..." required />

               <div className="pt-4">
                 <button
                   type="submit"
                   disabled={loading || uploadingImage}
                   className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Plus className="w-5 h-5" />}
                    {loading ? "Creating..." : "Add to Shop"}
                 </button>
               </div>
             </motion.form>
          )}

          {/* Project Form */}
          {activeTab === "projects" && (
              <motion.form
               key="project-form"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-6"
               onSubmit={handleCreateProject}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Add New Project</h2>
                <InputField label="Project Title" value={projectTitle} onChange={setProjectTitle} placeholder="e.g. Nike Campaign" required />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Client Name" value={projectClient} onChange={setProjectClient} placeholder="e.g. Nike" />
                    <InputField label="Year" value={projectYear} onChange={setProjectYear} type="number" required />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-foreground/80">Category <span className="text-red-500">*</span></label>
                    <select
                        value={projectCategory}
                        onChange={(e) => setProjectCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                        required
                    >
                        <option value="" className="text-black">Select Category...</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id} className="text-black">{cat.title}</option>
                        ))}
                    </select>
                </div>

                <InputField label="Live Link" value={projectLink} onChange={setProjectLink} placeholder="https://..." />
                
                <ImageUpload 
                    label="Main Project Image" 
                    onUpload={(f) => handleImageUpload(f, "project")} 
                    previewUrl={projectImagePreview} 
                    uploading={uploadingImage}
                />

                <TextArea label="Project Description" value={projectDesc} onChange={setProjectDesc} placeholder="Detailed case study..." required />

                <div className="pt-4">
                 <button
                   type="submit"
                   disabled={loading || uploadingImage}
                   className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Plus className="w-5 h-5" />}
                    {loading ? "Creating..." : "Add Project"}
                 </button>
               </div>
              </motion.form>
          )}

          {/* Comments List */}
          {activeTab === "comments" && (
              <motion.div
               key="comments-list"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-4"
              >
                 <h2 className="text-2xl font-bold text-white mb-6">Manage Comments</h2>
                 {comments.length === 0 ? (
                     <div className="text-center py-20 text-muted-foreground">
                         No comments found.
                     </div>
                 ) : (
                     comments.map((comment) => (
                         <div key={comment._id} className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group hover:border-white/20 transition-all">
                             <div>
                                 <div className="flex items-center gap-3 mb-2">
                                     <span className="font-bold text-white">{comment.name}</span>
                                     <span className="text-sm text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                      {comment.post?.title && <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">on {comment.post.title}</span>}
                                  </div>
                                  <p className="text-white/80 text-sm md:text-base">{comment.message}</p>
                                  <div className="text-xs text-muted-foreground mt-2">{comment.email}</div>
                              </div>
                              <button
                                onClick={() => deleteComment(comment._id)}
                                className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all self-end md:self-center"
                                title="Delete Comment"
                              >
                                  <Trash2 className="w-5 h-5" />
                              </button>
                          </div>
                      ))
                  )}
               </motion.div>
           )}

          {/* FAQs Management */}
          {activeTab === "faqs" && (
              <motion.div
               key="faqs-list"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-6"
              >
                 <h2 className="text-2xl font-bold text-white mb-6">Manage FAQs</h2>
                 
                 {/* Pending Questions */}
                 <div className="mb-8">
                   <h3 className="text-lg font-bold text-white/80 mb-4 flex items-center gap-2">
                     <AlertCircle className="w-5 h-5 text-yellow-400" />
                     Pending Questions ({faqs.filter(f => f.status === 'pending').length})
                   </h3>
                   {faqs.filter(f => f.status === 'pending').length === 0 ? (
                     <div className="text-center py-12 text-muted-foreground glass-panel rounded-2xl border border-white/10">
                       No pending questions.
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {faqs.filter(f => f.status === 'pending').map((faq) => (
                         <div key={faq._id} className="glass-panel p-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/5">
                           <div className="mb-4">
                             <div className="flex items-start justify-between gap-4 mb-2">
                               <h4 className="font-bold text-white text-lg flex-1">{faq.question}</h4>
                               <span className="text-xs px-3 py-1 bg-white/10 rounded-full text-white/70 whitespace-nowrap">
                                 {faq.category}
                               </span>
                             </div>
                             {faq.submitterName && (
                               <p className="text-sm text-white/60">
                                 Asked by: {faq.submitterName} {faq.submitterEmail && `(${faq.submitterEmail})`}
                               </p>
                             )}
                             {faq.submittedAt && (
                               <p className="text-xs text-white/40 mt-1">
                                 {new Date(faq.submittedAt).toLocaleDateString()}
                               </p>
                             )}
                           </div>

                           {selectedFaq?._id === faq._id ? (
                             <div className="space-y-3">
                               <textarea
                                 value={faqAnswer}
                                 onChange={(e) => setFaqAnswer(e.target.value)}
                                 placeholder="Type your answer here..."
                                 className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]"
                               />
                               <div className="flex gap-2">
                                 <button
                                   onClick={() => handleAnswerFaq(faq._id)}
                                   disabled={loading}
                                   className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                 >
                                   {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                   Answer & Publish
                                 </button>
                                 <button
                                   onClick={() => { setSelectedFaq(null); setFaqAnswer(""); }}
                                   className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                                 >
                                   Cancel
                                 </button>
                               </div>
                             </div>
                           ) : (
                             <button
                               onClick={() => setSelectedFaq(faq)}
                               className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                             >
                               <MessageSquare className="w-4 h-4" />
                               Reply to Question
                             </button>
                           )}
                         </div>
                       ))}
                     </div>
                   )}
                 </div>

                 {/* Answered Questions */}
                 <div>
                   <h3 className="text-lg font-bold text-white/80 mb-4 flex items-center gap-2">
                     <CheckCircle className="w-5 h-5 text-green-400" />
                     Answered Questions ({faqs.filter(f => f.status === 'answered').length})
                   </h3>
                   {faqs.filter(f => f.status === 'answered').length === 0 ? (
                     <div className="text-center py-12 text-muted-foreground glass-panel rounded-2xl border border-white/10">
                       No answered questions yet.
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {faqs.filter(f => f.status === 'answered').map((faq) => (
                         <div key={faq._id} className="glass-panel p-6 rounded-2xl border border-green-500/30 bg-green-500/5">
                           <div className="flex items-start justify-between gap-4 mb-3">
                             <div className="flex-1">
                               <div className="flex items-start gap-3 mb-2">
                                 <h4 className="font-bold text-white text-lg flex-1">{faq.question}</h4>
                                 <span className="text-xs px-3 py-1 bg-white/10 rounded-full text-white/70 whitespace-nowrap">
                                   {faq.category}
                                 </span>
                               </div>
                               <p className="text-white/70 text-sm leading-relaxed">{faq.answer}</p>
                             </div>
                           </div>
                           <div className="flex items-center justify-between pt-3 border-t border-white/10">
                             <span className={`text-sm flex items-center gap-2 ${faq.isActive ? 'text-green-400' : 'text-white/40'}`}>
                               {faq.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                               {faq.isActive ? 'Published' : 'Hidden'}
                             </span>
                             <button
                               onClick={() => toggleFaqVisibility(faq._id, faq.isActive)}
                               className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-all"
                             >
                               {faq.isActive ? 'Hide' : 'Publish'}
                             </button>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
              </motion.div>
           )}

          {/* Team tab content */}
            {activeTab === "team" && (
              <motion.div
                key="team-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    Team Management
                  </h2>
                  <p className="text-white/60 text-sm">
                    Total Members: {authors.length}
                  </p>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
                    <p className="text-white/60">Fetching your team...</p>
                  </div>
                ) : authors.length === 0 ? (
                  <div className="text-center py-20 glass-panel rounded-3xl border border-white/10">
                    <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40 text-lg">No authors found in Sanity.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {authors.map((member) => (
                      <div key={member._id} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all group">
                        <div className="flex items-start gap-4">
                          {member.avatar?.asset?.url ? (
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                              <img src={member.avatar.asset.url} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                              <Users className="w-8 h-8" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-lg truncate">{member.name}</h3>
                            <p className="text-purple-400 text-sm font-medium mb-2">{member.role || "No Role Defined"}</p>
                            <p className="text-white/60 text-xs line-clamp-2 mb-4 italic">
                              {member.bio || "No bio information."}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                {member.email && <div className="w-2 h-2 rounded-full bg-green-500" title="Email Available" />}
                                {member.linkedin && <div className="w-2 h-2 rounded-full bg-blue-500" title="LinkedIn Available" />}
                                {member.twitter && <div className="w-2 h-2 rounded-full bg-sky-400" title="Twitter Available" />}
                              </div>
                              <button 
                                onClick={() => deleteAuthor(member._id)}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="bg-purple-600/10 border border-purple-500/20 p-6 rounded-2xl">
                  <p className="text-purple-200 text-sm flex items-center gap-3">
                    <HelpCircle className="w-5 h-5" />
                    To add new authors or edit existing ones, please use the Sanity Studio.
                  </p>
                </div>
              </motion.div>
            )}

        </div>
      </div>
    </div>
  );
}


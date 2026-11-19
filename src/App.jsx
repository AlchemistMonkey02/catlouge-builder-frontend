import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminLogin from "./pages/AdminLogin";
import CompanyManager from "./pages/CompanyManager";
import CompanyCatalogueManager from "./pages/CompanyCatalogueManager";
import PdfCatalogueGenerator from "./pages/PdfCatalogueGenerator";
import Dashboard from "./pages/Dashboard";
import CatalogueWorkspace from "./pages/CatalogueWorkspace";
import BulkImportHub from "./pages/BulkImportHub";
import ExportPublishingCenter from "./pages/ExportPublishingCenter";
import BrandKitSettings from "./pages/BrandKitSettings";
import AiProductStudio from "./pages/AiProductStudio";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import LiveCatalogueViewer from "./pages/LiveCatalogueViewer";
import NotFound from "./pages/NotFound";

export default function App() {
  const location = useLocation();
  const isLiveViewer = /^\/(c|live|catalogues)\//i.test(location.pathname);

  return (
    <div className={`app-container ${isLiveViewer ? "live-viewer-active" : ""}`} style={isLiveViewer ? { minHeight: "100vh", height: "100vh", overflow: "hidden" } : undefined}>
      {!isLiveViewer && <Navbar />}
      <Routes>
        {/* Public Digital Live Catalogue Viewer (Accessible to anyone via share link) */}
        <Route path="/c/:id" element={<LiveCatalogueViewer />} />
        <Route path="/live/:id" element={<LiveCatalogueViewer />} />
        <Route path="/catalogues/:id" element={<LiveCatalogueViewer />} />

        {/* Core Direct Workflow: Login -> Companies -> Add Products -> Generate PDF */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<CompanyManager />} />
        <Route path="/companies" element={<CompanyManager />} />
        <Route path="/companies/:companyId/catalogue" element={<CompanyCatalogueManager />} />
        <Route path="/ai-studio" element={<AiProductStudio />} />
        <Route path="/studio" element={<AiProductStudio />} />
        <Route path="/photo-studio" element={<AiProductStudio />} />
        <Route path="/pdf-generator" element={<PdfCatalogueGenerator />} />
        <Route path="/pdf-catalogues" element={<PdfCatalogueGenerator />} />
        <Route path="/pdf" element={<PdfCatalogueGenerator />} />

        {/* Studio Utilities */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalogue" element={<CatalogueWorkspace />} />
        <Route path="/bulk-import" element={<BulkImportHub />} />
        <Route path="/export-center" element={<ExportPublishingCenter />} />
        <Route path="/brand-kit" element={<BrandKitSettings />} />

        {/* Storefront views */}
        <Route path="/storefront" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isLiveViewer && (
        <footer
          className="no-print"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "1.25rem 2rem",
            textAlign: "center",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            background: "var(--bg-glass)",
          }}
        >
          Catalogue Builder Studio • Multi-Company PDF Catalogue Generator • MongoDB Atlas Connected
        </footer>
      )}
    </div>
  );
}

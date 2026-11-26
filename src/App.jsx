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

function RequireAuth({ children }) {
  const isLoggedIn = localStorage.getItem("admin_logged_in") === "true";
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const location = useLocation();
  const isLiveViewer = /^\/(c|live|catalogues)\//i.test(location.pathname);
  const isLoginPage = location.pathname === "/login";
  const hideChrome = isLiveViewer || isLoginPage;

  return (
    <div className={`app-container ${isLiveViewer ? "live-viewer-active" : ""}`} style={isLiveViewer ? { minHeight: "100vh", height: "100vh", overflow: "hidden" } : undefined}>
      {!hideChrome && <Navbar />}
      <Routes>
        {/* Public Digital Live Catalogue Viewer (Accessible to anyone via share link) */}
        <Route path="/c/:id" element={<LiveCatalogueViewer />} />
        <Route path="/live/:id" element={<LiveCatalogueViewer />} />
        <Route path="/catalogues/:id" element={<LiveCatalogueViewer />} />

        {/* Core Direct Workflow: Login -> Companies -> Add Products -> Generate PDF */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/companies" element={<RequireAuth><CompanyManager /></RequireAuth>} />
        <Route path="/companies/:companyId/catalogue" element={<RequireAuth><CompanyCatalogueManager /></RequireAuth>} />
        <Route path="/ai-studio" element={<RequireAuth><AiProductStudio /></RequireAuth>} />
        <Route path="/studio" element={<RequireAuth><AiProductStudio /></RequireAuth>} />
        <Route path="/photo-studio" element={<RequireAuth><AiProductStudio /></RequireAuth>} />
        <Route path="/pdf-generator" element={<RequireAuth><PdfCatalogueGenerator /></RequireAuth>} />
        <Route path="/pdf-catalogues" element={<RequireAuth><PdfCatalogueGenerator /></RequireAuth>} />
        <Route path="/pdf" element={<RequireAuth><PdfCatalogueGenerator /></RequireAuth>} />

        {/* Studio Utilities */}
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/catalogue" element={<RequireAuth><CatalogueWorkspace /></RequireAuth>} />
        <Route path="/bulk-import" element={<RequireAuth><BulkImportHub /></RequireAuth>} />
        <Route path="/export-center" element={<RequireAuth><ExportPublishingCenter /></RequireAuth>} />
        <Route path="/brand-kit" element={<RequireAuth><BrandKitSettings /></RequireAuth>} />

        {/* Storefront views */}
        <Route path="/storefront" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChrome && (
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

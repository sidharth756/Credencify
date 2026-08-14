import { Routes, Route } from "react-router-dom";

import './App.css';

import Welcome from './pages/Welcome/Welcome';
import Register from './pages/Register/Register';
import Contact from './pages/Contact/Contact';
import VerifyPage from "./pages/Verify/Verify";
import VerifyingPage from "./pages/Verify/Verifying";
import VerificationSuccessPage from "./pages/Verify/VerificationSuccess";
import VerificationFailurePage from "./pages/Verify/VerificationFailure";

import InstitutionPortal from "./pages/InstitutionPortal/InstitutionPortal";
import Mods from "./components/Mods/Mods";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AboutPage from './pages/About/About';
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<AboutPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["LEARNER", "INSTITUTION"]}>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/verifying" element={<VerifyingPage />} />
      <Route path="/verification-success" element={<VerificationSuccessPage />} />
      <Route path="/verification-failure" element={<VerificationFailurePage />} />

      <Route path="/mod/verify"  element={<VerifyPage />} />
      <Route path="/mod/institution"  element={<InstitutionPortal />} />
      <Route path="/mod/verifying" element={<VerifyingPage />} />
      <Route path="/mod/verification-success" element={<VerificationSuccessPage />} />
      <Route path="/mod/verification-failure"  element={<VerificationFailurePage />} />
      <Route path="/mod" element={<Mods />} />
    </Routes>
  );
}

export default App;
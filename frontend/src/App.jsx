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


function App() {
  return (
    <Routes>

      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/mod/verify"  element={<VerifyPage />}      />

      <Route  path="/mod/institution"  element={<InstitutionPortal />}     />

      <Route path="/mod/verifying" element={<VerifyingPage />}   />

      <Route path="/mod/verification-success" element={<VerificationSuccessPage />} />
      <Route path="/mod/verification-failure"  element={<VerificationFailurePage />} />

    </Routes>
  );
}

export default App;
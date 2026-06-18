import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/common/Header";
import SummaryTiles from "./components/dashboard/SummaryTiles";
import LineGraph from "./components/dashboard/LineGraph";
import BarGraph from "./components/dashboard/BarGraph";
import EnrollmentForm from "./components/enrollment/EnrollmentForm";
import EventsList from "./components/events/EventsList";
import PartnershipForm from "./components/partnership/PartnershipForm";
import ContactInfo from "./components/contact/ContactInfo";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import useDashboard from "./hooks/useDashboard";
import "./styles/global.css";

const AppContent = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [authView, setAuthView] = useState("login");
  const { data: dashboardData, refetch: refetchDashboard } = useDashboard();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const handleDarkChange = () => {
      const dark = document.body.classList.contains("dark-mode");
      setIsDark(dark);
    };
    const observer = new MutationObserver(handleDarkChange);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    handleDarkChange();
    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="auth-page">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <Header />
        <div className="auth-page">
          {authView === "login" && <LoginForm onSwitchView={setAuthView} />}
          {authView === "register" && <RegisterForm onSwitchView={setAuthView} />}
          {authView === "forgot" && <ForgotPasswordForm onSwitchView={setAuthView} />}
        </div>
      </div>
    );
  }

  const showEnrollment = user?.position === "teacher" || user?.position === "both";
  const showPartnership = user?.position === "partnership" || user?.position === "both";

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <section id="dashboard">
          <SummaryTiles cards={dashboardData.cards} />
          <div className="graphs-row">
            <BarGraph barData={dashboardData.barGraph} isDark={isDark} />
            <LineGraph lineData={dashboardData.lineGraph} isDark={isDark} />
          </div>
        </section>
        {showEnrollment && (
          <section id="enrollment">
            <EnrollmentForm onEnrollSuccess={refetchDashboard} />
          </section>
        )}
        <section id="events">
          <EventsList />
        </section>
        {showPartnership && (
          <section id="partnership">
            <PartnershipForm />
          </section>
        )}
        <section id="contact">
          <ContactInfo />
        </section>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime) {
        const elapsed = Date.now() - Number(loginTime);
        // const oneMinute = 1 * 60 * 1000; // 1 minute for testing
        const thirtyMinutes = 30 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 ms

        if (elapsed > thirtyMinutes) {
          // Clear session
          localStorage.removeItem("hrmsuser");
          localStorage.removeItem("loginTime");

          window.scrollTo({ top: 0, behavior: "instant" });

          //  use small timeout to ensure re-render before navigating
          window.location.href = "/"; 
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 30 * 1000); // check every 30s

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

export default SessionChecker;

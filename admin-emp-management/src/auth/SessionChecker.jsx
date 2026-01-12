// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const SessionChecker = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkSession = () => {
//       const loginTime = localStorage.getItem("loginTime");
//       if (loginTime) {
//         const elapsed = Date.now() - Number(loginTime);
//         // const oneMinute = 1 * 60 * 1000; // 1 minute for testing
//         const thirtyMinutes = 30 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 ms

//         if (elapsed > thirtyMinutes) {
//           // Clear session
//           localStorage.removeItem("hrmsuser");
//           localStorage.removeItem("loginTime");

//           window.scrollTo({ top: 0, behavior: "instant" });

//           //  use small timeout to ensure re-render before navigating
//           window.location.href = "/"; 
//         }
//       }
//     };

//     checkSession();
//     const interval = setInterval(checkSession, 30 * 1000); // check every 30s

//     return () => clearInterval(interval);
//   }, [navigate]);

//   return null;
// };

// export default SessionChecker;




import { useEffect } from "react";

const IDLE_LIMIT = 30 * 60 * 1000; // 30 minutes
const CHECK_INTERVAL = 30 * 1000; // 30 seconds
// const IDLE_LIMIT = 5 * 60 * 1000; // 5 minutes
// const CHECK_INTERVAL = 30 * 1000;
const SessionChecker = () => {
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("lastActivityTime", Date.now().toString());
    };

    const checkSession = () => {
      const lastActivity = localStorage.getItem("lastActivityTime");

      if (!lastActivity) return;

      const elapsed = Date.now() - Number(lastActivity);

      if (elapsed > IDLE_LIMIT) {
        // Clear session
        localStorage.removeItem("hrmsuser");
        localStorage.removeItem("lastActivityTime");

        window.scrollTo({ top: 0, behavior: "instant" });

        // Redirect to login
        window.location.href = "/";
      }
    };

    // 👇 Track user activity
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(event =>
      window.addEventListener(event, updateActivity)
    );

    // Initialize activity time on mount
    updateActivity();

    const interval = setInterval(checkSession, CHECK_INTERVAL);

    return () => {
      clearInterval(interval);
      events.forEach(event =>
        window.removeEventListener(event, updateActivity)
      );
    };
  }, []);

  return null;
};

export default SessionChecker;


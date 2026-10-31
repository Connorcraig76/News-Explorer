import { Navigate } from "react-router-dom";
import Preloader from "../Preloader/Preloader.jsx";

function ProtectedRoute({ isLoggedIn, isAuthChecking, children }) {
  if (isAuthChecking) {
    return <Preloader />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

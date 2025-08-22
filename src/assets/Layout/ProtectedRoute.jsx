import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function ProtectedRoute({ children }) {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    // Not signed in → redirect to home page
    return <Navigate to="/" replace />;
  }

  // Signed in → render the protected component
  return children;
}

// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'; // Tailwind CSS styles
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// Make sure you have your key in .env: VITE_CLERK_PUBLISHABLE_KEY=your_key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey} 
                   navigate={(to) => window.history.pushState(null, '', to)}>
      <BrowserRouter>
        {/* Optional: Redirect non-signed-in users to sign-in page if needed */}
        <SignedIn>
          <App />
        </SignedIn>
        <SignedOut>
          <App />
        </SignedOut>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);

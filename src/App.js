// app.js
import React, { useState, useEffect } from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Postcard from "./components/Postcard";
import Contact from "./components/Contact";
import Mylist from "./components/Mylist";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";

import Launch from "./components/launch"; // make sure this matches exact filename casing

const NotFound = () => (
  <div
    style={{
      padding: 20,
      color: "#eeeeee",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      textAlign: "center",
    }}
  >
    <h2>404 - Page Not Found</h2>
    <p>The page you requested does not exist.</p>
  </div>
);

// Your Clerk publishable key (replace with your production key)
const publishableKey = "pk_test_c2FmZS1lZ3JldC0yMi5jbGVyay5hY2NvdW50cy5kZXYk";

function App() {
  // Check sessionStorage once on init: if launch was shown, skip it.
  const [showLaunch, setShowLaunch] = useState(() => {
    const alreadyShown = sessionStorage.getItem("launchShown");
    return !alreadyShown; // show launch only if not shown before this session
  });

  const [showSignIn, setShowSignIn] = useState(true);

  useEffect(() => {
    if (showLaunch) {
      const timer = setTimeout(() => {
        setShowLaunch(false);
        sessionStorage.setItem("launchShown", "true");
      }, 3000); // show launch for 3 seconds (adjust as needed)
      return () => clearTimeout(timer);
    }
  }, [showLaunch]);

  // Clerk appearance config (unchanged)
  const clerkAppearance = {
    baseTheme: "dark",
    variables: {
      colorPrimary: "#bb86fc",
      colorBackground: "#121212",
      colorText: "#eeeeee",
      colorInputBackground: "#1e1e1e",
      colorInputBorder: "#444",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSizeBase: "16px",
      fontSizeInput: "1rem",
      fontSizeButton: "1rem",
      borderRadius: "10px",
      spacingSpaceSmall: "12px",
    },
    elements: {
  formButtonPrimary:
    "box-shadow: 0 0 10px #bb86fc; transition: filter 0.2s ease;",
  formButtonPrimaryHover: "filter: brightness(1.15);",
  formInput: `
    padding: 12px 14px !important;
    border-radius: 10px !important;
    font-size: 1rem !important;
    box-sizing: border-box !important;
    margin-bottom: 16px !important;
  `,
  formInputFocused:
    "border-color: #bb86fc !important; box-shadow: 0 0 8px #bb86fc !important;",

  // Added to fix the "Continue with Google" button text color and background
  socialButtonsBlockButton: `
    color: #ffffff !important;
    background-color: #222222 !important;
    font-weight: 700 !important;
  `,
  socialButtonsBlockButtonText: `
    color: #ffffff !important;
    font-weight: 700 !important;
  `,
},

  };

  const outerWrapperStyle = {
    minHeight: "100vh",
    width: "100vw",
    padding: "20px 16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    boxSizing: "border-box",
    flexWrap: "wrap",
  };

  const authContainerStyle = {
    maxWidth: 400,
    width: "100%",
    padding: "30px 24px",
    backgroundColor: "#121212",
    borderRadius: 14,
    
    boxSizing: "border-box",
    color: "#eeeeee",
    fontFamily: clerkAppearance.variables.fontFamily,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    margin: "0 auto",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: 900,
    fontSize: "2rem",
    userSelect: "none",
  };

  const toggleLinkStyle = {
    all: "unset",
    color: "#bb86fc",
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: 8,
    userSelect: "none",
    fontFamily: clerkAppearance.variables.fontFamily,
    fontWeight: 600,
  };

  if (showLaunch) {
    // Render only launch page during the first 3 seconds or until hidden
    return <Launch />;
  }

  // After launch is hidden, render Clerk auth and main app routes
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <div style={outerWrapperStyle}>
        <SignedOut>
          <main style={authContainerStyle}>
            <h2 style={titleStyle}>
              {showSignIn ? "Please sign in" : "Create an account"}
            </h2>

            {showSignIn ? (
              <SignIn appearance={clerkAppearance} />
            ) : (
              <SignUp appearance={clerkAppearance} />
            )}

            <div style={{ textAlign: "center", marginTop: 16, fontSize: 14 }}>
              {showSignIn ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="clerk-toggle-button"
                    onClick={() => setShowSignIn(false)}
                    style={toggleLinkStyle}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#9a69e0")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = "#bb86fc")
                    }
                    aria-label="Switch to Sign Up"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="clerk-toggle-button"
                    onClick={() => setShowSignIn(true)}
                    style={toggleLinkStyle}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#9a69e0")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = "#bb86fc")
                    }
                    aria-label="Switch to Sign In"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </main>
        </SignedOut>

        <SignedIn>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/postcard" element={<Postcard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/mylist" element={<Mylist />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SignedIn>
      </div>
    </ClerkProvider>
  );
}

export default App;

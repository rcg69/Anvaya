import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

// Animated header component
const ScrollFloat = ({ children }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const chars = el.querySelectorAll(".char");
    gsap.fromTo(
      chars,
      {
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: "50% 0%",
      },
      {
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: 0.03,
        ease: "back.inOut(2)",
        duration: 1,
      }
    );
  }, [children]);
  const splitText = typeof children === "string" ? children.split("") : [];
  return (
    <h2
      ref={containerRef}
      style={{
        overflow: "hidden",
        fontWeight: 900,
        fontSize: "clamp(1.5rem, 8vw, 3rem)", // Slight increase for mobile
        color: "#6f42c1",
        textAlign: "center",
        marginBottom: "1rem",
        userSelect: "none",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        letterSpacing: ".01em",
        wordBreak: "break-word",
      }}
    >
      {splitText.map((char, idx) => (
        <span
          key={idx}
          className="char"
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h2>
  );
};

// Content sections
const SECTIONS = [
  {
    key: "about",
    label: "About",
    content: (
      <>
        <ScrollFloat>About Us</ScrollFloat>
        <p
          style={{
            fontSize: "clamp(1rem, 4vw, 1.15rem)",
            lineHeight: 1.7,
            textAlign: "center",
            margin: "0.5rem auto 0 auto",
            maxWidth: "98vw",
            width: "100%",
            letterSpacing: "0.01em",
            fontWeight: 400,
          }}
        >
          Anvaya is a <strong>secure marketplace</strong> for buying and selling scratch cards.{" "}
          We act as a trusted mediator—sellers post their scratch cards and buyers contact sellers{" "}
          directly via email to arrange purchases. The platform focuses on{" "}
          <strong>transparency</strong>, <strong>security</strong>, and empowering users with control
          over their transactions.
        </p>
      </>
    ),
  },
  {
    key: "terms",
    label: "Terms",
    content: (
      <>
        <ScrollFloat>Terms &amp; Conditions</ScrollFloat>
        <ul
          style={{
            fontSize: "clamp(.97rem, 3vw, 1.11rem)",
            lineHeight: 1.7,
            maxWidth: "98vw",
            width: "100%",
            margin: "0.6rem auto",
            paddingLeft: "1.1em",
            textAlign: "left",
            listStyleType: "disc",
          }}
        >
          <li>
    <strong>General Commitment</strong><br />
    We are committed to providing a secure, transparent, and trustworthy marketplace for buying and selling scratch cards. Our platform strives to maintain the highest standards of security and user satisfaction.
  </li>
  <li>
    <strong>User Responsibility</strong><br />
    Users are responsible for verifying the authenticity and validity of any scratch cards purchased on the platform. We recommend exercising due diligence before completing any transactions.
  </li>
  <li>
    <strong>Limitation of Liability</strong><br />
    We do not accept responsibility or liability for any losses, damages, or disputes arising from:
    <ul style={{ margin: "0.5em 0 0 1em", fontSize: "0.98em" }}>
      <li>Miscommunication between users,</li>
      <li>Fraudulent activities conducted by any party,</li>
      <li>Payment issues beyond our platform’s control,</li>
      <li>The sale or distribution of fake or counterfeit scratch cards.</li>
    </ul>
  </li>
  <li>
    <strong>Dispute Resolution</strong><br />
    While our dedicated support team is available to assist with account issues and transaction disputes, we cannot guarantee the resolution of disputes related to fraudulent cards or external payment failures.
  </li>
  <li>
    <strong>User Agreement</strong><br />
    By using our platform, you acknowledge and accept these terms and agree to take full responsibility for your transactions. We encourage all users to report suspicious activities or listings immediately.
  </li>
        </ul>
      </>
    ),
  },
  {
    key: "developer",
    label: "Developer",
    content: (
      <>
        <ScrollFloat>Developer</ScrollFloat>
        <div style={{ textAlign: "center", marginBottom: ".5rem" }}>
          {/* Developer image: Replace '/ram.jpg' with your actual image path or URL */}
          <img
            src="/ram.jpg"
            alt="Developer"
            style={{
              width: "180px", // doubled size from original 90px
              height: "180px", // doubled size
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "1rem",
              maxWidth: "40vw",
            }}
          />
          <h3
            style={{
              fontSize: "clamp(1.1rem,4vw,1.6rem)",
              color: "#6f42c1",
              marginBottom: "0.4rem",
              fontWeight: 800,
              letterSpacing: "0.01em",
            }}
          >
            Ram Charana Goud
          </h3>
          <p
            style={{
              fontSize: "clamp(.98rem,3vw,1.14rem)",
              lineHeight: 1.55,
              maxWidth: "92vw",
              margin: "0 auto",
            }}
          >
            Passionate full-stack developer specializing in building secure, scalable web applications
            with smooth UI/UX.
            <br />
            Reach out at{" "}
            <a
              href="mailto:ramgoud696@gmail.com"
              style={{ color: "#6f42c1", textDecoration: "underline", wordBreak: "break-word" }}
            >
              ramgoud696@gmail.com
            </a>
          </p>
        </div>
      </>
    ),
  },
];

const SimpleAboutTermsDeveloper = () => {
  const [selected, setSelected] = useState("about");
  const section = SECTIONS.find((s) => s.key === selected);

  return (
    <div
      style={{
        background: "#18181c",
        color: "#eee",
        minHeight: "100vh",
        width: "100vw",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
        padding: "3vw 5vw", // More room on mobile
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Toggle Buttons */}
      <div
        style={{
          display: "flex",
          gap: "0.7rem",
          margin: "1.2rem 0 2rem 0",
          justifyContent: "center",
          flexWrap: "wrap", // stack buttons on extra small screens
          width: "100%",
        }}
      >
        {SECTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            style={{
              background: selected === key ? "#6f42c1" : "#232329",
              color: selected === key ? "#fff" : "#d1c8ec",
              border: "none",
              borderRadius: "1rem",
              fontSize: "clamp(1.02rem, 4vw, 1.1rem)",
              fontWeight: 600,
              padding: "0.6em 1.5em",
              cursor: "pointer",
              boxShadow: selected === key ? "0 0 0 2px #6f42c13a" : "none",
              transition: "background 0.22s, color 0.22s",
              minWidth: "88px",
              marginBottom: "0.5rem", // for wrap/flex responsiveness
              touchAction: "manipulation",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Section */}
      <section
        style={{
          width: "100%",
          maxWidth: 760,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {section && section.content}
      </section>
    </div>
  );
};

export default SimpleAboutTermsDeveloper;

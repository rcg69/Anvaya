import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import "./style/contact.css";


const ScrollFloat = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const chars = el.querySelectorAll(".char");
    gsap.fromTo(chars,
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
    <h2 ref={containerRef} className="scroll-float">
      {splitText.map((char, idx) => (
        <span
          key={idx}
          className="char"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h2>
  );
};

const SECTIONS = [
  {
    key: "about",
    label: "About",
    content: (
      <>
        <ScrollFloat>About Us</ScrollFloat>
        <p className="section-text">
          Anvaya is a <strong>secure marketplace</strong> for buying and selling scratch cards. 
          We act as a trusted mediator—sellers post their scratch cards and buyers contact sellers 
          directly via email to arrange purchases. The platform focuses on 
          <strong> transparency</strong>, <strong>security</strong>, and empowering users with control
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
        <ul className="section-text" style={{ textAlign: "left", listStyleType: "disc", paddingLeft: "1.1em" }}>
          {/* Keep list styles inline or move to CSS if preferred */}
          <li><strong>General Commitment</strong><br />We are committed to providing a secure...</li>
          {/* rest of list */}
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
          <img src="/ram.jpg" alt="Developer" className="developer-img" />
          <h3 className="developer-name">Ram Charana Goud</h3>
          <p className="developer-desc">
            Passionate full-stack developer specializing in secure, scalable apps.
            <br />
            Reach out at{" "}
            <a href="mailto:ramgoud696@gmail.com" className="developer-email">
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
    <div className="app-container">
      <div className="toggle-buttons">
        {SECTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={`toggle-button ${selected === key ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>
      <section className="section-container">
        {section && section.content}
      </section>
    </div>
  );
};

export default SimpleAboutTermsDeveloper;

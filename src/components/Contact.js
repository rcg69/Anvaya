import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import "./style/contact.css";

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
          Anvaya is a <strong>secure marketplace</strong> for buying and selling
          scratch cards. We act as a trusted mediator—sellers post their scratch
          cards and buyers contact sellers directly via email to arrange
          purchases. The platform focuses on
          <strong> transparency</strong>, <strong>security</strong>, and
          empowering users with control over their transactions.
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
          className="section-text"
          style={{
            textAlign: "left",
            listStyleType: "disc",
            paddingLeft: "1.1em",
          }}
        >
          <li>
            <strong>Platform Role</strong>
            <br />
            Anvaya is a listing and facilitation platform only. We do not create,
            issue, verify, or guarantee the validity, authenticity, or usability
            of any coupon, voucher, or membership code (“Offers”) posted by
            users.
          </li>

          <li>
            <strong>Independent Sellers</strong>
            <br />
            All Offers are listed by independent sellers. Anvaya is not the seller
            and has no responsibility for the content, accuracy, or redemption
            success of any Offer.
          </li>

          <li>
            <strong>Buyer Responsibility</strong>
            <br />
            Buyers must review and verify the terms, conditions, eligibility, and
            expiry dates of any Offer before purchase.
          </li>

          <li>
            <strong>No Guarantee</strong>
            <br />
            Anvaya does not guarantee that any Offer will work as described or be
            redeemable at the intended store, platform, or service.
          </li>

          <li>
            <strong>Disputes &amp; Refunds</strong>
            <br />
            Any disputes or issues with Offers must be resolved directly between
            the buyer and seller. Anvaya is not responsible for providing refunds
            or compensation.
          </li>

          <li>
            <strong>Liability Limitation</strong>
            <br />
            By using Anvaya, you agree to hold Anvaya, its owners, and affiliates
            harmless from any claims, damages, losses, or liabilities arising from
            any transaction conducted on the platform.
          </li>

          <li>
            <strong>Prohibited Listings</strong>
            <br />
            Sellers must ensure they have the legal right to sell the Offer and
            that listing it does not violate the issuing company’s terms or any
            applicable laws.
          </li>

          <li>
            <strong>Acceptance of Terms</strong>
            <br />
            Use of the Anvaya platform implies acceptance of these Terms &amp;
            Conditions in full.
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
      <section className="section-container">{section && section.content}</section>
    </div>
  );
};

export default SimpleAboutTermsDeveloper;

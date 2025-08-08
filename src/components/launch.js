import React, { useEffect, useState } from "react";
import SplitText from "./SplitText";

// This hook detects screen width for switch
const useScreenType = () => {
  const [screenType, setScreenType] = useState("desktop");
  useEffect(() => {
    function handleResize() {
      setScreenType(window.innerWidth < 640 ? "mobile" : "desktop");
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return screenType;
};

const Launch = () => {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  // If screen width < 640px, use "words", else use "chars"
  const screenType = useScreenType();
  const splitType = screenType === "mobile" ? "words" : "chars";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        padding: "20px",
      }}
    >
      <SplitText
        text="ANVAYA THE PERFECT MARKET PLACE"
        className={`text-[2rem] sm:text-[2.5rem] md:text-[4rem] font-extrabold text-center text-white`}
        delay={100}
        duration={0.8}
        ease="power3.out"
        splitType={splitType}
        from={{ opacity: 0, y: 50 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        onLetterAnimationComplete={handleAnimationComplete}
      />
    </div>
  );
};

export default Launch;

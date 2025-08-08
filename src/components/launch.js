// launch.js
import React from "react";
import SplitText from "./SplitText";

const Launch = () => {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212", // dark background to match app theme
        padding: "20px",
      }}
    >
      <SplitText
  text="ANVAYA-THE PERFECT MARKET PLACE"
  // Half the previous font sizes
  className="text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] font-extrabold text-center text-[#bb86fc]"
  delay={100}
  duration={0.8}
  ease="power3.out"
  splitType="chars"
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

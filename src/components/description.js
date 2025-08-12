import React, { useState } from "react";

function Description({ descriptionText, descriptionImageUrl, altText }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="description-container">
      {descriptionImageUrl ? (
        <div className="description-image-wrapper">
          {!imageLoaded && <p>Loading image...</p>}
          <img
            src={descriptionImageUrl}
            alt={altText || "Description image"}
            style={{ display: imageLoaded ? "block" : "none", maxWidth: '100%', height: 'auto' }}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      ) : descriptionText ? (
        <p className="description-text">{descriptionText}</p>
      ) : (
        <p style={{ fontStyle: "italic" }}>No description available.</p>
      )}
    </div>
  );
}

export default Description;

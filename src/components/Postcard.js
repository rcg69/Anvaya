import React, { useState, useEffect } from "react";
import "./style/postcard.css";

function Postcard() {
  const [title, setTitle] = useState("");
  const [descriptionType, setDescriptionType] = useState("text"); // "text" or "image"
  const [description, setDescription] = useState("");
  const [descriptionImage, setDescriptionImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [posterEmail, setPosterEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fetchingLogo, setFetchingLogo] = useState(false);

  // Handle description image upload
  const handleDescriptionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDescriptionImage(file); // Actual file to be sent to backend
      setDescriptionType("image");
      setDescription(URL.createObjectURL(file)); // For preview
    }
  };

  // Fetch brand logo from Brandfetch API
  const fetchBrandLogo = async (brandName) => {
    if (!brandName.trim()) {
      setImageUrl("");
      return;
    }

    setFetchingLogo(true);

    try {
      const response = await fetch(
        `https://api.brandfetch.io/v2/search/${encodeURIComponent(brandName)}`,
        {
          headers: {
            Authorization: `WGAuGDL6Vp3uzOXrNthhX44KI513tiLNqMdUEGEo9K0=`, // Replace with your API key
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch brand data");
      }

      const data = await response.json();

      if (data.length > 0) {
        const brand = data[0];
        // Get logo URL (prefer svg or png format)
        let logoUrl = "";
        if (brand.logo) {
          logoUrl = brand.logo;
        } else if (brand.logos && brand.logos.length > 0) {
          const logosFormat = brand.logos[0].formats;
          if (logosFormat && logosFormat.length > 0) {
            logoUrl = logosFormat[0].src || "";
          }
        }
        setImageUrl(logoUrl);
      } else {
        setImageUrl("");
      }
    } catch (error) {
      console.error("Error fetching brand logo: ", error);
      setImageUrl("");
    } finally {
      setFetchingLogo(false);
    }
  };

  // Debounce fetch on title change
  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchBrandLogo(title);
    }, 500); // 500ms debounce

    return () => clearTimeout(timerId);
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }
    if (!expiryDate) {
      setErrorMessage("Expiry date is required.");
      return;
    }
    if (!posterEmail.trim()) {
      setErrorMessage("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(posterEmail)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    setLoading(true);

    try {
      if (descriptionType === "image") {
        if (!descriptionImage) {
          setErrorMessage("Please upload an image for the description.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("price", price);
        formData.append("expiryDate", expiryDate);
        formData.append("posterEmail", posterEmail);
        formData.append("imageUrl", imageUrl);
        formData.append("descriptionImage", descriptionImage);

        const res = await fetch(
          `https://final-backend-srja.onrender.com/api/scratchCards`,
          {
            method: "POST",
            body: formData, // Do NOT set Content-Type header; browser will handle
          }
        );

        if (res.ok) {
          setSuccessMessage("Card posted successfully!");
          resetForm();
        } else {
          const data = await res.json();
          setErrorMessage(data.error || "Failed to post card.");
        }
      } else {
        // descriptionType === "text"
        const payload = {
          title,
          description,
          imageUrl,
          price,
          expiryDate,
          posterEmail,
        };

        const res = await fetch(
          `https://final-backend-srja.onrender.com/api/scratchCards`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (res.ok) {
          setSuccessMessage("Card posted successfully!");
          resetForm();
        } else {
          const data = await res.json();
          setErrorMessage(data.error || "Failed to post card.");
        }
      }
    } catch (err) {
      setErrorMessage("Error posting card: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDescriptionImage(null);
    setImageUrl("");
    setPrice("");
    setExpiryDate("");
    setPosterEmail("");
    setDescriptionType("text");
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Post a new scratch card"
      className="postcard-form"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        aria-label="Title"
        name="title"
      />
      {fetchingLogo && <p>Fetching logo...</p>}

      {descriptionType === "text" ? (
        <>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            aria-label="Description"
            name="description"
          />
          <button
            type="button"
            onClick={() => setDescriptionType("image")}
            className="switch-desc-mode"
            aria-label="Switch to image description"
          >
            Upload Screenshot Instead
          </button>
        </>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleDescriptionImageChange}
            aria-label="Upload Description Image"
          />
          {description && (
            <img
              src={description}
              alt="Description Preview"
              className="desc-preview"
            />
          )}
          <button
            type="button"
            onClick={() => setDescriptionType("text")}
            className="switch-desc-mode"
            aria-label="Switch to text description"
          >
            Type Description Instead
          </button>
        </>
      )}

      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        aria-label="Image URL"
        name="imageUrl"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        aria-label="Price"
        name="price"
      />
      <input
        type="date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        aria-label="Expiry Date"
        name="expiryDate"
        required
      />
      <input
        type="email"
        value={posterEmail}
        onChange={(e) => setPosterEmail(e.target.value)}
        placeholder="Your Gmail"
        aria-label="Poster Email"
        name="posterEmail"
        required
      />
      <button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? "Posting..." : "Post Scratch Card"}
      </button>

      {errorMessage && (
        <div className="postcard-error" role="alert">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="postcard-success" role="status">
          {successMessage}
        </div>
      )}
    </form>
  );
}

export default Postcard;

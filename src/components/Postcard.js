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

  const BRAND_FETCH_CLIENT_ID = "curl --request GET \
      --url https://api.brandfetch.io/v2/search/{name}?c=1idsqhMY-pEi7lMzSNM"; // Replace with your actual client ID

  // Handle description image file selection and preview
  const handleDescriptionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDescriptionImage(file);
      setDescriptionType("image");
      setDescription(URL.createObjectURL(file));
    }
  };

  // Generate Brandfetch logo URL dynamically based on title input
  useEffect(() => {
    if (!title.trim()) {
      setImageUrl("");
      return;
    }

    // Create domain by simple normalization: lowercase, remove spaces, add .com
    const domain = `${title.toLowerCase().replace(/\s+/g, "")}.com`;

    const url = `https://cdn.brandfetch.io/${domain}/w/400/h/400?c=${BRAND_FETCH_CLIENT_ID}`;

    setImageUrl(url);
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic validation
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
            body: formData,
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
        placeholder="Image URL (auto-filled)"
        aria-label="Image URL"
        name="imageUrl"
         // optionally make this read-only to prevent accidental changes
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

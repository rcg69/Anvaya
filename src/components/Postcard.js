import React, { useState, useEffect, useRef } from "react";
import "./style/postcard.css";

function Postcard() {
  const [title, setTitle] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [descriptionType, setDescriptionType] = useState("text");
  const [description, setDescription] = useState("");
  const [descriptionImage, setDescriptionImage] = useState(null);
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [posterEmail, setPosterEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const apiKey = "WGAuGDL6Vp3uzOXrNthhX44KI513tiLNqMdUEGEo9K0="; // Your Brandfetch API key

  const debounceTimeoutRef = useRef(null);

  // Fetch brand suggestions with debounce
  useEffect(() => {
    if (!title.trim()) {
      setSuggestions([]);
      setImageUrl("");
      return;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(title);
    }, 400);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [title]);

  // Fetch suggestions from Brandfetch API
  const fetchSuggestions = async (searchTerm) => {
    setFetchingSuggestions(true);
    setErrorMessage("");
    try {
      const response = await fetch(
        `https://api.brandfetch.io/v2/search/${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch brand suggestions");
      }
      const data = await response.json();
      setSuggestions(data || []);
    } catch (error) {
      setErrorMessage("Error fetching brand suggestions.");
      setSuggestions([]);
    } finally {
      setFetchingSuggestions(false);
    }
  };

  // When a suggestion is clicked, fill in title and imageUrl
  const handleSelectSuggestion = (brand) => {
    setTitle(brand.name);
    const logoUrl = brand.icon || (brand.logos && brand.logos[0]?.formats[0]?.src) || "";
    setImageUrl(logoUrl);
    setSuggestions([]);
  };

  // Handle description image upload and preview
  const handleDescriptionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDescriptionImage(file);
      setDescriptionType("image");
      setDescription(URL.createObjectURL(file));
    }
  };

  // Handle form submission
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

        const res = await fetch(`https://final-backend-srja.onrender.com/api/scratchCards`, {
          method: "POST",
          body: formData,
        });

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

        const res = await fetch(`https://final-backend-srja.onrender.com/api/scratchCards`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

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
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Post a new scratch card" className="postcard-form" autoComplete="off">
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (brand name)"
          required
          aria-label="Title"
          name="title"
          autoComplete="off"
        />
        {fetchingSuggestions && <div style={{ position: "absolute", right: 10, top: 8 }}>Loading...</div>}
        {suggestions.length > 0 && (
          <ul
            className="suggestions-list"
            style={{
              listStyle: "none",
              margin: 0,
              padding: "0.5em",
              border: "1px solid #ccc",
              maxHeight: "150px",
              overflowY: "auto",
              background: "white",
              position: "absolute",
              width: "100%",
              zIndex: 1000,
            }}
            role="listbox"
          >
            {suggestions.map((brand) => (
              <li
                key={brand.brandId || brand.name}
                onClick={() => handleSelectSuggestion(brand)}
                role="option"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSelectSuggestion(brand);
                    e.preventDefault();
                  }
                }}
                style={{ cursor: "pointer", padding: "0.2em 0" }}
                aria-selected={title === brand.name}
              >
                {brand.icon && (
                  <img
                    src={brand.icon}
                    alt={`${brand.name} logo`}
                    style={{ width: 20, height: 20, objectFit: "contain", marginRight: 8, verticalAlign: "middle" }}
                  />
                )}
                {brand.name}
              </li>
            ))}
          </ul>
        )}
      </div>

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
          <input type="file" accept="image/*" onChange={handleDescriptionImageChange} aria-label="Upload Description Image" />
          {description && <img src={description} alt="Description Preview" className="desc-preview" />}
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
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL (auto-filled on brand selection)"
        aria-label="Image URL"
        name="imageUrl"
        readOnly
      />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" aria-label="Price" name="price" />
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
        placeholder="Your Email"
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

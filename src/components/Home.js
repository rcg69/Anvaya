import React, { useState, useEffect, useRef } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./style/Home.css";

function Home() {
  const [scratchCards, setScratchCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "https://final-backend-srja.onrender.com";

  const bannerImages = [
    "https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/e9512ab9-474c-49b4-9b56-1d004a582fd5._CR0%2C0%2C3000%2C600_SX1500_.jpg",
    "https://www.agoda.com/press/wp-content/uploads/2025/02/screenshot.png",
    "https://www.abhibus.com/blog/wp-content/uploads/2023/05/abhiubs-logo-696x423.jpg",
    "https://businessmodelnavigator.com/img/case-firms-logos/42.png",
    "https://palmonas.com/cdn/shop/files/web_link_creative_2.jpg?v=1738936545",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_m9RRzlBWRBBpX39bUde7w0vwFN2IUpW68A&s",
  ];

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/scratchCards`);
        if (!response.ok) throw new Error("Failed to fetch scratch cards.");
        const data = await response.json();
        setScratchCards(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [BACKEND_URL]);

  const BannerSlider = ({ images, interval = 6000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const filteredImages = windowWidth <= 600 ? images.slice(1) : images;

    useEffect(() => {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
      }, interval);
      return () => clearTimeout(timeoutRef.current);
    }, [currentIndex, filteredImages.length, interval]);

    const dynamicStyle = {
      height: windowWidth <= 600 ? "30vh" : "50vh",
      maxHeight: windowWidth <= 600 ? 200 : 300,
    };

    return (
      <section className="banner-slider" style={dynamicStyle}>
        {filteredImages.map((src, idx) => {
          const isActive = idx === currentIndex;
          return (
            <img
              key={idx}
              src={src}
              alt={`Banner ${windowWidth <= 600 ? idx + 2 : idx + 1}`}
              loading="lazy"
              style={{
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
                zIndex: isActive ? 2 : 0,
              }}
            />
          );
        })}
      </section>
    );
  };

  const handleDescriptionClick = (cardId) => {
    setExpandedCardId((prevId) => (prevId === cardId ? null : cardId));
  };

  // Prepare slides for lightbox
  const lightboxSlides = scratchCards
    .filter((card) => card.descriptionImageUrl)
    .map((card) => ({
      src: `${BACKEND_URL}${card.descriptionImageUrl}`,
      alt: card.title || "Description Image",
    }));

  const openLightboxForCard = (cardId) => {
    const index = scratchCards
      .filter((c) => c.descriptionImageUrl)
      .findIndex((c) => c._id === cardId);
    if (index >= 0) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  return (
    <div className="app-outer-wrapper">
      <main className="home-main" tabIndex={-1}>
        <BannerSlider images={bannerImages} interval={6000} />

        <h2 className="main-heading">All Scratch Cards</h2>

        {error && <div className="error-text" role="alert">{error}</div>}
        {loading && <div className="loading-text">Loading scratch cards...</div>}

        {!loading && !error && (
          <div className="scratch-cards-wrapper">
            {scratchCards.length === 0 && (
              <p style={{ textAlign: "center" }}>No cards available.</p>
            )}
            <div className="scratch-cards-grid">
              {scratchCards.map((card, idx) => {
                const isExpanded = expandedCardId === card._id;
                return (
                  <article
                    key={card._id || idx}
                    className="scratch-card"
                    tabIndex={0}
                    aria-label={`Scratch card: ${card.title || "Untitled"}`}
                  >
                    {card.imageUrl && (
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="scratch-card-img"
                        loading="lazy"
                      />
                    )}
                    <h3 className="scratch-card-title">{card.title}</h3>

                    {/* Description click logic */}
                    <div
                      className="scratch-card-description-wrapper"
                      onClick={() => handleDescriptionClick(card._id)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      style={{ cursor: "pointer" }}
                    >
                      {isExpanded ? (
                        card.descriptionImageUrl ? (
                          <img
                            src={`${BACKEND_URL}${card.descriptionImageUrl}`}
                            alt={`${card.title} description`}
                            className="description-image-expanded"
                            onClick={(e) => {
                              e.stopPropagation();
                              openLightboxForCard(card._id);
                            }}
                            style={{ cursor: "zoom-in" }}
                          />
                        ) : card.description ? (
                          <p className="scratch-card-description">{card.description}</p>
                        ) : (
                          <p
                            className="scratch-card-description"
                            style={{ fontStyle: "italic" }}
                          >
                            No description available.
                          </p>
                        )
                      ) : (
                        <p className="scratch-card-description scratch-card-description-collapsed">
                          {card.descriptionImageUrl
                            ? "Click to view description image"
                            : card.description
                            ? card.description.length > 100
                              ? `${card.description.slice(0, 100)}...`
                              : card.description
                            : "No description available"}
                        </p>
                      )}
                    </div>

                    {card.price && <p className="scratch-card-price">Price: ₹{card.price}</p>}
                    {card.posterEmail && (
                      <p className="scratch-card-poster">
                        Posted by: <a href={`mailto:${card.posterEmail}`}>{card.posterEmail}</a>
                      </p>
                    )}
                    {card.expiryDate && (
                      <p className="scratch-card-expiry">
                        Expires on: {new Date(card.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Lightbox modal */}
        {lightboxOpen && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            slides={lightboxSlides}
            index={lightboxIndex}
            on={{
              view: ({ index }) => setLightboxIndex(index),
            }}
          />
        )}
      </main>
    </div>
  );
}

export default Home;

import React, { useState, useEffect, useRef } from "react";
import "./style/mylist.css";

const bannerImages = [
  "https://palmonas.com/cdn/shop/files/daily_ware_c32bcc0d-4cd5-41c3-8868-e24936980c93.jpg?v=1752847287&width=1500",
  "https://w0.peakpx.com/wallpaper/211/633/HD-wallpaper-starbucks-coffee-brands-cafe-green-men-simple-women.jpg",
  "https://pbs.twimg.com/media/DENKKAuUQAEEsKN.jpg:large",
  "https://www.trueblueadvisory.com/wp-content/uploads/2022/06/case-study_0012_ajio.jpg",
  "https://palmonas.com/cdn/shop/files/lgd_mob_2_7c31140d-dffe-4b90-b03a-8ff410349811.webp?v=1744178192&width=750",
  "https://variety.com/wp-content/uploads/2019/03/netflix-logo-n-icon.png?w=1000&h=667&crop=1"
];

function BannerSlideshow({ images, direction = "left", initialIndex = 0, controlIndex, onIndexChange }) {
  const [index, setIndex] = useState(initialIndex);
  const timeoutRef = useRef();

  useEffect(() => {
    if (typeof controlIndex === "number") {
      setIndex(controlIndex);
    }
  }, [controlIndex]);

  useEffect(() => {
    if (typeof controlIndex === "number") return;
    timeoutRef.current = setTimeout(() => {
      setIndex(prev => {
        const next = (prev + 1) % images.length;
        if (onIndexChange) onIndexChange(next);
        return next;
      });
    }, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [index, images.length, controlIndex, onIndexChange]);

  return (
    <div className="banner-container">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`banner-${i}`}
          draggable="false"
          className="banner-img"
          style={{
            opacity: i === index ? 1 : 0,
            transform: i === index ? "translateX(0)" :
              direction === "left" ? "translateX(-110%)" : "translateX(110%)",
            zIndex: i === index ? 2 : 1
          }}
        />
      ))}
    </div>
  );
}

export default function Mylist() {
  const [cards, setCards] = useState([]);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [mainBannerIndex, setMainBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      const saved = sessionStorage.getItem("mylistCards");
      if (saved) {
        setCards(JSON.parse(saved));
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("mylistCards", JSON.stringify(cards));
  }, [cards]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!cardNumber.trim() || !cardName.trim()) return;
    setCards(prev => [...prev, { id: Date.now(), number: cardNumber.trim(), name: cardName.trim() }]);
    setCardNumber("");
    setCardName("");
  };

  const handleRemove = (id) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  return (
    <div className="mylist-wrapper">
      <div className="mylist-inner">
        <BannerSlideshow
          images={bannerImages}
          direction="left"
          initialIndex={mainBannerIndex}
          onIndexChange={setMainBannerIndex}
        />

        <div className="mylist-card">
          <h2 className="mylist-title">My List</h2>

          <form onSubmit={handleAdd} className="mylist-form">
            <input
              type="email"
              placeholder="Poster mail"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="mylist-input"
              required
            />
            <input
              type="text"
              placeholder="Card Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="mylist-input"
              required
            />
            <button type="submit" className="mylist-btn">
              Add Card
            </button>
          </form>

          {loading ? (
            <p className="loading-text">Loading your list...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : cards.length === 0 ? (
            <p className="empty-text">No favorite cards yet. Add one above!</p>
          ) : (
            <ul className="mylist-ul">
              {cards.map(({ id, number, name }) => (
                <li key={id} className="mylist-li">
                  <div>
                    <strong className="mylist-card-name">{name}</strong>
                    —{" "}
                    <a href={`mailto:${number}`} className="mylist-email" target="_blank" rel="noopener noreferrer">
                      {number}
                    </a>
                  </div>
                  <button onClick={() => handleRemove(id)} className="remove-btn">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <BannerSlideshow
          images={bannerImages}
          direction="right"
          controlIndex={(mainBannerIndex + 1) % bannerImages.length}
        />
      </div>
    </div>
  );
}

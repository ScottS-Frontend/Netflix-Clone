import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import cards_data from "../../assets/cards/cards_data";
import { Link } from "react-router-dom";

const TitleCard = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
  const controller = new AbortController();

  async function load() {
    try {
      const path = `movie/${category ? category : "now_playing"}`;

      const isProd = import.meta.env.PROD;

      const url = isProd
        ? `/api/tmdb?path=${encodeURIComponent(path)}&language=en-US&page=1`
        : `https://api.themoviedb.org/3/${path}?language=en-US&page=1`;

      const opts = isProd
        ? { signal: controller.signal }
        : {
            signal: controller.signal,
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER_TOKEN}`,
            },
          };

      const res = await fetch(url, opts);

      
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("TMDB response was not JSON:", text.slice(0, 200));
        setApiData([]);
        return;
      }

      const data = await res.json();
      setApiData(data?.results || []);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("TMDB fetch error:", err);
      }
      setApiData([]);
    }
  }

  load();

  const el = cardsRef.current;
  el?.addEventListener("wheel", handleWheel);

  return () => {
    controller.abort();
    el?.removeEventListener("wheel", handleWheel);
  };
}, [category]);


  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          return (
            <Link to={`/player/${card.id}`} className="card" key={card.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path}
                alt={card.original_title}
              />
              <p>{card.original_title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TitleCard;

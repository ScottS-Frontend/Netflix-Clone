import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import cards_data from "../../assets/cards/cards_data";
import { Link } from "react-router-dom";

const TitleCard = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMWJhNjVhMGJjMzEyMmM3MWMxNGRkODgyY2JjOTM2YiIsIm5iZiI6MTc2OTYzNDI1NS42NjMsInN1YiI6IjY5N2E3OWNmMjAzZWIzYWU4OTFmMzZkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1MMcelwR2Yj3dc-t-a7vlseJ8O9dDDTe1-8uBfXwQ-c",
    },
  };

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US&page=1`,
      options,
    )
      .then((res) => res.json())
      .then((res) => setApiData(res.results))
      .catch((err) => console.error(err));

    cardsRef.current.addEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          return (
            <Link to={`/player/${card.id}`} className="card" key={index}>
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

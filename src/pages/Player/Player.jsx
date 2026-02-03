import React, { useEffect, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
import { useNavigate, useParams } from "react-router-dom";

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: "",
  });

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMWJhNjVhMGJjMzEyMmM3MWMxNGRkODgyY2JjOTM2YiIsIm5iZiI6MTc2OTYzNDI1NS42NjMsInN1YiI6IjY5N2E3OWNmMjAzZWIzYWU4OTFmMzZkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1MMcelwR2Yj3dc-t-a7vlseJ8O9dDDTe1-8uBfXwQ-c",
    },
  };

  useEffect(() => {
    if (id === "hero") {
      setApiData({
        name: "Hero Trailer",
        key: "80dqOwAOhbo",
        published_at: "",
        type: "Trailer",
      });
      return;
    }

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      options,
    )
      .then((res) => res.json())
      .then((res) => {
        const results = res?.results || [];

        const trailer =
          results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
          results.find((v) => v.site === "YouTube");

        if (!trailer) {
          console.warn("No YouTube video found for movie:", id);
          setApiData({
            name: "No trailer found",
            key: "",
            published_at: "",
            type: "",
          });
          return;
        }

        setApiData(trailer);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt=""
        onClick={() => {
          navigate("/");
        }}
      />
      {apiData.key ? (
        <iframe
          width="90%"
          height="90%"
          src={`https://www.youtube.com/embed/${apiData.key}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1`}
          title="trailer"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      ) : (
        <div style={{ color: "white", padding: 20 }}>No trailer available.</div>
      )}

      <div className="player_info">
        <p>{apiData.published_at ? apiData.published_at.slice(0, 10) : ""}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>
    </div>
  );
};

export default Player;

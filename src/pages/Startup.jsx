import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import heroImage from "../assets/images/background-startup.png";
import "../assets/styles/Startup.css";

const Startup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Periksa apakah token ada di localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Arahkan ke halaman recommendations jika token ada
      navigate("/recommendations");
    }
  }, [navigate]);

  return (
    <div className="startup-page">
      {/* Header */}
      <Header type="startup" />

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10, 25, 41, 0.2), rgba(10, 25, 41, 0.5)), url(${heroImage})`,
        }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            Find the Perfect Movie That Matches Your Mood!
          </h1>
          <p className="hero-description">
            Hi there! Welcome to DUMovies, your ultimate destination for movie
            recommendations that match your vibe. Feeling happy, sad, or in
            need of motivation? Don’t worry, we’ve got a list of movies that
            suit everyone. Start your movie adventure now and let DUMovies be
            your go-to companion for the perfect movie night!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Startup;

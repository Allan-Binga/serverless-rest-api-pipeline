import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./home.css";

const Home = () => {
  return (
    <div className="page-container">
      <Navbar />
      <div className="content-wrapper">
        <div className="home-container">
          <h1 className="home-title">Welcome to AWS workout API</h1>
          <p className="home-text">
            This is the main page. Please explore the navgation buttons above to
            get started.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

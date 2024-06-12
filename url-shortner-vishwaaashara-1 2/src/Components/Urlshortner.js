import React, { useState } from "react";
import "../Components/shortner.css";
import axios from "axios";


function Urlshortner() {
  const [userInput, setUserInput] = useState("");
  const [shortenedLink, setShortenedLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  

  const isValid = (url) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(url);
  };


  const handleShorten = async () => {


    try {
      console.log("inside try")
      if (userInput === "") {
        setErrorMessage("Please enter a valid URL");
        return;
      }
      if (!isValid(userInput)) {
        setErrorMessage("URL is not valid, please enter a valid URL");
        return errorMessage;
      }
      const response = await axios.post(`${backendUrl}/shorten`, {
        originalUrl: userInput,
      });
      setShortenedLink(response.data.shortURL);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("error");
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedLink);
    alert("Link copied");
  };



  return (
    <div className="container">
      <h1>
        URL <span>Shortner</span>
      </h1>

      <div className="internal-div">
        <input
          className="input-field"
          type="text"
          placeholder="Paste your link"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
            setErrorMessage("");
          }}
        />
        <button className="URL-button" onClick={handleShorten} >
          Shorten
        </button>
      </div>
      <div className="result-div">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {shortenedLink && (
          <div className="copy-container">
            <input type="text" className="input-field" value={shortenedLink} readOnly />
            <button
              className="copy-button"
              onClick={() => {
                handleCopy()
                // alert("Link copied");
              }}
            >
              <i className="fa-solid fa-copy"></i>
            </button>
            
          </div>
        )}
       
      </div>
    </div>
  );
}

export default Urlshortner;

import axios from "axios";
import React, { useState, useEffect, use } from "react";
import { useForm } from "./FormContext";

const getAds = async (brand, setAdsAvailable, setLoading) => {
  try {
    const params = new URLSearchParams(window.location.search);
    const response = await axios.get(
      `https://mcx1tnv7fcf44mqd4yq183z2hjy4.pub.sfmc-content.com/n0mgaoznwq1?brand=${!brand  || brand.includes("Select")? "Default" : brand}&qs=${params.get("qs")}`
    );
    console.log(response);
    
    if (response.data.status === "success" && response.data.results) {
      return response.data.results.map((val) => ({
        image: val.Image_URL,
        url: val.Redirect_URL,
        title: val.Heading,
        description: val.Description,
        id: val.Id,
      }));
      setAdsAvailable(true);
    }else{
      console.log('here');
      setAdsAvailable(false);
      setLoading(false);
    }
  } catch (e) {
    console.error("Error fetching ads:", e);
  }
  return [];
};

const Ad = () => {
  const { formData } = useForm();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [ads, setAds] = useState([]);
  const [prevAds, setPrevAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimMessage, setClaimMessage] = useState("");
  const [adClicked, setAdClicked] = useState(false);
  const [adsAvailable, setAdsAvailable] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      const adsData = await getAds(formData.Q001, setAdsAvailable, setLoading);
      if (adsData.length > 0) {
        setPrevAds(ads);
        setTimeout(() => {
          setAds(adsData);
          setCurrentAdIndex(0);
          setLoading(false);
        }, 1000);
      }
    };
    fetchAds();
  }, [formData.Q001]);

  useEffect(() => {
    if (ads.length === 0 || adClicked) {
        return;
    }
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [ads, adClicked]);

  const claimAd = async (adId) => {
    try {
      const response = await axios.post("http://cloud.mail.conx.digital/claimAd", {
        "submissionId":formData.submissionId,
        "AdId": adId,
        "Category": formData.Q001
      });
      if (response.data.status === "success") {
        setClaimMessage("🎉 You’ve successfully claimed this offer! You will receive an email shortly with the coupon code");
        setAdClicked(true);
        setTimeout(() => setClaimMessage(""), 8000)
      } else {
        handleClaimError(response.data.status);
        setTimeout(() => setClaimMessage(""), 3000)
      }
    } catch (err) {
        
    }
  };

  const handleClaimError = (message) => {
    if (message.includes("already claimed")) {
      setClaimMessage("⚠️ You’ve already claimed this offer before.");
    } else if (message.includes("Form not submitted")) {
      setClaimMessage("📋 Please submit your details before claiming an ad.");
    } else {
      setClaimMessage("🚫 Unable to claim the ad. Please try again later.");
    }
  };

  const displayedAds = ads.length > 0 ? ads : prevAds;

  if (loading) {
    return (
      <div className="flex items-center justify-center space-x-1 h-96 w-full">
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
      </div>
    );
  }

  return (
    
    <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl mb-8 overflow-hidden">
      {adsAvailable && 
      <div className="relative w-full h-96 overflow-hidden cursor-pointer" onClick={() => claimAd(displayedAds[currentAdIndex]?.id)}>
        <img
          src={displayedAds[currentAdIndex]?.image}
          alt="Loading..."
          className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-40 text-white p-6">
          <h2 className="text-4xl font-extrabold mb-2 tracking-wider drop-shadow-lg">
            {displayedAds[currentAdIndex]?.title}
          </h2>
          <p className="text-lg font-semibold drop-shadow-md">
            {displayedAds[currentAdIndex]?.description}
          </p>
        </div>
      </div>
      }
      {claimMessage && (
        <div className="text-center p-4 bg-blue-100 text-blue-800 font-medium">
          {claimMessage}
        </div>
      )}
    </div>
  );
};

export default Ad;

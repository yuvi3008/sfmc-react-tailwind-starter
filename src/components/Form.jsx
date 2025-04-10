import React, {useState } from "react";
import Ad from "./Ad";
import Header from "./Header";
import Questions from "./Questions";


const Form = () => {
  return (
    // <div className="flex flex-col items-center min-h-screen bg-black p-6">
    //   <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
    //     <Ad brand />
    //     <Header />
    //     <Questions />
    //   </div>
    // </div>
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-gray-950 to-black flex items-center justify-center">
      <div className="bg-white border border-gray-700 shadow-[-10px_10px_30px_white] rounded-2xl p-10 w-full max-w-xl">
        <Ad/>
        <Questions/>
    </div>
  </div>
  );
};

export default Form;

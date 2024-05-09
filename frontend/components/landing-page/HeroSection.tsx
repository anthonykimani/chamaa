import Image from "next/image";
import React from "react";
import { HeroImg } from "@/constants/svg";

const HeroSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-5 md:py-10 md:px-20">
      <article className="text-black flex flex-col justify-around md:justify-center h-[500px]">
        <h1 className="text-5xl lg:text-6xl font-semibold md:my-[20px]">
          Hifadhi <span className="text-aqua">Savings </span>Platform
        </h1>
        <h2 className="md:my-[20px]">
          Our Mission: To empower Africa with Micro savings technology, offering
          a secure alternative to traditional mobile money services.
        </h2>
        <button className=" py-3 px-6 w-[150px] rounded-full border bg-aqua text-black font-semibold hover:bg-white hover:border-aqua hover:cursor-pointer">
          Launch App
        </button>
      </article>
      <Image src={HeroImg} alt="nexus-logo" className="w-full md:w-[50%]" />
    </div>
  );
};

export default HeroSection;

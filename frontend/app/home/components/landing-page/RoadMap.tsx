import { RoadMapImg } from "@/constants/svg";
import Image from "next/image";
import React from "react";

const RoadMap = () => {
  return (
    <section className="flex flex-col items-center font-jakarta py-[50px]">
      <h3 className="text-aqua font-semibold text-xl">OUR ROADMAP</h3>
      <h2 className="text-black text-center text-3xl xsm:text-[40px] font-bold my-5">
        Lets Visualize the Journey
      </h2>
      <Image src={RoadMapImg} alt="roadmapimg" className="mt-10" />
    </section>
  );
};

export default RoadMap;

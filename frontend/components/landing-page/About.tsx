import { AboutImg } from "@/constants/svg";
import { aboutSource } from "@/helpers/aboutSource";
import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <section className="flex flex-col items-center font-jakarta">
      <h3 className="text-aqua font-semibold text-xl">WHY USE HIFADHI</h3>
      <h2 className="text-black text-center text-3xl xsm:text-[40px] font-bold my-2">
        Easy, Simple, Affordable
      </h2>
      <h4 className="text-[#596780ab] text-center text-base xsm:text-lg md:text-xl">
        Empowering the African community through inclusive savings, providing
        exclusive futures for every individual.
      </h4>
      <div className="flex flex-col md:flex-row items-center p-5 md:py-10 md:px-20">
        <article className="text-black flex flex-col justify-around md:justify-around lg:h-[500px]">
          {aboutSource.map((element, index) => {
            return (
              <div
                key={index}
                className="flex flex-col xsm:flex-row xsm:my-2 items-start"
              >
                <Image
                  src={element.icon}
                  alt="wallet"
                  className="my-5 xsm:m-0"
                />
                <span className="px-0 xsm:px-5">
                  <h3 className="text-black font-semibold text-xl xsm:text-2xl">
                    {element.title}
                  </h3>
                  <p className="text-[#596780] mt-2">{element.subtitle}</p>
                </span>
              </div>
            );
          })}
        </article>
        <Image src={AboutImg} alt="nexus-logo" className="w-full md:w-[50%]" />
      </div>
    </section>
  );
};

export default About;

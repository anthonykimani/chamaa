import { featureSource } from "@/helpers/featureSource";
import Image from "next/image";
import React from "react";

const Features = () => {
  return (
    <section className="bg-aqua text-black font-jakarta  p-5 md:py-10 md:px-20">
      <article className="flex flex-col xsm:flex-row py-5">
        <h2 className="text-white text-3xl md:text-4xl lg:text-5xl">
          Overview of Our Savings Products
        </h2>
        <h3 className="text-lg">
          Empowering the Kenyan community through inclusive savings, providing
          exclusive futures for every individual.
        </h3>
      </article>
      <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {featureSource.map((element, index) => {
          return (
            <div key={index} className="bg-white w-auto lg:h-[300px] p-4 flex flex-col justify-around rounded">
              <Image src={element.icon} alt={element.title} />
              <h3 className="text-black font-semibold text-xl xsm:text-2xl">{element.title}</h3>
              <h4 className="text-[#596780]">{element.subtitle}</h4>
            </div>
          );
        })}
      </article>
    </section>
  );
};

export default Features;

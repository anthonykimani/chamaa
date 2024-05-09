import { teamSource } from "@/helpers/teamSource";
import { XLogo } from "@phosphor-icons/react";
import Image from "next/image";
import React from "react";

const Team = () => {
  return (
    <section className="flex flex-col items-center font-jakarta py-[50px]">
      <h3 className="text-aqua font-semibold text-xl">OUR TEAM</h3>
      <h2 className="text-black text-center text-3xl xsm:text-[40px] font-bold my-5">
      Meet The Team  Building Hifadhi
      </h2>
      <article className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-4 gap-2 mt-10">
        {teamSource.map((element, index) => {
          return (
            <div key={index} className="flex flex-col items-center justify-around">
              <Image src={element.img} alt={element.name} width={100} height={100} className="rounded-full" />
              <h3 className="text-black font-semibold text-xl xsm:text-2xl">
                {element.name}
              </h3>
              <h4 className="text-[#596780] text-center">{element.title}</h4>
            </div>
          );
        })}
      </article>
    </section>
  );
};

export default Team;

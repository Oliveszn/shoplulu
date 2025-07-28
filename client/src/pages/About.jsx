import React from "react";
import Footer from "../components/common/Footer";
import { Blurhash } from "react-blurhash";

const About = () => {
  return (
    <div>
      <div className="relative">
        {/* <Blurhash
          hash="L4840yEL0L~DD$9sIo?H0z-q^*D%"
          width={400}
          height={300}
          resolutionX={100}
          resolutionY={100}
          punch={1}
          style={{ width: "100%", height: "100%" }}
        /> */}
        <img
          src="images/about.jpg"
          className="storeimg"
          alt=""
          loading="lazy"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto px-6 md:px-8 py-8 md:py-18">
        <div className="flex flex-col gap-8 md:gap-16 text-[#1A0C0B] text-sm font-light">
          <div className="md:w-3/4">
            <p className="uppercase text-left">
              At shoplulu, we believe that fashion is an expression of
              individuality and artistry. We strive to create exquisite garments
              that embody sophistication and elevate the wearer’s unique style.
              Our dedication to craftsmanship and attention to detail ensure
              that every piece in our collection is a masterpiece.
            </p>
          </div>
          <div className="md:w-3/4 ml-auto">
            <p className="uppercase text-right">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid
              animi mollitia corrupti fuga consequuntur repudiandae suscipit,
              distinctio, officia ea quidem accusantium nihil fugiat iusto!
              Accusantium veritatis vero eveniet obcaecati expedita! Accusantium
              veritatis vero eveniet obcaecati expedita!
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;

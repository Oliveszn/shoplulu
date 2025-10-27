import { Blurhash } from "react-blurhash";
import Image, { buildImageSrc } from "../components/common/Image";
import { HeadProvider, Title, Meta } from "react-head";

const About = () => {
  return (
    <div>
      <HeadProvider>
        <Title>About - Shoplulu</Title>
        <Meta name="description" content="Luxury fashion at Shoplulu" />
      </HeadProvider>
      <div className="relative">
        <img src="images/about.jpg" className="storeimg" alt="" />

        <div className="flex items-center justify-center text-center absolute inset-0">
          <p className="uppercase text-white text-3xl md:text-4xl lg:text-6xl font-medium">
            Our story
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto px-6 md:px-8 py-8 md:py-18 items-stretch">
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
    </div>
  );
};

export default About;

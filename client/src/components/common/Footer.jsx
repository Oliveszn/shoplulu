import React from "react";

const Footer = () => {
  return (
    <div className="bg-[#000000] py-10">
      <div className="mx-auto container p-8 bg-[#ffffff] ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
          {/* Newsletter Section */}
          <div className="flex flex-col gap-3 md:px-8">
            <h3 className="text-base font-medium mb-6">
              GET 10% OFF YOUR NEXT ORDER
            </h3>
            <form className="flex flex-col space-y-10">
              <div className="form-group">
                <label htmlFor="name"></label>
                <input
                  type="text"
                  id="name"
                  placeholder="NAME"
                  className="outline-none border-b"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email"></label>
                <input
                  type="email"
                  id="email"
                  placeholder="EMAIL"
                  className="outline-none border-b"
                />
              </div>
              <button
                type="submit"
                className="bg-[#000000] text-white whitespace-nowrap text-xs hover:bg-[white] border-2 hover:text-[#000000] py-3 cursor-pointer"
              >
                SUBSCRIBE TO OUR NEWSLETTER
              </button>
              <p className="text-xs font-light uppercase">
                *By signing up, you agree to receive emails about HighFashion
                and our other terms.
              </p>
            </form>
          </div>

          {/* <hr className="transform rotate-90" /> */}

          <hr className="block md:hidden" />
          {/* Shop Categories */}
          <div className="flex flex-col gap-3 md:px-8">
            <h3 className="text-base font-medium">SHOP HERE</h3>
            <ul className="text-xs font-light list-none p-0 m-0 flex flex-col gap-3 cursor-pointer">
              <li className="hover:opacity-50">ALL ITEMS</li>
              <li className="hover:opacity-50">MEN</li>
              <li className="hover:opacity-50">FEMALE</li>
              <li className="hover:opacity-50">ACCESSORIES</li>
              <li className="hover:opacity-50">COLLECTIONS</li>
            </ul>
          </div>
          <hr className="block md:hidden" />
          {/* Quick Links */}
          <div className="flex flex-col gap-3 md:px-8">
            <h3 className="text-sm font-medium">QUICK LINKS</h3>
            <ul className="text-xs font-light list-none p-0 m-0 flex flex-col gap-3 cursor-pointer">
              <li className="hover:opacity-50">ABOUT US</li>
              <li className="hover:opacity-50">OUR WALK-IN STORE</li>
              <li className="hover:opacity-50">FAQS</li>
              <li className="hover:opacity-50">POLICIES</li>
              <li className="hover:opacity-50">YOUR ACCOUNT</li>
            </ul>
          </div>
          <hr className="block md:hidden" />
          {/* Contact Info */}
          <div className="flex flex-col gap-3 text-[#181c18] md:px-8">
            <h3 className="text-sm font-light">CONTACT</h3>
            <address className="text-xs font-light">
              Shop 38/39, Palms Shopping Mall,
              <br />
              <br />
              Admiralty way, Lagos, Nigeria.
              <br />
              <br />
            </address>
            <div className="text-xs font-light">
              Operating hours:
              <br />
              <br />
              Monday - Saturday (10am - 10pm)
              <br />
              <br />
              Sunday (12pm - 10pm)
            </div>
            <br />
            <br />
            <a href="tel:+2349131058119">+234 919 444 55</a>
          </div>
          <hr className="block md:hidden" />
          <div className="col-span-full mt-4">
            <hr className="hidden md:block" />
            <p className="mt-4"> © 2025. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

import { HeadProvider, Title, Meta } from "react-head";
const Store = () => {
  return (
    <div>
      <HeadProvider>
        <Title>Our Store</Title>
        <Meta name="description" content="Luxury fashion at Shoplulu" />
      </HeadProvider>
      <div className="relative">
        <img src="images/store.png" className="storeimg" alt="" />

        <div className="absolute inset-0 flex items-center justify-center text-center ">
          <div className=" text-white p-6 rounded-lg max-w-md">
            <p className="text-xl font-bold mb-2">WALK INTO OUR STORE</p>
            <p className="mb-4">
              Shop 8/9, Palms Shopping Mall, Admiralty way, Lagos, Nigeria.
            </p>
            <p>
              Operating hours:
              <br />
              Monday Saturday (10am -10pm)
              <br />
              Sunday (12pm-10pm)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;

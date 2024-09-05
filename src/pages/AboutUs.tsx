const AboutUs = () => {
  return (
    <div className="min-h-screen mt-18 pt-20 text-lg px-20 bg-[#f7f8fa]">
      <h1 className="font-bold text-lg text-darkgrey text-center mb-5">
        ABOUT US
      </h1>
      <div>
        <div className="bg-white  text-darkgrey">
          <p className="text-center  text-black">
            At Pickele, we’re creating a unique platform that aims to connect
            interior designers with customers. Why join us?
          </p>
          <br />
          <ul className="flex flex-wrap gap-14 items-center justify-center p-10">
            <li className="flex flex-col items-center justify-center">
              <p className="font-bold  text-xl">Completely Free </p>
              <p className="text-sm text-black">
                No cost to join or use the platform.
              </p>
            </li>
            <li className="flex flex-col items-center justify-center  text-xl">
              <p className="font-bold ">Showcase Your Work</p>
              <p className="text-sm text-black">
                A free space to display your portfolio.
              </p>
            </li>
            <li className="flex flex-col items-center justify-center text-xl">
              <p className="font-bold ">Increased Visibility </p>
              <p className="text-sm text-black">
                Gain higher visibility and free advertising.
              </p>
            </li>
            <li className="flex flex-col items-center justify-center text-xl">
              <p className="font-bold ">More Business Inquiries </p>
              <p className="text-sm text-black">
                Attract more potential clients and grow your business.
              </p>
            </li>
            <li className="flex flex-col items-center justify-center text-xl">
              <p className="font-bold ">New features</p>
              <p className="text-sm text-black">
                Regular updates to the website almost daily.
              </p>
            </li>
          </ul>
        </div>
        <br />
        <p className="text-center">
          Where to view? The best experience for website is currently on web. We
          are building the mobile experience and shipping it to you soon!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const BackgroundOverlay: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return <div className="bg-[#ffffff] min-h-screen">{children}</div>;
};

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <BackgroundOverlay>
        <Navbar />
        <div className="z-3 relative flex flex-grow flex-col">{children}</div>
        <Footer />
      </BackgroundOverlay>
    </>
  );
};

export default Layout;

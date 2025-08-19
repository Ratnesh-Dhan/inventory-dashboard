import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > lastScrollTop && scrollTop > 50) {
        setShowNavbar(false);
      } else if (scrollTop < lastScrollTop || scrollTop < 50) {
        setShowNavbar(true);
      }
      setLastScrollTop(scrollTop);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  useEffect(() => {
    if (showNavbar) {
      const id = setTimeout(() => {
        setShowNavbar(false);
      }, 2000);
      setTimeoutId(id);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showNavbar]);

  const mouseOut = () => {
    // if (window.scrollY > 50) {
    //   setShowNavbar(false);
    // }
    setShowNavbar(true);
    const id = setTimeout(() => {
      setShowNavbar(false);
    }, 2000);
    setTimeoutId(id);
  };

  const mouseOver = () => {
    setShowNavbar(true);
    if (timeoutId) clearTimeout(timeoutId);
  };

  return (
    <div
      className="h-[5vh] lighter"
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
    >
      <div
        className={`duration-400 ease-in-out darkest h-[5vh] py-3 px-10 fixed top-0 left-0 w-full
        transition-transform ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        Navbar
      </div>
    </div>
  );
};

export default Navbar;

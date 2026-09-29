import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import type { SetStateAction } from "react";

function PageLogo() {
  return (
    <div className="navbar__logo rounded-full bg-blue-700/90 px-4 py-1 text-xl text-white hover:shadow-md hover:shadow-blue-600/80 dark:bg-white dark:font-thin dark:text-black dark:hover:shadow-gray-300/50">
      <p>
        <span className="font-bold">__BOOKS</span>
        <span className="font-normal">/GROUP</span>
      </p>
    </div>
  );
}

type MobileNavMenuButtonProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
};
function MobileNavMenuButton({ isOpen, setIsOpen }: MobileNavMenuButtonProps) {
  return (
    <button
      onClick={() => setIsOpen((prev) => !prev)}
      className="flex size-8 flex-col items-center justify-center gap-1 rounded-full bg-blue-700 p-1.5 md:hidden dark:bg-white"
    >
      <span
        className={`h-0.5 w-[90%] rounded-full bg-white transition dark:bg-gray-500 ${isOpen && "translate-y-1.5 rotate-45"}`}
      ></span>
      <span
        className={`h-0.5 w-[90%] rounded-full bg-white transition dark:bg-gray-500 ${isOpen && "scale-x-0"}`}
      ></span>
      <span
        className={`h-0.5 w-[90%] rounded-full bg-white transition dark:bg-gray-500 ${isOpen && "-translate-y-1.5 -rotate-45"}`}
      ></span>
    </button>
  );
}

type MobileProgressBarProps = { scrollPercent: number };
function MobileProgressBar({ scrollPercent }: MobileProgressBarProps) {
  return (
    <div className="mobile-progress h-1 w-full border-b border-blue-500/70 bg-blue-500/40 md:hidden dark:border-[#505050]/40 dark:bg-black/30">
      <div
        id="progress-bar"
        className={`mobile-progress__filling h-full bg-blue-700/90 dark:bg-white/90`}
        style={{ width: `${scrollPercent}%` }}
      ></div>
    </div>
  );
}

type NavLinkProps = {
  label: string;
  href: string;
  isScrolled: boolean;
};
function NavLink({ label, href, isScrolled }: NavLinkProps) {
  const baseBgColor = isScrolled
    ? "md:bg-white/50 dark:md:bg-black/30 bg-transparent"
    : "bg-transparent";

  return (
    <li className="navlink__item">
      <Link
        className={`font-semibold text-gray-50 md:px-4 md:py-2 dark:text-white ${baseBgColor} rounded-full text-2xl transition-colors duration-200 md:text-base md:[&:hover,&:active]:bg-blue-700 md:[&:hover,&:active]:text-white dark:md:[&:hover,&:active]:bg-white dark:md:[&:hover,&:active]:text-black`}
        to={href}
      >
        {label}
      </Link>
    </li>
  );
}

export type NavbarLinkType = { label: string; href: string };
type NavbarProps = {
  links: NavbarLinkType[];
  forcesdBGColor?: string;
};

export default function Navbar({ links, forcesdBGColor }: NavbarProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
      setScrollPercent(scrollPercent);
    };
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-1 w-full place-items-center ${forcesdBGColor && !isScrolled ? forcesdBGColor : "bg-transparent"} ${isMobileNavOpen && "h-screen backdrop-blur-md"} transition md:sticky md:grid md:h-fit md:py-2 md:backdrop-blur-none`}
    >
      <MobileProgressBar scrollPercent={scrollPercent} />
      <nav
        id="navbar"
        className={`navbar flex h-full w-full max-w-200 flex-col items-start gap-6 rounded-full p-2 md:w-[95%] md:flex-row md:items-center md:justify-between md:gap-0 md:border md:backdrop-blur-md ${isScrolled && "md:shadow-md"} shadow-gray-400/40 transition duration-100 dark:shadow-black/40 ${isScrolled ? "border-gray-300/60 md:bg-white/20 dark:border-[#505050]/40 dark:md:bg-black/40" : "border-transparent md:bg-transparent"}`}
      >
        <div className="flex items-center gap-4">
          <MobileNavMenuButton
            isOpen={isMobileNavOpen}
            setIsOpen={setIsMobileNavOpen}
          />
          <PageLogo />
        </div>
        <ul
          className={`navbar__links ${!isMobileNavOpen && "hidden md:flex"} mt-12 mr-1 flex flex-col gap-8 md:mt-0 md:h-fit md:flex-row md:flex-wrap md:gap-4`}
        >
          {links.map(({ label, href }) => (
            <NavLink
              key={label}
              label={label}
              href={href}
              isScrolled={isScrolled}
            />
          ))}
        </ul>
      </nav>
    </header>
  );
}

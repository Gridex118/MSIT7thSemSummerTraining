import Navbar, { type NavbarLinkType } from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Hero from "./components/Hero";

function App() {
  const navbarLinks: NavbarLinkType[] = [
    { label: "Home", href: "/" },
    { label: "Books", href: "/books" },
    { label: "Sign In", href: "/login" },
  ];

  return (
    <div className="font-jetbrains-mono relative flex min-h-screen flex-col bg-blue-500 dark:bg-black">
      <Navbar links={navbarLinks} />
      <Hero />
      <Footer />
    </div>
  );
}

export default App;

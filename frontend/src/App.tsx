import Navbar, { type NavbarLinkType } from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Hero from "./components/Hero";
import useAuth from "./components/useAuth";
import useTheme from "./components/useTheme";

function App() {
  const { userId } = useAuth();
  const { darkMode } = useTheme();
  const navbarLinks: NavbarLinkType[] = [
    { label: "Home", href: "/" },
    userId
      ? { label: "Profile", href: `/user/${userId}` }
      : { label: "Sign In", href: "/login" },
    { label: "Books", href: "/books" },
    userId ? { label: "Groups", href: "/groups" } : null,
  ];

  return (
    <div
      className={`font-jetbrains-mono relative flex min-h-screen flex-col bg-blue-500 dark:bg-black ${darkMode && "dark"}`}
    >
      <Navbar links={navbarLinks} />
      <Hero />
      <Footer />
    </div>
  );
}

export default App;

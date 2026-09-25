import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "#how",      label: "How it works" },
    { href: "#features", label: "Features" },
    { href: "#trust",    label: "Trust & Safety" },
    { href: "#fees",     label: "Fees" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-white/10"
      style={{
        background: "rgba(13,43,31,.92)",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform .3s ease",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#C9912A,#E8B860)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L13 5.5V10.5L8 14L3 10.5V5.5L8 2Z" fill="#0D2B1F" />
              <circle cx="8" cy="8" r="2.5" fill="#C9912A" />
            </svg>
          </div>
          <span className="font-serif font-semibold text-lg text-cream tracking-tight">
            Ajo Secure
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-cream/70 hover:text-cream transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm text-cream/80 hover:text-cream px-4 py-2 transition-colors">
            Sign in
          </a>
          <a href="#" className="btn-gold text-sm font-medium text-white px-5 py-2 rounded-full">
            Join a group
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-px bg-cream" />
          <span className="block w-5 h-px bg-cream" />
          <span className="block w-4 h-px bg-cream" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col px-5 pb-5 gap-4 border-t border-white/10 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-cream/80 py-2"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <a href="#" className="text-sm text-cream/80 px-4 py-2.5 border border-white/20 rounded-full">
              Sign in
            </a>
            <a href="#" className="btn-gold text-sm font-medium text-white px-5 py-2.5 rounded-full">
              Join a group
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

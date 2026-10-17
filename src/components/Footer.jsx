import logo from "../assets/logo.webp";

/* Placeholder destinations — swap for real routes when they exist. */
const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Safety", href: "#how-it-works" },
];

const EMAIL = "emtofitechnologies@gmail.com";

/* Displayed as the local form; `tel:` uses the international form. */
const PHONES = [
  { display: "07046483800", tel: "+2347046483800" },
  { display: "09012130382", tel: "+2349012130382" },
  { display: "08146587069", tel: "+2348146587069" },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#020817] border-t border-white/10">
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-[35px] py-[40px] md:py-[56px]">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-[32px] md:gap-[40px]">
          {/* Brand */}
          <div className="max-w-[240px]">
            <a href="#" className="flex items-center gap-[10px]">
              <img src={logo} alt="Ajo Secure logo" className="h-[28px] w-auto" />
              <span className="font-graphik text-white text-[18px] leading-[21px] whitespace-nowrap">
                AjoSecure
              </span>
            </a>
            <p className="font-manrope text-white/50 text-[13px] leading-[20px] mt-[12px]">
              Collective savings with a ledger that never forgets. Every naira recorded, every
              payout verified.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-[28px] gap-y-[10px]">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-manrope text-white/60 hover:text-white text-[13px] leading-[20px] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-[6px]">
            <p className="font-manrope text-white/40 text-[11px] uppercase tracking-wide mb-[2px]">
              Contact
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="font-manrope text-white/60 hover:text-white text-[13px] leading-[20px] transition-colors break-all"
            >
              {EMAIL}
            </a>
            {PHONES.map((phone) => (
              <a
                key={phone.tel}
                href={`tel:${phone.tel}`}
                className="font-manrope text-white/60 hover:text-white text-[13px] leading-[20px] transition-colors"
              >
                {phone.display}
              </a>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-white/10 my-[28px]" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[8px]">
          <p className="font-manrope text-white/40 text-[12px]">
            © 2026 Ajo Secure. All rights reserved.
          </p>
          <p className="font-manrope text-white/40 text-[12px]">Built on rules, not on trust.</p>
        </div>
      </div>
    </footer>
  );
}

import { MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-navy text-white/80">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                My<span className="text-orange">Assam</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Guwahati's most comprehensive local business directory. Find
              shops, hospitals, ATMs, and institutions near you.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                "About Us",
                "Press & Media",
                "Careers",
                "Partner With Us",
                "Advertise",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="/#"
                    className="text-sm text-white/60 hover:text-orange transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">For Users</h4>
            <ul className="space-y-2.5">
              {[
                "Add Your Business",
                "Claim Your Listing",
                "Write a Review",
                "Report an Error",
                "Help & Support",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="/#"
                    className="text-sm text-white/60 hover:text-orange transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Areas in Guwahati
            </h4>
            <ul className="space-y-2.5">
              {[
                "Fancy Bazar",
                "GS Road",
                "Paltan Bazar",
                "Dispur",
                "Uzanbazar",
                "Bhangagarh",
              ].map((area) => (
                <li key={area}>
                  <a
                    href="/#"
                    className="text-sm text-white/60 hover:text-orange transition-colors"
                  >
                    {area}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            © {year} MyAssam. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange/80 hover:text-orange transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

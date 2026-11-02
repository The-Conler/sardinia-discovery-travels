export function SiteFooter() {
  return (
        <footer id="main-footer" className="site-footer" aria-label="Footer">
          <div className="site-footer-main">
            <div className="site-footer-left">
              <img
                className="site-footer-logo"
                src="/sardinia-logo.png"
                alt="Sardinia Discovery Travels"
                loading="lazy"
                decoding="async"
              />
              <nav className="site-footer-nav" aria-label="Footer navigation">
                <a href="/">Explore</a>
                <a href="/#experiences">Experiences</a>
                <a href="/destinations/north-sardinia">North Sardinia</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
              </nav>
              <p>
                Tailor-made Sardinia journeys, private discoveries, and island moments shaped around your rhythm.
              </p>
              <div className="site-footer-socials" aria-label="Social links">
                <a href="#">Instagram</a>
                <a href="#">Facebook</a>
                <a href="#">WhatsApp</a>
                <a href="/#faq">FAQ</a>
              </div>
            </div>

            <div className="site-footer-links" aria-label="Footer pages">
              <a href="#">Yacht Tours</a>
              <a href="#">Blue Zone</a>
              <a href="#">Cooking Classes</a>
              <a href="/off-road">4x4 Off Road</a>
              <a href="#">Private Transfers</a>
              <a href="/hotels">Hotels</a>
            </div>
          </div>

          <div className="site-footer-business" aria-label="Business and insurance information">
            <p>REVO Speciality LiabilityXTravel Agencies N.OX00052607 | Allianz Enterprise RC N.506336849</p>
            <p>Sardinia Discovery Travels di Claudio Alias | P.IVA 03012880906 | Cod.Fisc LSACLD95H16L093P | Via Giovanni XXIII 2/a, 07029 Tempio Pausania, Sassari | Bacino SUAP Tempio Pausania N.Potrocollo 4894</p>
          </div>

          <div className="site-footer-bottom">
            <p>© 2026 Sardinia Discovery Travels</p>
            <div>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>

          <img
            className="site-footer-image"
            src="https://images.unsplash.com/photo-1609503888208-3cea9d5877c2?auto=format&fit=crop&w=2560&q=85"
            alt="Boat on turquoise water in Sardinia’s La Maddalena archipelago"
            loading="lazy"
            decoding="async"
          />
        </footer>
  );
}

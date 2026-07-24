import { Button } from "../ui";
import "./PublicNav.css";

const navItems = ["Services", "For Providers", "Pricing", "FAQ"];

export function PublicNav() {
  return (
    <header className="public-nav">
      <a className="public-nav__brand" href="/" aria-label="Plunge Care home">
        <span className="public-nav__mark" aria-hidden="true">
          PC
        </span>
        <span>Plunge Care</span>
      </a>
      <nav aria-label="Primary navigation" className="public-nav__links">
        {navItems.map((item) => (
          <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} key={item}>
            {item}
          </a>
        ))}
      </nav>
      <div className="public-nav__actions">
        <Button variant="ghost">Sign in</Button>
        <Button>Start care</Button>
      </div>
    </header>
  );
}

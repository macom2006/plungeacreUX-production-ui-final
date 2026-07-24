import { useState } from "react";
import brandMarkUrl from "../../assets/plunge-care-logo.png";
import { primaryNavigation, temporaryRoutes } from "../../lib/routes";
import { Button, Drawer, LinkButton } from "../ui";
import "./PublicNav.css";

export interface PublicNavProps {
  currentPathname?: string;
}

export function PublicNav({ currentPathname = window.location.pathname }: PublicNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="public-nav">
      <a className="public-nav__brand" href="/" aria-label="Plunge Care home">
        <img alt="" aria-hidden="true" className="public-nav__mark" src={brandMarkUrl} />
        <span aria-hidden="true" className="public-nav__wordmark">
          <span>Plunge</span>
          <span>Care</span>
        </span>
      </a>
      <Button
        aria-controls="public-mobile-menu"
        aria-expanded={mobileOpen}
        className="public-nav__menu"
        onClick={() => setMobileOpen(true)}
        variant="secondary"
      >
        Menu
      </Button>
      <nav
        aria-label="Primary navigation"
        className="public-nav__links"
      >
        {primaryNavigation.map((item) => (
          <a
            aria-current={currentPathname === item.href ? "page" : undefined}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="public-nav__actions">
        <LinkButton href={temporaryRoutes.signIn} variant="ghost">
          Sign in
        </LinkButton>
        <LinkButton href={temporaryRoutes.startCare}>Start care</LinkButton>
      </div>
      <Drawer
        description="Navigation links for Plunge Care information and account access."
        id="public-mobile-menu"
        isOpen={mobileOpen}
        onClose={closeMobileMenu}
        position="right"
        title="Menu"
      >
        <nav aria-label="Mobile primary navigation" className="public-nav__drawer-links">
          <a
            aria-current={currentPathname === "/" ? "page" : undefined}
            href="/"
            onClick={closeMobileMenu}
          >
            Home
          </a>
          {primaryNavigation.map((item) => (
            <a
              aria-current={currentPathname === item.href ? "page" : undefined}
              href={item.href}
              key={item.href}
              onClick={closeMobileMenu}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="public-nav__drawer-actions">
          <LinkButton fullWidth href={temporaryRoutes.signIn} onClick={closeMobileMenu} variant="secondary">
            Sign in
          </LinkButton>
          <LinkButton fullWidth href={temporaryRoutes.startCare} onClick={closeMobileMenu}>
            Start care
          </LinkButton>
        </div>
      </Drawer>
    </header>
  );
}

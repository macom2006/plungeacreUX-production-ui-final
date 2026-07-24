import { useState } from "react";
import { futureRoutes, primaryNavigation } from "../../lib/routes";
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
        <span className="public-nav__mark" aria-hidden="true">
          P
        </span>
        <span className="public-nav__wordmark">
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
        <LinkButton href={futureRoutes.signIn} variant="ghost">
          Sign in
        </LinkButton>
        <LinkButton href={futureRoutes.startCare}>Start care</LinkButton>
      </div>
      <Drawer
        description="Public website navigation links. Clinical and payment workflows are not available from this menu."
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
          <LinkButton fullWidth href={futureRoutes.signIn} onClick={closeMobileMenu} variant="secondary">
            Sign in
          </LinkButton>
          <LinkButton fullWidth href={futureRoutes.startCare} onClick={closeMobileMenu}>
            Start care
          </LinkButton>
        </div>
      </Drawer>
    </header>
  );
}

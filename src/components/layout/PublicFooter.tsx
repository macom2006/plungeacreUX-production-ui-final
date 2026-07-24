import { footerDescription } from "../../lib/publicContent";
import { footerGroups } from "../../lib/routes";
import "./PublicFooter.css";

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer__inner">
        <div className="public-footer__brand">
          <a className="public-footer__wordmark" href="/" aria-label="Plunge Care home">
            <span className="public-footer__mark" aria-hidden="true">P</span>
            <span>
              <span>Plunge</span>
              <span>Care</span>
            </span>
          </a>
          <p>{footerDescription}</p>
        </div>
        <div className="public-footer__groups">
          {footerGroups.map((group) => (
            <nav aria-label={group.ariaLabel} className="public-footer__group" key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}-${link.label}`}>
                    <a href={link.href}>{link.label}</a>
                    {link.note ? <span>{link.note}</span> : null}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="public-footer__copyright">
          Copyright 2026 Plunge Care. Public website foundation.
        </p>
      </div>
    </footer>
  );
}

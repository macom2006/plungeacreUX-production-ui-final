import { cn } from "../../lib/cn";
import "./DataDisplay.css";

export interface AvatarProps {
  alt?: string;
  className?: string;
  initials: string;
  size?: "sm" | "md" | "lg";
  src?: string;
  status?: "online" | "away" | "offline";
}

export function Avatar({
  alt,
  className,
  initials,
  size = "md",
  src,
  status,
}: AvatarProps) {
  return (
    <span className={cn("avatar", `avatar--${size}`, className)}>
      {src ? <img alt={alt ?? ""} src={src} /> : <span aria-hidden={alt ? undefined : "true"}>{initials}</span>}
      {alt && !src ? <span className="sr-only">{alt}</span> : null}
      {status ? <span aria-label={`Status: ${status}`} className={`avatar__status avatar__status--${status}`} /> : null}
    </span>
  );
}

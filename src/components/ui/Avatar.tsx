import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import "./DataDisplay.css";

export interface AvatarProps {
  alt?: string;
  className?: string;
  decorative?: boolean;
  initials: string;
  size?: "sm" | "md" | "lg";
  src?: string;
  status?: "online" | "away" | "offline";
}

export function Avatar({
  alt,
  className,
  decorative = false,
  initials,
  size = "md",
  src,
  status,
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldRenderImage = Boolean(src && !imageFailed);
  const isDecorative = decorative || !alt;

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  return (
    <span className={cn("avatar", `avatar--${size}`, className)}>
      {shouldRenderImage ? (
        <img alt={isDecorative ? "" : alt} onError={() => setImageFailed(true)} src={src} />
      ) : (
        <span aria-hidden={isDecorative ? "true" : undefined}>{initials}</span>
      )}
      {!isDecorative && !shouldRenderImage ? <span className="sr-only">{alt}</span> : null}
      {status ? (
        <span
          aria-label={`Status: ${status}`}
          className={`avatar__status avatar__status--${status}`}
          title={`Status: ${status}`}
        />
      ) : null}
    </span>
  );
}

import { cn } from "@/lib/utils";
import { sanitizeImageUrl } from "@/lib/sanitize";

type SocialIconProps = {
  icon: string;
  darkIcon?: string;
  alt: string;
  className?: string;
};

const SocialIcon = ({ icon, darkIcon, alt, className }: SocialIconProps) => {
  const safeIcon = sanitizeImageUrl(icon) || "";
  const safeDarkIcon = sanitizeImageUrl(darkIcon) || "";

  return (
    <span className="relative inline-flex shrink-0">
      <img
        src={safeIcon}
        alt={alt}
        loading="lazy"
        className={cn("block", className, darkIcon ? "dark:hidden" : "")}
      />
      {darkIcon ? (
        <img
          src={safeDarkIcon}
          alt={alt}
          loading="lazy"
          className={cn("hidden", className, "dark:block")}
        />
      ) : null}
    </span>
  );
};

export default SocialIcon;

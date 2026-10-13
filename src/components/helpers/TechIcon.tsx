import { cn } from "@/lib/utils";
import type { TechItem } from "@/data/tech";
import { sanitizeImageUrl } from "@/lib/sanitize";

type TechIconProps = {
  item: TechItem;
  className?: string;
};

const TechIcon = ({ item, className }: TechIconProps) => {
  const safeIcon = sanitizeImageUrl(item.icon) || "";
  const safeDarkIcon = sanitizeImageUrl(item.darkIcon) || "";

  return (
    <span className="relative inline-flex shrink-0">
      <img
        src={safeIcon}
        alt={item.name}
        loading="lazy"
        className={cn("block", className, item.darkIcon ? "dark:hidden" : "")}
      />
      {item.darkIcon ? (
        <img
          src={safeDarkIcon}
          alt={item.name}
          loading="lazy"
          className={cn("hidden", className, "dark:block")}
        />
      ) : null}
    </span>
  );
};

export default TechIcon;

import { LuGithub, LuImage } from "react-icons/lu";
import { BiLink } from "react-icons/bi";
import TechIcon from "./helpers/TechIcon";
import type { DatabaseProject } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { sanitizeImageUrl, sanitizeExternalLink } from "@/lib/sanitize";

const ProjectCard = ({
  name,
  img_src,
  description,
  tech_stack,
  live_link,
  github_link,
  slug,
}: DatabaseProject) => {
  const safeImgSrc = sanitizeImageUrl(img_src);
  const safeLiveLink = sanitizeExternalLink(live_link);
  const safeGithubLink = sanitizeExternalLink(github_link);

  return (
    <div className="flex flex-col h-full gap-2 bg-card border border-dashed border-border/80 p-2 rounded-xl w-full overflow-hidden">
      <div className="group/image rounded-lg overflow-hidden w-full aspect-video bg-muted/20 flex items-center justify-center relative">
        {safeImgSrc ? (
          <img
            src={safeImgSrc}
            alt={name}
            loading="lazy"
            className="rounded-lg border border-border/80 w-full h-full object-cover transition-all duration-500 ease-out group-hover/image:blur-xs"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/50 border border-dashed border-border/40 w-full h-full rounded-lg">
            <LuImage className="w-8 h-8" />
            <span className="text-xs font-mono uppercase tracking-widest">
              No Image
            </span>
          </div>
        )}
      </div>

      <div className="px-2 mt-4 flex-grow">
        <div className="text-xl font-light tracking-tight">{name}</div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-4 px-2 mt-4 h-5">
        {tech_stack && tech_stack.length > 0 ? (
          tech_stack.map((tech) => (
            <TechIcon key={tech.name} item={tech} className="w-5 h-5" />
          ))
        ) : (
          <span className="text-[10px] font-mono text-muted-foreground uppercase bg-muted/50 px-2 rounded-md border border-border/50 h-full flex items-center">
            No Tech Stack specified
          </span>
        )}
      </div>

      <div className="w-full h-px bg-border mt-2 mb-1" />

      <div className="flex items-center justify-between mt-1 px-2 pb-2 ">
        <div className="flex items-center gap-3">
          {safeLiveLink ? (
            <a href={safeLiveLink} target="_blank" rel="noopener noreferrer">
              <BiLink className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            </a>
          ) : (
            <BiLink className="w-4 h-4 text-muted-foreground/30 cursor-not-allowed" />
          )}
          {safeGithubLink ? (
            <a href={safeGithubLink} target="_blank" rel="noopener noreferrer">
              <LuGithub className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            </a>
          ) : (
            <LuGithub className="w-4 h-4 text-muted-foreground/30 cursor-not-allowed" />
          )}
        </div>
        <p className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors uppercase tracking-widest">
          <Link to={`/projects/${slug}`}>Details →</Link>
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;

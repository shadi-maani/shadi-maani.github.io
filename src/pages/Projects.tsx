import ProjectCard from "@/components/ProjectCard";
import ComingSoonCard from "@/components/ComingSoonCard";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { FadeIn } from "@/components/helpers/FadeIn";
import { useEffect, useState } from "react";
import { supabase, type DatabaseProject } from "@/lib/supabase";
import SEO from "@/components/SEO";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DatabaseProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <>
      <SEO title="Projects | Shadi Maani" description="Explore my latest work, including web applications, open source tools, and side projects." />
      <main className="mx-auto flex w-full max-w-3xl flex-col px-6 pt-6 pb-8 sm:pt-12 sm:pb-12 space-y-6">
        <FadeIn yOffset={10} duration={0.4}>
          <button
            onClick={() => navigate("/")}
            className="flex w-fit items-center gap-3 text-md font-light tracking-tight text-muted-foreground cursor-pointer duration-200 hover:text-foreground"
          >
            <ChevronLeft size={20} strokeWidth={2.25} /> Back to Home
          </button>
        </FadeIn>
        
        <FadeIn
          delay={0.1}
          yOffset={15}
          duration={0.5}
          className="flex flex-col gap-2"
        >
          <h1 className="text-2xl font-light tracking-tight sm:text-3xl">
            All Projects
          </h1>
          <p className="text-muted-foreground font-light text-lg">
            A collection of my recent work, side projects, and experiments. Built
            from scratch with a focus on clean code and great user experiences.
          </p>
        </FadeIn>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 mt-6">
            {projects.map((project, idx) => (
              <FadeIn key={project.id} delay={0.15 + idx * 0.05} yOffset={20}>
                <ProjectCard {...project} />
              </FadeIn>
            ))}
            {projects.length % 2 !== 0 && (
              <FadeIn delay={0.15 + projects.length * 0.05} yOffset={20}>
                <ComingSoonCard />
              </FadeIn>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default Projects;

import { BadgeCheck, BookText, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import TechIcon from "./helpers/TechIcon";
import { skills } from "@/data/tech";
import { socials } from "@/data/socials";
import SocialIcon from "./helpers/SocialIcon";
import { motion } from "framer-motion";

import { containerVariants, itemVariants } from "@/lib/motionVariants";

const Hero = () => {
  return (
    <section
      className="flex flex-col justify-center pt-32 pb-20 sm:pt-22 sm:pb-12"
      id="home"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-5 sm:space-y-10"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center mb-8 gap-[14px] sm:gap-[20px]"
        >
          <div className="flex shrink-0 items-center justify-center">
            {/* avatar */}
            <img
              src="https://avatars.githubusercontent.com/u/238776931?v=4"
              alt="Shadi Maani"
              className="block h-35 w-35 shrink-0 rounded-full border-2 border-border object-cover object-center p-1 shadow-sm sm:h-40 sm:w-40"
            />
          </div>
          <div className="flex h-full flex-col justify-center gap-2 sm:gap-3">
            <h1 className="flex items-center gap-1 text-right text-2xl font-light tracking-tight sm:text-2xl md:text-3xl">
              Shadi Maani
              <span className="text-background">
                <BadgeCheck color="currentColor" fill="#3b82f6" size={28} />
              </span>
            </h1>
            <div className="flex items-start gap-2.5 sm:gap-3">
              {socials.map(({ name, icon, darkIcon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="border-0 hover:opacity-80 transition-opacity"
                >
                  <SocialIcon
                    icon={icon}
                    darkIcon={darkIcon}
                    alt={name}
                    className="h-6 w-6 rounded p-0.5 sm:h-7 sm:w-7"
                  />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-5 sm:space-y-6">
          <h1 className="max-w-full text-[1.7rem] font-normal tracking-tight leading-tight sm:text-[2.05rem] md:text-[2.15rem]">
            Security Researcher{" "}
            <span className="text-[0.95em] font-light text-muted-foreground sm:text-[0.96em]">
              and Backend Engineer
            </span>
          </h1>
          <div className="flex flex-wrap gap-2">
            {["Application & AI Security", "Secure Backend", "Bug Bounty"].map(
              (tag) => (
                <span
                  key={tag}
                  className="bg-card inline-flex items-center rounded-md border border-dashed px-2 py-1 text-xs text-foreground sm:px-2.5 sm:text-sm"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
          <p className="text-base font-light leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            I am a self-taught security researcher focused on application and
            AI/LLM security.
            <br />
            I reported a vulnerability to Perplexity AI that
            was accepted and resolved and I run the vulnerability disclosure
            program for SYNC NGO's AI recruitment platform that handles candidate data.
            On the engineering side I designed and shipped Thimma on my own as
            an AI-powered backend on GCP with a security-first pipeline that
            includes SAST, SCA, container scanning and keyless deploys. I
            also build Arabic-first frontends in Flutter and Dart when a project
            needs it. My main tools are{" "}
            <span className="inline items-center gap-2 align-middle">
              {skills.map((skill) => (
                <span
                  key={skill.name}
                  className="bg-card ml-1 inline-flex items-center gap-1.5 rounded-md border border-dashed px-2 py-1 text-xs text-foreground sm:px-2.5 sm:text-sm transition-colors hover:border-foreground/30"
                >
                  <TechIcon
                    item={skill}
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  />
                  {skill.name}
                </span>
              ))}
            </span>
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
            <a href="/contact">
              <Button
                size="lg"
              >
                Get in Touch
                <ChevronRight strokeWidth={2.25} />
              </Button>
            </a>
            <a
              href="https://wellfound.com/u/shadi-maani-1"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="bg-card text-foreground border-dashed cursor-pointer"
              >
                Resume
                <BookText />
              </Button>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

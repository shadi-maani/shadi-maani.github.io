export interface TechItem {
  name: string;
  icon: string;
  darkIcon?: string;
}

const glyph = (color: string, path: string) =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodeURIComponent(color)}"><path d="${path}"/></svg>`;

const icons = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const paths = {
  shield:
    "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.2 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
  key: "M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z",
  bug: "M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z",
  wifi: "M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z",
  globe:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
};

export const skills: TechItem[] = [
  { name: "Python", icon: `${icons}/python/python-original.svg` },
  { name: "Docker", icon: `${icons}/docker/docker-original.svg` },
  { name: "GCP", icon: `${icons}/googlecloud/googlecloud-original.svg` },
  { name: "Firebase", icon: `${icons}/firebase/firebase-original.svg` },
  { name: "Vertex AI", icon: glyph("#8E75FF", paths.globe) },
  { name: "Flutter", icon: `${icons}/flutter/flutter-original.svg` },
];

export const securitySkills: TechItem[] = [
  { name: "Gitleaks", icon: glyph("#F59E0B", paths.key) },
  { name: "Bandit (SAST)", icon: glyph("#EF4444", paths.bug) },
  { name: "Safety (SCA)", icon: glyph("#10B981", paths.shield) },
  { name: "Trivy", icon: "https://cdn.simpleicons.org/trivy" },
  { name: "OWASP", icon: "https://cdn.simpleicons.org/owasp" },
];

export const offensiveSkills: TechItem[] = [
  { name: "Burp Suite", icon: "https://cdn.simpleicons.org/burpsuite" },
  { name: "Caido", icon: glyph("#F97316", paths.bug) },
  { name: "OWASP ZAP", icon: "https://cdn.simpleicons.org/zap" },
  { name: "nmap", icon: "/tech/nmap.svg" },
  { name: "Shodan", icon: "/tech/shodan.jpg" },
  { name: "Censys", icon: "/tech/censys.jpg" },
];

export const backendSkills: TechItem[] = [
  { name: "Python", icon: `${icons}/python/python-original.svg` },
  { name: "Google Cloud", icon: `${icons}/googlecloud/googlecloud-original.svg` },
  { name: "Cloud Run", icon: `${icons}/googlecloud/googlecloud-original.svg` },
  { name: "API Gateway", icon: glyph("#4285F4", paths.globe) },
  { name: "IAM", icon: glyph("#F59E0B", paths.key) },
  { name: "Workload Identity Federation", icon: glyph("#10B981", paths.shield) },
  { name: "Docker", icon: `${icons}/docker/docker-original.svg` },
  { name: "CI/CD", icon: `${icons}/githubactions/githubactions-original.svg` },
  { name: "FastAPI", icon: `${icons}/fastapi/fastapi-original.svg` },
  { name: "Flask", icon: `${icons}/flask/flask-original.svg` },
  { name: "Node.js", icon: `${icons}/nodejs/nodejs-original.svg` },
  { name: "Firebase", icon: `${icons}/firebase/firebase-original.svg` },
  { name: "Supabase", icon: `${icons}/supabase/supabase-original.svg` },
  { name: "Vertex AI", icon: glyph("#8E75FF", paths.globe) },
  { name: "QML", icon: `${icons}/qt/qt-original.svg` },
];

export const systemsSkills: TechItem[] = [
  { name: "Linux", icon: `${icons}/linux/linux-original.svg` },
  { name: "Bash", icon: `${icons}/bash/bash-original.svg` },
  { name: "AWS", icon: `${icons}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
  { name: "Networking", icon: glyph("#06B6D4", paths.wifi) },
  { name: "Pytest", icon: `${icons}/pytest/pytest-original.svg` },
  { name: "Git", icon: `${icons}/git/git-original.svg` },
  {
    name: "GitHub",
    icon: "/social/github.svg",
    darkIcon: "/social/github-dark.svg",
  },
  { name: "Gradle", icon: `${icons}/gradle/gradle-original.svg` },
  { name: "Vercel", icon: "/tech/vercel-light.svg", darkIcon: "/tech/vercel-dark.svg" },
  { name: "Netlify", icon: `${icons}/netlify/netlify-original.svg` },
  { name: "NPM", icon: `${icons}/npm/npm-original-wordmark.svg` },
];

export const frontendSkills: TechItem[] = [
  { name: "Flutter", icon: `${icons}/flutter/flutter-original.svg` },
  { name: "Dart", icon: `${icons}/dart/dart-original.svg` },
  { name: "JavaScript", icon: `${icons}/javascript/javascript-original.svg` },
  { name: "TypeScript", icon: `${icons}/typescript/typescript-original.svg` },
  { name: "HTML5", icon: `${icons}/html5/html5-original.svg` },
  { name: "CSS", icon: `${icons}/css3/css3-original.svg` },
];

export const skillRows: { direction: "left" | "right"; category: string; items: TechItem[] }[] = [
  { direction: "left", category: "Security", items: securitySkills },
  { direction: "right", category: "Offensive / Research", items: offensiveSkills },
  { direction: "left", category: "Backend & Cloud", items: backendSkills },
  { direction: "right", category: "Tools & Systems", items: systemsSkills },
  { direction: "left", category: "Frontend", items: frontendSkills },
];

export const projectTech = {
  react: { name: "React", icon: "/tech/react.svg" },
  javascript: { name: "JavaScript", icon: "/tech/js.svg" },
  typescript: { name: "TypeScript", icon: "/tech/typescript.svg" },
  tailwindcss: { name: "Tailwind CSS", icon: "/tech/tailwindcss.svg" },
  vite: { name: "Vite", icon: "/tech/vite.svg" },
  motion: { name: "Framer Motion", icon: "/tech/motion.svg" },
  radixui: {
    name: "Radix UI",
    icon: "/tech/radixui.svg",
    darkIcon: "/tech/radixui-dark.svg",
  },
  shadcnui: {
    name: "shadcn/ui",
    icon: "/tech/shadcn-ui-light.svg",
    darkIcon: "/tech/shadcn-ui-dark.svg",
  },
  supabase: { name: "Supabase", icon: "/tech/supabase.svg" },
  monaco: { name: "Monaco Editor", icon: "/tech/monaco.svg" },
  nodejs: {
    name: "Node.js",
    icon: "/tech/nodejs-light.svg",
    darkIcon: "/tech/nodejs-dark.svg",
  },
  ink: {
    name: "Ink",
    icon: "/tech/ink-light.svg",
    darkIcon: "/tech/ink-dark.svg",
  },
  commander: {
    name: "Commander.js",
    icon: "/tech/commander-light.svg",
    darkIcon: "/tech/commander-dark.svg",
  },
  execa: {
    name: "Execa",
    icon: "/tech/execa-light.svg",
    darkIcon: "/tech/execa-dark.svg",
  },
} as const;

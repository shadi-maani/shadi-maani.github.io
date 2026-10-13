import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = "https://shadimaani.me";

async function generateSitemap() {
  try {
    console.log("Generating sitemap...");

    // Fetch Projects
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("slug, created_at");

    if (projectsError) throw projectsError;

    // Fetch Blogs
    const { data: blogs, error: blogsError } = await supabase
      .from("blogs")
      .select("slug, date")
      .eq("is_published", true);

    if (blogsError) throw blogsError;

    const urls = [];

    // Static Pages
    urls.push({
      loc: `${BASE_URL}/`,
      lastmod: new Date().toISOString(),
      priority: "1.0",
    });
    urls.push({
      loc: `${BASE_URL}/projects`,
      lastmod: new Date().toISOString(),
      priority: "0.8",
    });
    urls.push({
      loc: `${BASE_URL}/blogs`,
      lastmod: new Date().toISOString(),
      priority: "0.8",
    });
    urls.push({
      loc: `${BASE_URL}/contact`,
      lastmod: new Date().toISOString(),
      priority: "0.5",
    });

    // Dynamic Projects
    projects?.forEach((project) => {
      const lastmod = project.created_at || new Date().toISOString();
      urls.push({
        loc: `${BASE_URL}/projects/${project.slug}`,
        lastmod: new Date(lastmod).toISOString(),
        priority: "0.7",
      });
    });

    // Dynamic Blogs
    blogs?.forEach((blog) => {
      const lastmod = blog.date || new Date().toISOString();
      urls.push({
        loc: `${BASE_URL}/blogs/${blog.slug}`,
        lastmod: new Date(lastmod).toISOString(),
        priority: "0.7",
      });
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod.split("T")[0]}</lastmod>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const publicPath = path.join(__dirname, "public");

    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath);
    }

    fs.writeFileSync(path.join(publicPath, "sitemap.xml"), sitemap);
    console.log("sitemap.xml generated successfully in public/sitemap.xml");
  } catch (error) {
    console.error("Error generating sitemap:", error);
    process.exit(1);
  }
}

generateSitemap();

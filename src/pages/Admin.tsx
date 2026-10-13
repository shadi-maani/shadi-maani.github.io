import { useEffect, useState, useRef } from "react";
import {
  supabase,
  supabaseUrl,
  type DatabaseBlog,
  type DatabaseProject,
} from "@/lib/supabase";
import { sanitizeImageUrl } from "@/lib/sanitize";
import type { Session } from "@supabase/supabase-js";
import {
  ChevronLeft,
  Loader2,
  Save,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  X,
  Bold,
  Italic,
  Link2,
  List as ListIcon,
  Heading,
  Code,
  ArrowUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/helpers/FadeIn";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ADMIN_HASH =
  "495814ad4df9ac21657e262331851c6f57c9c8e55469aa30e2f581069af4c5b0";

async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const getFilenameFromUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/");
    return pathParts[pathParts.length - 1];
  } catch {
    return null;
  }
};

const deleteOldImage = async (oldUrl: string | null | undefined) => {
  if (!oldUrl) return;
  const filename = getFilenameFromUrl(oldUrl);
  if (filename) {
    await supabase.storage.from("blog-images").remove([filename]);
  }
};

const ensureUniqueSlug = async (
  slug: string,
  table: "blogs" | "projects",
  currentId: string | null,
) => {
  const baseSlug = slug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  if (!baseSlug) {
    return "untitled";
  }

  let query = supabase.from(table).select("slug").like("slug", `${baseSlug}%`);
  if (currentId) {
    query = query.neq("id", currentId);
  }
  const { data, error } = await query;
  if (error) throw error;

  const existingSlugs = data?.map((d) => d.slug) || [];
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  return uniqueSlug;
};

const getFriendlyErrorMessage = (err: unknown): string => {
  if (!(err instanceof Error)) return "An unexpected error occurred.";
  const msg = err.message;

  if (msg.includes("duplicate key value violates unique constraint")) {
    return "Error: A post with this URL slug already exists. Please choose a unique title or slug.";
  }
  if (msg.includes("Invalid file type")) {
    return "Error: Only image files (JPEG, PNG, WEBP, GIF, AVIF) are allowed.";
  }
  if (
    msg.includes("storage/object-not-found") ||
    msg.includes("The resource was not found")
  ) {
    return "Error: Could not access the storage bucket. Please check your Supabase connection.";
  }
  return `Error: ${msg}`;
};

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-2 mt-2">
      <span className="text-xs uppercase tracking-widest text-muted-foreground/70 font-mono">
        {title}
      </span>
      <div className="flex-1 h-px bg-border/40" />
    </div>
  );
}

const getTechIcon = (name: string) => {
  const overrides: Record<string, string> = {
    react: "react/react-original.svg",
    "next.js": "nextjs/nextjs-original.svg",
    nextjs: "nextjs/nextjs-original.svg",
    node: "nodejs/nodejs-original.svg",
    nodejs: "nodejs/nodejs-original.svg",
    tailwind: "tailwindcss/tailwindcss-original.svg",
    tailwindcss: "tailwindcss/tailwindcss-original.svg",
    gcp: "googlecloud/googlecloud-original.svg",
    "google cloud": "googlecloud/googlecloud-original.svg",
    vue: "vuejs/vuejs-original.svg",
    html: "html5/html5-original.svg",
    css: "css3/css3-original.svg",
    js: "javascript/javascript-original.svg",
    javascript: "javascript/javascript-original.svg",
    ts: "typescript/typescript-original.svg",
    typescript: "typescript/typescript-original.svg",
    postgres: "postgresql/postgresql-original.svg",
    postgresql: "postgresql/postgresql-original.svg",
    aws: "amazonwebservices/amazonwebservices-original-wordmark.svg",
    firebase: "firebase/firebase-plain.svg",
    supabase: "supabase/supabase-original.svg",
    linux: "linux/linux-original.svg",
    bash: "bash/bash-original.svg",
    docker: "docker/docker-original.svg",
  };

  const lowerName = name.toLowerCase().trim();
  const path = overrides[lowerName] || `${lowerName}/${lowerName}-original.svg`;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}`;
};

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  const logActivity = async (
    eventType: string,
    emailUsed?: string | null,
    metadata: Record<string, unknown> = {},
  ) => {
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      await supabase.from("activity_logs").insert({
        event_type: eventType,
        user_id: currentSession?.user?.id || null,
        user_email: currentSession?.user?.email || emailUsed || null,
        metadata,
      });
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  };
  const [loading, setLoading] = useState(true);

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Dashboard states
  const [activeTab, setActiveTab] = useState<"blogs" | "projects">("blogs");
  const [viewMode, setViewMode] = useState<"list" | "form">("list");

  // Data states
  const [blogs, setBlogs] = useState<DatabaseBlog[]>([]);
  const [projects, setProjects] = useState<DatabaseProject[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Shared form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<{
    id: string;
    table: "blogs" | "projects";
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const getSafePreviewUrl = () => {
    if (blobUrl) return blobUrl;
    return sanitizeImageUrl(previewUrl) || "";
  };

  // Blog states
  const [title, setTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogDesc, setBlogDesc] = useState("");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [content, setContent] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [isPublished, setIsPublished] = useState(true);

  // Project states
  const [projName, setProjName] = useState("");
  const [projSlug, setProjSlug] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projAbout, setProjAbout] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [features, setFeatures] = useState("");
  const [techStack, setTechStack] = useState<{ name: string; icon: string }[]>(
    [],
  );
  const [techInput, setTechInput] = useState("");

  const fetchData = async () => {
    setIsFetching(true);
    const [blogsRes, projRes] = await Promise.all([
      supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    if (blogsRes.data) setBlogs(blogsRes.data);
    if (projRes.data) setProjects(projRes.data);
    setIsFetching(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData();
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => subscription.unsubscribe();
  }, []);

  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBlobUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setBlobUrl(null);
    };
  }, [imageFile]);

  useEffect(() => {
    if (viewMode !== "form") return;
    const el = formRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.abs(rect.top);
      setScrollProgress(Math.min(Math.max(scrolled / total, 0), 1));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [viewMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoginError(error.message);
      logActivity("admin_login_failed", email, { error: error.message });
    } else {
      logActivity("admin_login_success", email);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    logActivity("admin_logout");
    await supabase.auth.signOut();
  };

  const resetForm = () => {
    setEditingId(null);
    setMessage("");
    setImageFile(null);
    setPreviewUrl("");
    setShowPreview(false);
    setScrollProgress(0);

    setTitle("");
    setBlogSlug("");
    setBlogDesc("");
    setTags("");
    setReadTime("");
    setContent("");
    setProjName("");
    setProjSlug("");
    setProjDesc("");
    setProjAbout("");
    setLiveLink("");
    setGithubLink("");
    setFeatures("");
    setTechStack([]);
    setTechInput("");
    setIsPublished(true);
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = techInput.trim().replace(/,$/, "");
      if (val) {
        setTechStack((prev) => [
          ...prev,
          { name: val, icon: getTechIcon(val) },
        ]);
        setTechInput("");
      }
    }
  };

  const handleRemoveTech = (index: number) => {
    setTechStack((prev) => prev.filter((_, i) => i !== index));
  };

  const openCreateForm = () => {
    resetForm();
    setViewMode("form");
  };

  const insertFormat = (prefix: string, suffix: string = "") => {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = content;
    const selectedText = text.substring(start, end);
    const newText =
      text.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      text.substring(end);
    setContent(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleEditBlog = (b: DatabaseBlog) => {
    resetForm();
    setEditingId(b.id);
    setTitle(b.title);
    setBlogSlug(b.slug);
    setBlogDesc(b.description);
    setTags(b.tags.join(", "));
    setReadTime(b.read_time);
    setContent(b.content);
    setIsPublished(b.is_published);
    if (b.image_url) setPreviewUrl(b.image_url);
    setViewMode("form");
  };

  const handleEditProject = (p: DatabaseProject) => {
    resetForm();
    setEditingId(p.id);
    setProjName(p.name);
    setProjSlug(p.slug);
    setProjDesc(p.description);
    setProjAbout(p.about);
    setLiveLink(p.live_link || "");
    setGithubLink(p.github_link || "");
    setFeatures(p.features.join("\n"));
    setTechStack(p.tech_stack || []);
    if (p.img_src) setPreviewUrl(p.img_src);
    setViewMode("form");
  };

  const handleDelete = async (id: string, table: "blogs" | "projects") => {
    // Authenticated session validation gate
    const {
      data: { session: activeSession },
    } = await supabase.auth.getSession();
    const userEmail = activeSession?.user?.email;
    const userHash = userEmail ? await sha256(userEmail) : "";
    if (!activeSession || userHash !== ADMIN_HASH) {
      setMessage("Error: Unauthorized deletion attempt.");
      logActivity("unauthorized_delete_attempt", null, { id, table });
      return;
    }

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      setMessage(`Error deleting item: ${error.message}`);
    } else {
      logActivity(`${table.slice(0, -1)}_delete`, null, { id });
      setMessage("Deleted successfully.");
    }
    setDeleteConfirmId(null);
    fetchData();
  };

  const handleUploadImage = async () => {
    if (!imageFile) return previewUrl;

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ];
    if (!allowedMimeTypes.includes(imageFile.type)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, WEBP, GIF, and AVIF images are allowed.",
      );
    }

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No active session. Please log in again.");
    }

    setUploadProgress(0);

    const uploadUrl = `${supabaseUrl}/storage/v1/object/blog-images/${fileName}`;

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadUrl, true);
      xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
      xhr.setRequestHeader("Content-Type", imageFile.type);
      xhr.setRequestHeader("x-upsert", "true");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.min(Math.round((e.loaded / e.total) * 100), 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        setUploadProgress(null);
        if (xhr.status >= 200 && xhr.status < 300) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("blog-images").getPublicUrl(fileName);
          resolve(publicUrl);
        } else {
          let message = `Upload failed with status ${xhr.status}`;
          try {
            const err = JSON.parse(xhr.responseText);
            message = err.error || err.message || message;
          } catch {
            message = xhr.responseText || message;
          }
          reject(new Error(message));
        }
      };

      xhr.onerror = () => {
        setUploadProgress(null);
        reject(new Error("Network error during upload"));
      };

      xhr.send(imageFile);
    });
  };

  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const oldImageUrl = editingId
        ? blogs.find((b) => b.id === editingId)?.image_url
        : null;
      const finalImageUrl = await handleUploadImage();
      if (finalImageUrl) {
        setPreviewUrl(finalImageUrl);
        URL.revokeObjectURL(blobUrl || "");
        setBlobUrl(null);
      }
      const tagArray = Array.from(
        new Set(
          tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        ),
      );

      const rawSlug =
        blogSlug ||
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      const resolvedSlug = await ensureUniqueSlug(rawSlug, "blogs", editingId);

      const payload = {
        title,
        slug: resolvedSlug,
        description: blogDesc,
        tags: tagArray,
        read_time: readTime,
        image_url: finalImageUrl || null,
        content,
        is_published: isPublished,
      };

      let error;
      if (editingId) {
        ({ error } = await supabase
          .from("blogs")
          .update(payload)
          .eq("id", editingId));
        if (!error) {
          logActivity("blog_update", null, {
            id: editingId,
            title,
            slug: payload.slug,
          });
        }
      } else {
        const date = new Date().toISOString();
        ({ error } = await supabase.from("blogs").insert({ ...payload, date }));
        if (!error) {
          logActivity("blog_create", null, { title, slug: payload.slug });
        }
      }

      if (error) throw error;

      if (oldImageUrl && oldImageUrl !== finalImageUrl) {
        await deleteOldImage(oldImageUrl);
      }

      setMessage("Blog saved successfully!");
      fetchData();
      setTimeout(() => {
        setViewMode("list");
        resetForm();
      }, 1500);
    } catch (err: unknown) {
      setMessage(getFriendlyErrorMessage(err));
    }
    setIsSubmitting(false);
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const oldImageUrl = editingId
        ? projects.find((p) => p.id === editingId)?.img_src
        : null;
      const finalImageUrl = await handleUploadImage();
      if (finalImageUrl) {
        setPreviewUrl(finalImageUrl);
        URL.revokeObjectURL(blobUrl || "");
        setBlobUrl(null);
      }
      const featureArray = features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const rawSlug =
        projSlug ||
        projName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      const resolvedSlug = await ensureUniqueSlug(
        rawSlug,
        "projects",
        editingId,
      );

      const payload = {
        name: projName,
        slug: resolvedSlug,
        description: projDesc,
        about: projAbout,
        img_src: finalImageUrl || null,
        live_link: liveLink || null,
        github_link: githubLink || null,
        features: featureArray,
        tech_stack: techStack,
      };

      let error;
      if (editingId) {
        ({ error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingId));
        if (!error) {
          logActivity("project_update", null, {
            id: editingId,
            name: projName,
            slug: payload.slug,
          });
        }
      } else {
        ({ error } = await supabase.from("projects").insert(payload));
        if (!error) {
          logActivity("project_create", null, {
            name: projName,
            slug: payload.slug,
          });
        }
      }

      if (error) throw error;

      if (oldImageUrl && oldImageUrl !== finalImageUrl) {
        await deleteOldImage(oldImageUrl);
      }

      setMessage("Project saved successfully!");
      fetchData();
      setTimeout(() => {
        setViewMode("list");
        resetForm();
      }, 1500);
    } catch (err: unknown) {
      setMessage(getFriendlyErrorMessage(err));
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-col px-6 pt-24 space-y-6">
        <button
          onClick={() => navigate("/")}
          className="flex w-fit items-center gap-3 text-md font-light text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft size={20} /> Back to Home
        </button>
        <div className="bg-card border border-dashed border-border/80 p-6 rounded-xl">
          <h1 className="text-2xl font-light mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-dashed p-3 rounded-md font-light"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-dashed p-3 rounded-md font-light"
            />
            {loginError && (
              <p className="text-red-500 text-sm font-light">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-foreground text-background py-3 rounded-md font-medium"
            >
              Sign In
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-6 pt-6 pb-12 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex w-fit items-center gap-3 text-md font-light text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft size={20} /> Back to Home
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-dashed border-border/60 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setActiveTab("blogs");
              setViewMode("list");
            }}
            className={`text-xl sm:text-2xl font-light ${activeTab === "blogs" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Blogs
          </button>
          <span className="text-muted-foreground font-light">/</span>
          <button
            onClick={() => {
              setActiveTab("projects");
              setViewMode("list");
            }}
            className={`text-xl sm:text-2xl font-light ${activeTab === "projects" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Projects
          </button>
        </div>
        {viewMode === "list" && (
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-md font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Create New
          </button>
        )}
      </div>

      {viewMode === "list" ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-5"
          >
            {isFetching ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : activeTab === "blogs" ? (
              blogs.map((b, idx) => (
                <FadeIn
                  key={b.id}
                  delay={reducedMotion ? 0 : idx * 0.04}
                  yOffset={12}
                  duration={0.35}
                >
                  <div className="flex items-center justify-between p-5 bg-card border border-dashed border-border/80 rounded-xl hover:border-border/60 transition-colors">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-lg truncate">
                        {b.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-light">
                        {new Date(b.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <button
                        onClick={() => handleEditBlog(b)}
                        className="p-2 text-muted-foreground hover:text-foreground bg-background rounded-md border border-dashed border-border/60 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      {deleteConfirmId?.id === b.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDelete(b.id, "blogs")}
                            className="px-2 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded-md border border-red-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground bg-background rounded-md border border-dashed border-border/60 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setDeleteConfirmId({ id: b.id, table: "blogs" })
                          }
                          className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-md border border-dashed border-border/60 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))
            ) : (
              projects.map((p, idx) => (
                <FadeIn
                  key={p.id}
                  delay={reducedMotion ? 0 : idx * 0.04}
                  yOffset={12}
                  duration={0.35}
                >
                  <div className="flex items-center justify-between p-5 bg-card border border-dashed border-border/80 rounded-xl hover:border-border/60 transition-colors">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-lg truncate">{p.name}</h3>
                      <p className="text-sm text-muted-foreground font-light truncate">
                        {p.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <button
                        onClick={() => handleEditProject(p)}
                        className="p-2 text-muted-foreground hover:text-foreground bg-background rounded-md border border-dashed border-border/60 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      {deleteConfirmId?.id === p.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDelete(p.id, "projects")}
                            className="px-2 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded-md border border-red-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground bg-background rounded-md border border-dashed border-border/60 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setDeleteConfirmId({ id: p.id, table: "projects" })
                          }
                          className="p-2 text-muted-foreground hover:text-red-500 bg-background rounded-md border border-dashed border-border/60 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="flex flex-col gap-4" ref={formRef}>
          <div className="sticky top-16 z-40 -mx-6 px-6 bg-background/80 backdrop-blur-sm border-b border-dashed border-border/60 pb-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-light">
                {editingId ? "Edit" : "Create"}{" "}
                {activeTab === "blogs" ? "Blog" : "Project"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md font-medium border border-dashed hover:bg-muted/50 text-sm transition-colors"
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  onClick={
                    activeTab === "blogs"
                      ? handleSubmitBlog
                      : handleSubmitProject
                  }
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-foreground text-background px-4 py-1.5 rounded-md font-medium hover:opacity-90 disabled:opacity-50 text-sm transition-opacity"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}{" "}
                  Save
                </button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted/50 -mb-px">
              <div
                className="h-full bg-foreground/60 transition-all duration-150 ease-out rounded-full"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className={`p-3 rounded-md border border-dashed text-sm ${message.includes("Error") ? "border-red-500/50 bg-red-500/10 text-red-500" : "border-green-500/50 bg-green-500/10 text-green-500"}`}
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-7">
              {activeTab === "blogs" ? (
                <>
                  <div data-section="basic">
                    <SectionHeader title="Basic Info" />
                    <div className="flex flex-col gap-3">
                      <div className="transition-transform duration-200 focus-within:scale-[1.015] mb-5">
                        <input
                          type="text"
                          placeholder="Title"
                          required
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                            if (!editingId)
                              setBlogSlug(
                                e.target.value
                                  .toLowerCase()
                                  .replace(/\s+/g, "-"),
                              );
                          }}
                          className="w-full text-xl bg-transparent border-b border-dashed pb-2 focus:outline-none font-light"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Slug"
                          required
                          value={blogSlug}
                          onChange={(e) => setBlogSlug(e.target.value)}
                          className="w-full bg-background border border-dashed p-3 rounded-md font-light text-sm transition-all duration-200 focus:scale-[1.02] focus:z-10 focus:shadow-sm"
                        />
                        <input
                          type="text"
                          placeholder="Read Time"
                          required
                          value={readTime}
                          onChange={(e) => setReadTime(e.target.value)}
                          className="w-full bg-background border border-dashed p-3 rounded-md font-light text-sm transition-all duration-200 focus:scale-[1.02] focus:z-10 focus:shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div data-section="description">
                    <SectionHeader title="Description & Tags" />
                    <div className="flex flex-col gap-3">
                      <textarea
                        placeholder="Short Description..."
                        required
                        value={blogDesc}
                        onChange={(e) => setBlogDesc(e.target.value)}
                        rows={2}
                        className="w-full bg-background border border-dashed p-3 rounded-md font-light text-sm resize-none transition-all duration-200 focus:scale-[1.015] focus:z-10 focus:shadow-sm"
                      />
                      <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        required
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full bg-background border border-dashed p-3 rounded-md font-light text-sm transition-all duration-200 focus:scale-[1.02] focus:z-10 focus:shadow-sm"
                      />
                    </div>
                  </div>

                  <div data-section="publication">
                    <SectionHeader title="Publication" />
                    <div className="flex items-center gap-2.5 p-3 bg-background border border-dashed border-border/60 rounded-md">
                      <input
                        type="checkbox"
                        id="isPublished"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="w-4 h-4 cursor-pointer accent-foreground"
                      />
                      <label
                        htmlFor="isPublished"
                        className="text-sm font-light text-muted-foreground cursor-pointer select-none"
                      >
                        Publish post immediately (uncheck to save as draft)
                      </label>
                    </div>
                  </div>

                  <div data-section="image">
                    <SectionHeader title="Image" />
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files && setImageFile(e.target.files[0])
                        }
                        className="w-full bg-background border border-dashed p-3 rounded-md font-light text-sm transition-all duration-200 focus:scale-[1.02] focus:z-10 focus:shadow-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-foreground file:text-background cursor-pointer"
                      />
                      <p className="text-[10px] text-muted-foreground ml-1">
                        Recommended size: 1200x630px (16:9 ratio)
                      </p>
                      {uploadProgress !== null && (
                        <div className="flex flex-col gap-1">
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-foreground rounded-full transition-all duration-200 ease-out"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground text-right">
                            {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div data-section="content">
                    <SectionHeader title="Content" />
                    <div className="flex flex-col border border-dashed border-border/80 rounded-md overflow-hidden focus-within:border-foreground/50 transition-colors">
                      <div className="flex items-center gap-1 p-2 bg-muted/20 border-b border-dashed border-border/60">
                        <button
                          type="button"
                          onClick={() => insertFormat("**", "**")}
                          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors"
                        >
                          <Bold size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormat("_", "_")}
                          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors"
                        >
                          <Italic size={14} />
                        </button>
                        <div className="w-px h-4 bg-border mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormat("### ", "")}
                          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors"
                        >
                          <Heading size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormat("- ", "")}
                          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors"
                        >
                          <ListIcon size={14} />
                        </button>
                        <div className="w-px h-4 bg-border mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormat("[", "](url)")}
                          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors"
                        >
                          <Link2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormat("`", "`")}
                          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors"
                        >
                          <Code size={14} />
                        </button>
                      </div>
                      <textarea
                        ref={contentRef}
                        placeholder="Markdown content..."
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full min-h-[400px] bg-background p-4 font-mono text-sm resize-y focus:outline-none transition-all duration-200 focus:scale-[1.01]"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div data-section="basic">
                    <SectionHeader title="Basic Info" />
                    <div className="flex flex-col gap-3">
                      <div className="transition-transform duration-200 focus-within:scale-[1.015] mb-5">
                        <input
                          type="text"
                          placeholder="Project Name"
                          required
                          value={projName}
                          onChange={(e) => {
                            setProjName(e.target.value);
                            if (!editingId)
                              setProjSlug(
                                e.target.value
                                  .toLowerCase()
                                  .replace(/\s+/g, "-"),
                              );
                          }}
                          className="w-full text-xl bg-transparent border-b border-dashed pb-2 focus:outline-none font-light"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Slug"
                        required
                        value={projSlug}
                        onChange={(e) => setProjSlug(e.target.value)}
                        className="w-full bg-background border border-dashed p-3 rounded-md font-light text-sm transition-all duration-200 focus:scale-[1.02] focus:z-10 focus:shadow-sm"
                      />
                    </div>
                  </div>

                  <div data-section="description">
                    <SectionHeader title="Description" />
                    <div className="flex flex-col gap-3">
                      <textarea
                        placeholder="Short Description..."
                        required
                        value={projDesc}
                        onChange={(e) => setProjDesc(e.target.value)}
                        rows={2}
                        className="w-full bg-background border border-dashed p-3 rounded-md font-light text-sm resize-none transition-all duration-200 focus:scale-[1.015] focus:z-10 focus:shadow-sm"
                      />
                      <textarea
                        placeholder="About Details..."
                        required
                        value={projAbout}
                        onChange={(e) => setProjAbout(e.target.value)}
                        rows={4}
                        className="w-full bg-background border border-dashed p-3 rounded-md font-light text-sm transition-all duration-200 focus:scale-[1.02] focus:z-10 focus:shadow-sm resize-y"
                      />
                    </div>
                  </div>

                  <div data-section="links">
                    <SectionHeader title="Links" />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="url"
                        placeholder="Live Link"
                        value={liveLink}
                        onChange={(e) => setLiveLink(e.target.value)}
                        className="w-full bg-background border border-dashed p-3 rounded-md font-light text-sm transition-all duration-200 focus:scale-[1.02] focus:z-10 focus:shadow-sm"
                      />
                      <input
                        type="url"
                        placeholder="GitHub Link"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        className="w-full bg-background border border-dashed p-3 rounded-md font-light text-sm transition-all duration-200 focus:scale-[1.02] focus:z-10 focus:shadow-sm"
                      />
                    </div>
                  </div>

                  <div data-section="features">
                    <SectionHeader title="Features & Tech Stack" />
                    <div className="flex flex-col gap-3">
                      <textarea
                        placeholder="Features (one per line)"
                        required
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        rows={4}
                        className="w-full bg-background border border-dashed p-3 rounded-md font-light text-sm transition-all duration-200 focus:scale-[1.02] focus:z-10 focus:shadow-sm resize-y"
                      />
                      <div className="flex flex-col gap-2 p-3 bg-background border border-dashed border-border/60 rounded-md">
                        <div className="flex flex-wrap gap-2">
                          {techStack.map((tech, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-1.5 px-2 py-1 bg-card border border-dashed rounded-md text-xs"
                            >
                              <img
                                src={sanitizeImageUrl(tech.icon) || ""}
                                alt={tech.name}
                                className="w-4 h-4"
                                onError={(e) =>
                                  (e.currentTarget.src =
                                    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/devicon/devicon-original.svg")
                                }
                              />
                              {tech.name}
                              <button
                                type="button"
                                onClick={() => handleRemoveTech(i)}
                                className="text-muted-foreground hover:text-red-500 ml-1"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Add tech (Press Enter or Comma)..."
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyDown={handleTechKeyDown}
                          className="w-full bg-transparent focus:outline-none font-light text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div data-section="image">
                    <SectionHeader title="Image" />
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files && setImageFile(e.target.files[0])
                        }
                        className="w-full bg-background border border-dashed p-3 rounded-md font-light text-sm transition-all duration-200 focus:scale-[1.02] focus:z-10 focus:shadow-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-foreground file:text-background cursor-pointer"
                      />
                      <p className="text-[10px] text-muted-foreground ml-1">
                        Recommended size: 1200x630px (16:9 ratio)
                      </p>
                      {uploadProgress !== null && (
                        <div className="flex flex-col gap-1">
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-foreground rounded-full transition-all duration-200 ease-out"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground text-right">
                            {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Live Preview */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-mono lg:hidden hover:text-foreground transition-colors"
              >
                {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
              <div
                className={`flex-col bg-card border border-dashed border-border/80 rounded-xl p-5 sticky top-32 max-h-[calc(100vh-112px)] overflow-y-auto ${showPreview ? "flex" : "hidden lg:flex"}`}
              >
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-3 border-b border-dashed border-border/60 pb-2">
                  Live Preview
                </h2>
                <article className="prose prose-neutral dark:prose-invert max-w-none prose-sm">
                  {(blobUrl || previewUrl) && (
                    <img
                      src={getSafePreviewUrl()}
                      alt="Preview"
                      className="w-full h-[200px] object-cover rounded-lg mb-4 border border-dashed border-border/60"
                    />
                  )}
                  {activeTab === "blogs" ? (
                    <>
                      <h1>{title || "Title"}</h1>
                      <p className="lead">{blogDesc}</p>
                      <hr className="border-dashed" />
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {content || "*Markdown content...*"}
                      </Markdown>
                    </>
                  ) : (
                    <>
                      <h1>{projName || "Project Name"}</h1>
                      <p className="lead">{projDesc}</p>
                      <p>{projAbout}</p>
                      <h3>Features</h3>
                      <ul>
                        {features
                          .split("\n")
                          .filter(Boolean)
                          .map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                      </ul>
                    </>
                  )}
                </article>
              </div>
            </div>
          </div>

          {/* Back to top */}
          <AnimatePresence>
            {scrollProgress > 0.3 && (
              <motion.button
                initial={reducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: reducedMotion ? "instant" : "smooth",
                  })
                }
                className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-foreground text-background shadow-lg hover:opacity-90 transition-opacity"
                aria-label="Back to top"
              >
                <ArrowUp size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
};

export default Admin;

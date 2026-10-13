import { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FadeIn } from "@/components/helpers/FadeIn";
import { supabase, type DatabaseBlog } from "@/lib/supabase";
import SEO from "@/components/SEO";

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<DatabaseBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error);
      } else {
        setBlogs(data || []);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <SEO
        title="Blogs | Shadi Maani"
        description="Thoughts, tutorials, and insights on software engineering, web development, and more."
      />
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
            Blogs
          </h1>
          <p className="text-muted-foreground font-light text-lg">
            Thoughts, tutorials, and insights on software engineering, web
            development, and more.
          </p>
        </FadeIn>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-6">
            {blogs.length > 0 ? (
              blogs.map((blog, idx) => (
                <FadeIn key={blog.id} delay={0.15 + idx * 0.05} yOffset={20}>
                  <BlogCard {...blog} />
                </FadeIn>
              ))
            ) : (
              <p className="text-muted-foreground font-light">
                No blogs published yet.
              </p>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default Blog;

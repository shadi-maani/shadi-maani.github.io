import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { supabase, type DatabaseBlog } from "@/lib/supabase";

const BlogSection = () => {
  const [blogs, setBlogs] = useState<DatabaseBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("date", { ascending: false })
        .limit(4);

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
    <section id="blogs" className="w-full space-y-6">
      <div className="flex gap-3">
        <p className="text-2xl font-light tracking-tight sm:text-3xl">Blogs</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {blogs.length > 0 ? (
            blogs.map((blog) => <BlogCard key={blog.id} {...blog} />)
          ) : (
            <p className="text-muted-foreground font-light">
              No blogs published yet.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-center pt-6">
        <Button asChild size="lg" className="text-base">
          <Link to="/blogs">
            View all Blogs
            <ChevronRight strokeWidth={2.25} />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default BlogSection;

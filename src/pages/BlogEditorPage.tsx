import { useParams } from "react-router-dom";
import BlogEditor from "@/components/BlogEditor";

const BlogEditorPage = () => {
  const { blogType } = useParams<{ blogType: string }>();
  
  if (!blogType || !["biblepeacefinder", "forgetcheck", "digitalproduct"].includes(blogType)) {
    return <div>Invalid blog type</div>;
  }

  return <BlogEditor blogType={blogType as "biblepeacefinder" | "forgetcheck" | "digitalproduct"} />;
};

export default BlogEditorPage;
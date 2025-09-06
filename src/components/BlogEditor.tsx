import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bold, Italic, Underline, Link, Type, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogEditorProps {
  blogType: "biblepeacefinder" | "forgetcheck" | "digitalproduct";
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blogType }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [fontSize, setFontSize] = useState("16");
  const [alsoAvailableEnabled, setAlsoAvailableEnabled] = useState(false);
  const [alsoAvailableUrl, setAlsoAvailableUrl] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const blogTitles = {
    biblepeacefinder: "Bible PeaceFinder",
    forgetcheck: "ForgetCheck.com",
    digitalproduct: "Digital Product"
  };

  const formatText = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      document.execCommand('createLink', false, url);
      editorRef.current?.focus();
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleBlur = () => {
    if (editorRef.current) {
      let html = editorRef.current.innerHTML;
      
      // Auto-detect URLs ending with .com, .in, .org
      html = html.replace(
        /(?<!href=["'])(https?:\/\/)?([a-zA-Z0-9-]+\.(?:com|in|org))(?!["'])/gi,
        (match, protocol, domain) => {
          const url = protocol ? match : `https://${domain}`;
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${match}</a>`;
        }
      );
      
      if (html !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = html;
        setContent(html);
      }
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and content.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);

    try {
      // Compose final content with optional "Also Available @" for digital product
      let finalContent = content;
      if (blogType === "digitalproduct" && alsoAvailableEnabled && alsoAvailableUrl.trim()) {
        const safeUrl = alsoAvailableUrl.trim();
        const prefixedUrl = /^https?:\/\//i.test(safeUrl) ? safeUrl : `https://${safeUrl}`;
        const appendix = `<p style="margin-top: 1rem; font-weight: 600;">Also Available @ <a href="${prefixedUrl}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${prefixedUrl}</a></p>`;
        finalContent = `${finalContent}${appendix}`;
      }
      let tableName: "blog_biblepeacefinder" | "blog_forgetcheck" | "blog_digitalproduct";
      if (blogType === "biblepeacefinder") {
        tableName = "blog_biblepeacefinder";
      } else if (blogType === "forgetcheck") {
        tableName = "blog_forgetcheck";
      } else {
        tableName = "blog_digitalproduct";
      }
      
      const { data, error } = await supabase
        .from(tableName)
        .insert({
          title: title.trim(),
          content: finalContent
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Blog published to ${blogTitles[blogType]} successfully.`,
      });

      // Reset form
      setTitle("");
      setContent("");
      setAlsoAvailableEnabled(false);
      setAlsoAvailableUrl("");
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      
      // Navigate back to main form
      navigate("/");
    } catch (error) {
      console.error('Error publishing blog:', error);
      toast({
        title: "Error",
        description: "Failed to publish blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Blog Editor - {blogTitles[blogType]}
          </h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Type className="h-5 w-5 mr-2" />
              Create New Blog Post
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Also Available toggle (Digital Product only) */}
            {blogType === "digitalproduct" && (
              <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                <label className="text-sm font-medium text-gray-700 mr-4">Also Available @ (optional)</label>
                <div className="flex items-center gap-3">
                  <Switch checked={alsoAvailableEnabled} onCheckedChange={setAlsoAvailableEnabled} />
                  <Input
                    type="text"
                    value={alsoAvailableUrl}
                    onChange={(e) => setAlsoAvailableUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-72"
                    disabled={!alsoAvailableEnabled}
                  />
                </div>
              </div>
            )}

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog title..."
                className="text-lg"
              />
            </div>

            {/* Editor Toolbar */}
            <div className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12px</SelectItem>
                    <SelectItem value="14">14px</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="18">18px</SelectItem>
                    <SelectItem value="20">20px</SelectItem>
                    <SelectItem value="24">24px</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => formatText('bold')}
                >
                  <Bold className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => formatText('italic')}
                >
                  <Italic className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => formatText('underline')}
                >
                  <Underline className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={insertLink}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </div>

              {/* Rich Text Editor */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleContentChange}
                onBlur={handleBlur}
                className="min-h-[300px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                style={{ fontSize: `${fontSize}px` }}
                suppressContentEditableWarning={true}
                data-placeholder="Start writing your blog content..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Type URLs ending with .com, .in, or .org and they'll automatically become clickable links.
              </p>
            </div>

            {/* Publish Button */}
            <div className="flex justify-end">
              <Button
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
              >
                {isPublishing ? "Publishing..." : "Publish Blog"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogEditor;
import { useState } from "react";
import useAxiosInstance from "../../lib/useAxiosInstance";

function BlogForm({ onClose }) {
  const axiosInstance = useAxiosInstance();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axiosInstance.post(
        "/api/studentBlog/createBlog",
        {
          title: title.trim(),
          description: content.trim()
        }
      );

      if (response.data.status) {
        alert("Blog submitted for approval! Our team will review it.");

        setTitle("");
        setContent("");

        if (onClose) {
          onClose();
        }
      } else {
        alert(response.data.message || "Failed to submit blog");
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong while submitting the blog");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 md:p-12 text-white">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Voice of the Students
          </h2>

          <p className="text-indigo-100 mb-8 text-lg">
            Share your journey, tips, and experiences with the Project Pioneer community.
          </p>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Blog Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-indigo-500 placeholder-indigo-200 text-white border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-white focus:bg-indigo-600"
                required
              />
            </div>

            <div>
              <textarea
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full bg-indigo-500 placeholder-indigo-200 text-white border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-white focus:bg-indigo-600 resize-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-8 py-3 rounded-lg"
              >
                {isLoading ? "Submitting..." : "Submit for Approval"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default BlogForm;
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import BlogDetailModal from "./BlogDetailModal";
import useAxiosInstance from "../../lib/useAxiosInstance";
import PageHeader from "../PageHeader";
import BlogCard from "./BlogCard";

function BlogContent() {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedBlog, setSelectedBlog] = useState(null);

  const limit = 6;

  const { data, isLoading } = useQuery(
    ["allBlogs", page],
    async () => {
      const res = await axiosInstance.get(
        `/api/studentBlog/allBlogs?page=${page}&limit=${limit}`
      );
      return res.data;
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  const allBlogs = data?.data?.blogs || [];
  const pagination = data?.data?.pagination || {};

  const approvedBlogs = allBlogs.filter((blog) => blog.isApproved);
  const pendingBlogs = allBlogs.filter((blog) => !blog.isApproved);

  const approveMutation = useMutation(
    async (blogId) => {
      return axiosInstance.patch(`/api/studentBlog/approveBlog/${blogId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("allBlogs");
        setSelectedBlog(null);
      },
    }
  );

  const blogsToShow = activeTab === "approved" ? approvedBlogs : pendingBlogs;

  const openBlogDetail = (blog) => {
    setSelectedBlog(blog);
  };

  return (
    <div className="min-h-screen">
      <PageHeader name="Student Blogs" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-2 ${
              activeTab === "pending"
                ? "border-b-2 border-indigo-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Pending Blogs
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`pb-2 ${
              activeTab === "approved"
                ? "border-b-2 border-indigo-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Approved Blogs
          </button>
        </div>

        {isLoading && (
          <p className="text-center text-gray-500">Loading blogs...</p>
        )}

        {!isLoading && blogsToShow.length > 0 && (
          <>
            {/* Blog Grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogsToShow.map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => openBlogDetail(blog)}
                  className="bg-white rounded-lg p-6 hover:shadow-lg cursor-pointer transition-shadow border border-slate-100 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-sm text-indigo-600 font-medium mb-1">
                      {blog.studentId?.personalInfo?.fullName || "Student"}
                    </p>

                    <p className="text-sm text-slate-500 mb-4">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {activeTab === "pending" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        approveMutation.mutate(blog._id);
                      }}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                  )}
                </div>
              ))}
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogsToShow.map((blog) => (
                <BlogCard
                  key={blog._id}
                  activeTab={activeTab}
                  blog={blog}
                  onApprove={(id) => approveMutation.mutate(id)}
                  onOpen={openBlogDetail}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-4 py-2">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}

        {!isLoading && blogsToShow.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No blogs found.</p>
          </div>
        )}
      </div>

      {/* Blog Modal */}
      <BlogDetailModal
        blog={selectedBlog}
        isPendingView={activeTab === "pending"}
        onApprove={(id) => approveMutation.mutate(id)}
        onClose={() => setSelectedBlog(null)}
      />
    </div>
  );
}

export default BlogContent;
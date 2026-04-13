import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Edit3, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import PageHeader from "../PageHeader";
import useAxiosInstance from "../../lib/useAxiosInstance";
import ExperienceContentForm from "./ExperienceContentForm";

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncateText = (value = "", maxLength = 180) =>
  value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;

const scopeFilters = [
  { value: "", label: "All Modules" },
  { value: "WELCOME", label: "Welcome" },
  { value: "DASHBOARD", label: "Dashboard" },
  { value: "RESOURCES", label: "Resources" },
  { value: "EXPLORE_CITY", label: "Explore City" },
];

const typeLabelMap = {
  TARGET_EXAM: "Target Exam",
  UPCOMING_EVENT: "Upcoming Event",
  NEXT_STEP: "Next Step",
  CONTINUE_ACTIVITY: "Continue Activity",
  RESOURCE: "Resource",
  NEARBY_EVENT: "Nearby Event",
  INSTITUTION: "Institution",
  COMPETITION: "Competition",
};

export default function StudentExperienceManager() {
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();

  const [scopeFilter, setScopeFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const { data, isLoading, isError } = useQuery(
    ["student-experience-admin", scopeFilter, keyword],
    async () => {
      const res = await axios.get("/api/student-experience", {
        params: {
          contentScope: scopeFilter || undefined,
          keyword: keyword || undefined,
        },
      });
      return res.data;
    },
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const records = useMemo(() => data?.data || [], [data]);

  const closeForm = () => {
    setFormOpen(false);
    setEditData(null);
  };

  const handleSubmitContent = async (payload) => {
    try {
      if (editData?._id) {
        await axios.patch(`/api/student-experience/${editData._id}`, payload);
        toast.success("Content updated successfully");
      } else {
        await axios.post("/api/student-experience", payload);
        toast.success("Content added successfully");
      }

      await queryClient.invalidateQueries("student-experience-admin");
      closeForm();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to save student experience content"
      );
    }
  };

  const handleDelete = async (item) => {
    try {
      await axios.delete(`/api/student-experience/${item._id}`);
      toast.success("Content deleted successfully");
      await queryClient.invalidateQueries("student-experience-admin");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete content");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader name="Experience Content" />

      <main className="p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] bg-slate-900 p-8 text-white shadow-sm">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
              <Sparkles size={14} />
              Student Experience CMS
            </p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold">
                  Manage onboarding, dashboard, resources, and local opportunity content.
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Publish grade-specific exams, interest-based events, downloadable
                  resources, city institutions, competitions, and dashboard actions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600"
              >
                <Plus size={18} />
                Add Content
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 rounded-[24px] bg-white p-5 shadow-sm">
            <div className="relative min-w-[260px] flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Search by title, category, or location"
                className="w-full rounded-2xl border border-slate-200 py-3 pl-12 pr-4"
              />
            </div>

            <select
              value={scopeFilter}
              onChange={(event) => setScopeFilter(event.target.value)}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
            >
              {scopeFilters.map((scope) => (
                <option key={scope.value} value={scope.value}>
                  {scope.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {isLoading ? (
              <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm xl:col-span-2">
                Loading content...
              </div>
            ) : isError ? (
              <div className="rounded-3xl bg-white p-10 text-center text-red-500 shadow-sm xl:col-span-2">
                Failed to load content.
              </div>
            ) : records.length ? (
              records.map((item) => (
                <article
                  key={item._id}
                  className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
                          {item.contentScope?.replace("_", " ")}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                          {typeLabelMap[item.contentType] || item.contentType}
                        </span>
                        {item.isActive ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-rose-600">
                            Draft
                          </span>
                        )}
                      </div>
                      <h2 className="mt-4 text-2xl font-bold text-slate-900">
                        {item.title}
                      </h2>
                      {item.subtitle && (
                        <p className="mt-2 text-sm font-medium text-slate-500">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditData(item);
                          setFormOpen(true);
                        }}
                        className="rounded-2xl bg-slate-100 p-3 text-slate-700 hover:bg-slate-200"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="rounded-2xl bg-rose-50 p-3 text-rose-600 hover:bg-rose-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {truncateText(
                      stripHtml(item.description) || "No description provided."
                    )}
                  </p>

                  {item.mediaFiles?.length > 0 && (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {item.mediaFiles.length} media file
                      {item.mediaFiles.length > 1 ? "s" : ""} attached
                    </p>
                  )}

                  <div className="mt-5 grid gap-3 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700 md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-slate-900">Category:</span>{" "}
                      {item.categoryLabel || "General"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Date:</span>{" "}
                      {item.dateLabel || "Not set"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Grades:</span>{" "}
                      {item.gradeCategories?.length
                        ? item.gradeCategories.join(", ")
                        : "All"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Interests:</span>{" "}
                      {item.interestTags?.length
                        ? item.interestTags.join(", ")
                        : "All"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Location:</span>{" "}
                      {item.locationLabel || item.distanceLabel || "Not set"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">City:</span>{" "}
                      {item.cityName || "All Cities"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Action:</span>{" "}
                      {item.actionLabel || "Not set"}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm xl:col-span-2">
                <h3 className="text-xl font-bold text-slate-900">
                  No content found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Add your first onboarding, dashboard, resource, or city listing.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <ExperienceContentForm
        isOpen={formOpen}
        onClose={closeForm}
        editData={editData}
        onSubmitContent={handleSubmitContent}
      />
    </div>
  );
}

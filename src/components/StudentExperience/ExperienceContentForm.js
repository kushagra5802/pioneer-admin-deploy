import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "react-query";
import { Select } from "antd";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import { ImagePlus, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

import useAxiosInstance from "../../lib/useAxiosInstance";
import indianCitiesByState from "../../assets/data/Indian_Cities_In_States.json";
import "react-quill/dist/quill.snow.css";

const schema = Yup.object({
  contentScope: Yup.string().required("Content scope is required"),
  contentType: Yup.string().required("Content type is required"),
  title: Yup.string().required("Title is required"),
});

const scopeOptions = [
  { value: "WELCOME", label: "Welcome Page" },
  { value: "DASHBOARD", label: "Dashboard" },
  { value: "RESOURCES", label: "Resources" },
  { value: "EXPLORE_CITY", label: "Explore City/District" },
];

const typeOptionsByScope = {
  WELCOME: [
    { value: "TARGET_EXAM", label: "Target Exam" },
    { value: "UPCOMING_EVENT", label: "Upcoming Event" },
  ],
  DASHBOARD: [
    { value: "NEXT_STEP", label: "Next Step" },
    { value: "UPCOMING_EVENT", label: "Upcoming Talk/Event" },
    { value: "CONTINUE_ACTIVITY", label: "Continue Activity" },
  ],
  RESOURCES: [{ value: "RESOURCE", label: "Resource" }],
  EXPLORE_CITY: [
    { value: "NEARBY_EVENT", label: "Nearby Event" },
    { value: "INSTITUTION", label: "Institution" },
    { value: "COMPETITION", label: "Competition" },
  ],
};

const resourceCategoryOptions = [
  "Downloadable Guides",
  "Educational Content",
  "Career Awareness Material",
];

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { size: ["small", false, "large", "huge"] }],
    ["clean"],
  ],
};

const fieldConfigByType = {
  TARGET_EXAM: {
    title: "Card heading shown in the welcome preview section.",
    description: "Supporting copy shown below the title.",
    categoryLabel: "Exam category/tag shown above the title.",
    dateLabel: "Month/date text shown on the card.",
    gradeCategories: "Comma-separated grades that should see this exam card.",
    displayOrder: "Lower values appear first in the welcome card list.",
  },
  UPCOMING_EVENT: {
    title: "Event title shown in Welcome or Dashboard.",
    description: "Short context for the event card.",
    categoryLabel: "Event category/type such as Sports, Arts, or Live Webinar.",
    actionLabel: "Button text for dashboard event cards.",
    actionLink: "Client route or URL opened from dashboard event cards.",
    dateLabel: "Date text shown on the event card.",
    locationLabel: "Venue/location shown for welcome and local event cards.",
    gradeCategories: "Comma-separated grades targeted by this event.",
    interestTags: "Comma-separated interests used for event matching.",
    displayOrder: "Lower values appear first among event cards.",
  },
  NEXT_STEP: {
    title: "Widget title shown in the dashboard card.",
    description: "Next-step explanation shown under the title.",
    actionLabel: "Button text shown on the widget CTA.",
    actionLink: "Client route or URL opened when the user clicks CTA.",
    gradeCategories: "Comma-separated grades targeted by this widget.",
    interestTags: "Comma-separated interests for optional personalization.",
    displayOrder: "Lower values appear first among matching dashboard widgets.",
  },
  CONTINUE_ACTIVITY: {
    title: "Activity card heading shown in Continue Activity.",
    description: "Progress/resume text shown under the activity title.",
    actionLink: "Client route opened when the student clicks the activity card.",
    gradeCategories: "Comma-separated grades targeted by this activity.",
    interestTags: "Comma-separated interests for optional personalization.",
    displayOrder: "Lower values appear first among continue-activity cards.",
  },
  RESOURCE: {
    title: "Resource title shown to students.",
    subtitle: "Secondary line shown under the title on resource cards.",
    description:
      "Rich text resource body. You can format text using bold, underline, lists, colors, and size.",
    categoryLabel:
      "Choose an existing category or type a new one. New categories are accepted automatically.",
    actionLabel: "Optional CTA label such as Download PDF or Open Module.",
    actionLink: "Optional public URL or route opened from the resource card.",
    dateLabel:
      "Resource metadata such as Exam prep · Class 11–12 · 6 min read.",
    mediaFiles:
      "Upload a cover image or video. Media is stored in S3 and shown on the client resource card.",
    gradeCategories: "Comma-separated grades, or leave blank for all grades.",
    interestTags: "Comma-separated interests, or leave blank for all interests.",
    displayOrder: "Lower values appear first inside the resource section.",
  },
  NEARBY_EVENT: {
    title: "Nearby event title shown in Explore City.",
    description: "Optional local event summary.",
    categoryLabel: "Interest/category label such as Sports, Arts, or Hobbies.",
    dateLabel: "Date text shown on the nearby event card.",
    locationLabel: "Venue or address line for the local event.",
    cityName: "City filter value used on the client Explore City page.",
    interestTags: "Comma-separated interests used to personalize nearby events.",
    displayOrder: "Lower values appear first in Nearby Events.",
  },
  INSTITUTION: {
    title: "Institution name shown in Explore City.",
    description: "Optional institution summary.",
    categoryLabel: "Institution type such as Skill Institution or Learning Hub.",
    locationLabel: "Institution area/address line.",
    cityName: "City filter value used on the client Explore City page.",
    distanceLabel: "Distance text shown under the institution name.",
    displayOrder: "Lower values appear first in Nearby Institutions.",
  },
  COMPETITION: {
    title: "Competition/opportunity title shown in Explore City.",
    description: "Optional details about eligibility or theme.",
    categoryLabel: "Opportunity level such as Local, State, or National.",
    dateLabel: "Deadline/date text shown on competition cards.",
    cityName: "City filter value used on the client Explore City page.",
    interestTags: "Comma-separated interests for optional city-feed matching.",
    displayOrder: "Lower values appear first in Competitions & Events.",
  },
};

const fieldConfigByScopeType = {
  "WELCOME:UPCOMING_EVENT": {
    title: "Event title shown in the welcome preview section.",
    description: "Short context for the local event card.",
    categoryLabel: "Interest/category label such as Sports, Arts, or Hobbies.",
    dateLabel: "Date text shown on the welcome event card.",
    locationLabel: "Venue/location shown on the event card.",
    gradeCategories: "Comma-separated grades targeted by this event.",
    interestTags: "Comma-separated interests used for event matching.",
    displayOrder: "Lower values appear first in the welcome card list.",
  },
};

const defaultValues = {
  contentScope: "WELCOME",
  contentType: "TARGET_EXAM",
  title: "",
  subtitle: "",
  description: "",
  categoryLabel: "",
  actionLabel: "",
  actionLink: "",
  dateLabel: "",
  locationLabel: "",
  cityName: "",
  distanceLabel: "",
  gradeCategories: "",
  interestTags: "",
  mediaFiles: [],
  displayOrder: 1,
  isActive: true,
};

const parseCsv = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function ExperienceContentForm({
  isOpen,
  onClose,
  editData,
  onSubmitContent,
}) {
  const axios = useAxiosInstance();
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [resourceCategories, setResourceCategories] = useState(
    resourceCategoryOptions
  );

  const { data: resourceCategoryResponse } = useQuery(
    "student-experience-resource-categories",
    async () => {
      const response = await axios.get("/api/student-experience", {
        params: {
          contentScope: "RESOURCES",
          contentType: "RESOURCE",
        },
      });

      return response.data;
    },
    {
      enabled: isOpen,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const selectedScope = watch("contentScope") || "WELCOME";
  const selectedType = watch("contentType");
  const descriptionValue = watch("description") || "";
  const categoryLabelValue = watch("categoryLabel") || "";
  const mediaFiles = watch("mediaFiles") || [];

  const cityOptions = useMemo(
    () =>
      Array.from(new Set(Object.values(indianCitiesByState).flat()))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    []
  );

  const visibleFieldConfig =
    fieldConfigByScopeType[`${selectedScope}:${selectedType}`] ||
    fieldConfigByType[selectedType] ||
    {};

  const activeTypeOptions = useMemo(
    () => typeOptionsByScope[selectedScope] || [],
    [selectedScope]
  );

  useEffect(() => {
    if (
      activeTypeOptions.length &&
      !activeTypeOptions.some((option) => option.value === selectedType)
    ) {
      setValue("contentType", activeTypeOptions[0].value);
    }
  }, [activeTypeOptions, selectedType, setValue]);

  useEffect(() => {
    const fetchedCategories = (resourceCategoryResponse?.data || [])
      .map((item) => item?.categoryLabel)
      .filter(Boolean);

    if (fetchedCategories.length) {
      setResourceCategories((current) =>
        Array.from(new Set([...current, ...fetchedCategories]))
      );
    }
  }, [resourceCategoryResponse]);

  useEffect(() => {
    if (editData?._id) {
      reset({
        contentScope: editData.contentScope || "WELCOME",
        contentType: editData.contentType || "TARGET_EXAM",
        title: editData.title || "",
        subtitle: editData.subtitle || "",
        description: editData.description || "",
        categoryLabel: editData.categoryLabel || "",
        actionLabel: editData.actionLabel || "",
        actionLink: editData.actionLink || "",
        dateLabel: editData.dateLabel || "",
        locationLabel: editData.locationLabel || "",
        cityName: editData.cityName || "",
        distanceLabel: editData.distanceLabel || "",
        gradeCategories: (editData.gradeCategories || []).join(", "),
        interestTags: (editData.interestTags || []).join(", "),
        mediaFiles: editData.mediaFiles || [],
        displayOrder: editData.displayOrder || 1,
        isActive: editData.isActive ?? true,
      });

      if (
        editData.categoryLabel &&
        !resourceCategoryOptions.includes(editData.categoryLabel)
      ) {
        setResourceCategories((current) =>
          current.includes(editData.categoryLabel)
            ? current
            : [...current, editData.categoryLabel]
        );
      }
      return;
    }

    reset(defaultValues);
  }, [editData, reset, isOpen]);

  if (!isOpen) return null;

  const shouldShow = (fieldName) => Boolean(visibleFieldConfig[fieldName]);

  const InputField = ({ name, label, helper, placeholder, type = "text" }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full rounded-lg border bg-white px-4 py-3 ${
          errors?.[name]?.message ? "border-red-400" : "border-slate-200"
        }`}
      />
      {errors?.[name]?.message && (
        <span className="text-xs text-red-500">{errors[name]?.message}</span>
      )}
      {helper && <span className="text-xs leading-5 text-slate-500">{helper}</span>}
    </div>
  );

  const SelectField = ({ name, label, helper, options }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </label>
      <select
        {...register(name)}
        className={`w-full rounded-lg border bg-white px-4 py-3 ${
          errors?.[name]?.message ? "border-red-400" : "border-slate-200"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors?.[name]?.message && (
        <span className="text-xs text-red-500">{errors[name]?.message}</span>
      )}
      {helper && <span className="text-xs leading-5 text-slate-500">{helper}</span>}
    </div>
  );

  const handleCategoryChange = (values) => {
    const nextCategory = values?.[0] || "";
    setValue("categoryLabel", nextCategory, { shouldDirty: true });

    if (nextCategory) {
      setResourceCategories((current) =>
        current.includes(nextCategory) ? current : [...current, nextCategory]
      );
    }
  };

  const handleMediaUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("media", file));

    try {
      setUploadingMedia(true);
      const response = await axios.post(
        "/api/student-experience/mediaUpload",
        formData
      );

      setValue("mediaFiles", [...mediaFiles, ...(response?.data?.data || [])], {
        shouldDirty: true,
      });
      toast.success("Media uploaded successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to upload resource media"
      );
    } finally {
      setUploadingMedia(false);
      event.target.value = "";
    }
  };

  const removeMediaFile = (index) => {
    setValue(
      "mediaFiles",
      mediaFiles.filter((_, mediaIndex) => mediaIndex !== index),
      { shouldDirty: true }
    );
  };

  const submitHandler = async (values) => {
    await onSubmitContent({
      ...values,
      categoryLabel: values.categoryLabel || "",
      gradeCategories: parseCsv(values.gradeCategories),
      interestTags: parseCsv(values.interestTags).map((item) =>
        item.toLowerCase()
      ),
      mediaFiles,
      displayOrder: Number(values.displayOrder) || 1,
      isActive: Boolean(values.isActive),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-slate-100 shadow-2xl">
        <div className="flex items-center justify-between bg-slate-800 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {editData?._id ? "Edit Content" : "Add Content"}
              </h2>
              <p className="text-sm text-slate-400">
                Configure welcome, dashboard, resources, and city content
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600"
          >
            <X className="h-5 w-5 text-slate-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6 p-8">
          <section className="grid gap-4 rounded-xl bg-white p-6 md:grid-cols-2">
            <SelectField
              name="contentScope"
              label="Module Scope"
              helper="Select where this content will appear in the student app."
              options={scopeOptions}
            />
            <SelectField
              name="contentType"
              label="Content Type"
              helper="Choose the widget/card type available under the selected scope."
              options={activeTypeOptions}
            />

            {shouldShow("title") && (
              <InputField
                name="title"
                label="Title"
                helper={visibleFieldConfig.title}
                placeholder="Title"
              />
            )}

            {shouldShow("subtitle") && (
              <InputField
                name="subtitle"
                label="Subtitle"
                helper={visibleFieldConfig.subtitle}
                placeholder="Subtitle shown below the resource title"
              />
            )}

            {shouldShow("categoryLabel") &&
              (selectedType === "RESOURCE" ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Category Label
                  </label>
                  <Select
                    mode="tags"
                    maxCount={1}
                    value={categoryLabelValue ? [categoryLabelValue] : []}
                    onChange={handleCategoryChange}
                    options={resourceCategories.map((category) => ({
                      label: category,
                      value: category,
                    }))}
                    placeholder="Select or type a resource category"
                  />
                  <span className="text-xs leading-5 text-slate-500">
                    {visibleFieldConfig.categoryLabel}
                  </span>
                </div>
              ) : (
                <InputField
                  name="categoryLabel"
                  label="Category Label"
                  helper={visibleFieldConfig.categoryLabel}
                  placeholder="Category / Tag / Section"
                />
              ))}

            {shouldShow("description") && (
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Description
                </label>
                {selectedType === "RESOURCE" ? (
                  <ReactQuill
                    theme="snow"
                    value={descriptionValue}
                    onChange={(value) =>
                      setValue("description", value, { shouldDirty: true })
                    }
                    modules={quillModules}
                    className="rounded-lg bg-white"
                  />
                ) : (
                  <textarea
                    rows={4}
                    placeholder="Description"
                    {...register("description")}
                    className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3"
                  />
                )}
                <span className="text-xs leading-5 text-slate-500">
                  {visibleFieldConfig.description}
                </span>
              </div>
            )}

            {shouldShow("actionLabel") && (
              <InputField
                name="actionLabel"
                label="Action Label"
                helper={visibleFieldConfig.actionLabel}
                placeholder="Action Label"
              />
            )}

            {shouldShow("actionLink") && (
              <InputField
                name="actionLink"
                label="Action Link"
                helper={visibleFieldConfig.actionLink}
                placeholder="Action Link (route or URL)"
              />
            )}

            {shouldShow("dateLabel") && (
              <InputField
                name="dateLabel"
                label="Date Label"
                helper={visibleFieldConfig.dateLabel}
                placeholder="Date Label"
              />
            )}

            {shouldShow("locationLabel") && (
              <InputField
                name="locationLabel"
                label="Location"
                helper={visibleFieldConfig.locationLabel}
                placeholder="Location"
              />
            )}

            {shouldShow("cityName") && (
              <SelectField
                name="cityName"
                label="City"
                helper={visibleFieldConfig.cityName}
                options={[
                  { value: "", label: "All Cities" },
                  ...cityOptions.map((city) => ({ value: city, label: city })),
                ]}
              />
            )}

            {shouldShow("distanceLabel") && (
              <InputField
                name="distanceLabel"
                label="Distance / Meta"
                helper={visibleFieldConfig.distanceLabel}
                placeholder="Distance / Secondary Meta"
              />
            )}

            {shouldShow("gradeCategories") && (
              <InputField
                name="gradeCategories"
                label="Grade Categories"
                helper={visibleFieldConfig.gradeCategories}
                placeholder="Grades e.g. 11,12 or 8,9,10"
              />
            )}

            {shouldShow("interestTags") && (
              <InputField
                name="interestTags"
                label="Interest Tags"
                helper={visibleFieldConfig.interestTags}
                placeholder="Interests e.g. sports, arts, hobbies"
              />
            )}

            {shouldShow("displayOrder") && (
              <InputField
                name="displayOrder"
                label="Display Order"
                helper={visibleFieldConfig.displayOrder}
                placeholder="Display Order"
                type="number"
              />
            )}

            {shouldShow("mediaFiles") && (
              <div className="md:col-span-2 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Resource Media
                  </label>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {visibleFieldConfig.mediaFiles}
                  </p>
                </div>

                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  <ImagePlus size={18} />
                  {uploadingMedia ? "Uploading..." : "Upload Image or Video"}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleMediaUpload}
                  />
                </label>

                {mediaFiles.length > 0 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {mediaFiles.map((file, index) => {
                      const isVideo = file?.mimetype?.startsWith("video");

                      return (
                        <div
                          key={file.guid || file.key || index}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                        >
                          <div className="aspect-video bg-slate-100">
                            {isVideo ? (
                              <video
                                src={file.publicUrl}
                                className="h-full w-full object-cover"
                                controls
                              />
                            ) : (
                              <img
                                src={file.publicUrl}
                                alt={file.name || "Resource media"}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-3 p-4">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {file.name || "Uploaded file"}
                              </p>
                              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                                {isVideo ? "Video" : "Image"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMediaFile(index)}
                              className="rounded-xl bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>

          <div className="flex items-center justify-between rounded-xl bg-white px-6 py-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 accent-indigo-500"
              />
              Publish content
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || uploadingMedia}
                className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Save Content"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

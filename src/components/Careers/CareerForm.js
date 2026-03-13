"use client";

import { useState } from "react";
import { X, Briefcase, Building2, GraduationCap, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";

import useAxiosInstance from "../../lib/useAxiosInstance";

/* -------------------- CONSTANTS -------------------- */

const industries = [
  "Computer Science & IT",
  "Law, Policy & Governance",
  "Medicine & Clinical Health",
  "Engineering & Manufacturing",
  "Finance & Banking",
  "Arts & Design",
  "Education & Research",
];

/* -------------------- VALIDATION -------------------- */

const schema = Yup.object({
  title: Yup.string().required("Career title required"),
  industry: Yup.string().required("Industry required"),
  description: Yup.string().required("Description required"),
  progression: Yup.string().required("Progression path required"),
});

/* -------------------- LIST INPUT (OUTSIDE COMPONENT) -------------------- */

const ListInput = ({
  label,
  items,
  setItems,
  newItem,
  setNewItem,
  placeholder,
  icon,
  addToList,
  removeFromList,
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      {icon}
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </h4>
    </div>

    <div className="flex gap-2">
      <input
        type="text"
        placeholder={placeholder}
        value={newItem || ""}
        autoComplete="off"
        onChange={(e) => setNewItem(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addToList(items, setItems, newItem, setNewItem);
          }
        }}
        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200"
      />
      <button
        type="button"
        onClick={() =>
          addToList(items, setItems, newItem, setNewItem)
        }
        className="px-3 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>

    {items.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm"
          >
            {item}
            <button
              type="button"
              onClick={() =>
                removeFromList(items, setItems, index)
              }
              className="text-slate-400 hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    )}
  </div>
);

/* -------------------- COMPONENT -------------------- */

const CareerForm = ({ isOpen, onClose }) => {
  const axios = useAxiosInstance();

  const [keySkills, setKeySkills] = useState([]);
  const [topInstitutionsIndia, setTopInstitutionsIndia] = useState([]);
  const [globalPathways, setGlobalPathways] = useState([]);

  const [newSkill, setNewSkill] = useState("");
  const [newInstitution, setNewInstitution] = useState("");
  const [newPathway, setNewPathway] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  if (!isOpen) return null;

  /* -------------------- HELPERS -------------------- */

  const addToList = (list, setList, value, setValue) => {
    if (!value?.trim()) return;

    const clean = value.trim();

    if (list.includes(clean)) {
      toast.warning("Item already added");
      return;
    }

    setList([...list, clean]);
    setValue("");
  };

  const removeFromList = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  /* -------------------- SUBMIT -------------------- */

  const onSubmit = async (values) => {
    if (keySkills.length === 0) {
      toast.error("At least one skill is required");
      return;
    }

    try {
      await axios.post("/api/careers", {
        ...values,
        keySkills,
        topInstitutionsIndia,
        globalPathways,
      });

      toast.success("Career added successfully");

      reset();
      setKeySkills([]);
      setTopInstitutionsIndia([]);
      setGlobalPathways([]);
      setNewSkill("");
      setNewInstitution("");
      setNewPathway("");

      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to save career"
      );
    }
  };

  /* -------------------- INPUTS -------------------- */

  const InputField = ({ name, placeholder, type = "text" }) => (
    <div className="flex flex-col gap-1.5">
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full px-4 py-3 rounded-lg border bg-white
          ${errors?.[name]?.message
            ? "border-red-400"
            : "border-slate-200"}`}
      />
      {errors?.[name]?.message && (
        <span className="text-xs text-red-500">
          {errors[name]?.message}
        </span>
      )}
    </div>
  );

  const SelectField = ({ name, options }) => (
    <div className="flex flex-col gap-1.5">
      <select
        {...register(name)}
        className={`w-full px-4 py-3 rounded-lg border bg-white
          ${errors?.[name]?.message
            ? "border-red-400"
            : "border-slate-200"}`}
      >
        <option value="">Select Industry</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {errors?.[name]?.message && (
        <span className="text-xs text-red-500">
          {errors[name]?.message}
        </span>
      )}
    </div>
  );

  /* -------------------- UI -------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl mx-4 bg-slate-100 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-800 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Add Career
              </h2>
              <p className="text-slate-400 text-sm">
                Fill in the career details below
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 space-y-6"
        >
          {/* Career Info */}
          <section className="bg-white p-6 rounded-xl space-y-4">
            <InputField name="title" placeholder="Career Title" />
            <SelectField name="industry" options={industries} />

            <textarea
              placeholder="What the role entails..."
              rows={3}
              {...register("description")}
              className={`w-full px-4 py-3 rounded-lg border resize-none
                ${
                  errors?.description
                    ? "border-red-400"
                    : "border-slate-200"
                }`}
            />
            {errors?.description && (
              <span className="text-xs text-red-500">
                {errors.description.message}
              </span>
            )}

            <InputField
              name="progression"
              placeholder="Career Progression"
            />
          </section>

          {/* Skills */}
          <section className="bg-white p-6 rounded-xl">
            <ListInput
              label="Key Skills"
              items={keySkills}
              setItems={setKeySkills}
              newItem={newSkill}
              setNewItem={setNewSkill}
              placeholder="Add skill"
              icon={<Building2 className="w-4 h-4 text-indigo-500" />}
              addToList={addToList}
              removeFromList={removeFromList}
            />
          </section>

          {/* Institutions */}
          <section className="bg-slate-800 p-6 rounded-xl space-y-6">
            <ListInput
              label="Top Institutions (India)"
              items={topInstitutionsIndia}
              setItems={setTopInstitutionsIndia}
              newItem={newInstitution}
              setNewItem={setNewInstitution}
              placeholder="Add institution"
              icon={<GraduationCap className="w-4 h-4 text-indigo-400" />}
              addToList={addToList}
              removeFromList={removeFromList}
            />

            <ListInput
              label="Global Pathways"
              items={globalPathways}
              setItems={setGlobalPathways}
              newItem={newPathway}
              setNewItem={setNewPathway}
              placeholder="Add global institution"
              icon={<GraduationCap className="w-4 h-4 text-indigo-400" />}
              addToList={addToList}
              removeFromList={removeFromList}
            />
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-indigo-500 text-white rounded-lg"
            >
              {isSubmitting ? "Saving..." : "Save Career"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareerForm;

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { X, GraduationCap, MapPin, Award, Plus, Globe } from "lucide-react"
import useAxiosInstance from "../../lib/useAxiosInstance"

const ranks = [
  "NAAC A/A+ College",
  "NAAC A College",
  "NAAC B++ College",
  "NAAC B+ College",
  "NIRF Top 100",
  "Institution of Eminence",
]

const modeOfEntryOptions = ["Merit-based", "Entrance Exam", "Both Merit & Entrance"]

const acceptanceRateOptions = [
  "Highly selective",
  "Very selective",
  "Selective",
  "Moderately selective",
  "Open admission",
]

const cutOffTrendOptions = ["Stable / Competitive", "Rising", "Declining", "Fluctuating"]

/* =======================
   YUP SCHEMA
======================= */

const validationSchema = Yup.object().shape({
  name: Yup.string().required("University name required"),
  city: Yup.string().required("City required"),
  state: Yup.string().required("State required"),
  rank: Yup.string().required("Rank/Accreditation required"),
  modeOfEntry: Yup.string().required("Mode of entry required"),
  acceptanceRate: Yup.string().required("Acceptance rate required"),
  cutOffTrend: Yup.string().required("Cut-off trend required"),
  websiteUrl: Yup.string().url("Enter a valid URL").nullable(),
})

export default function UniversityForm({ isOpen, onClose }) {
  const axios = useAxiosInstance()
  const [isLoading, setIsLoading] = useState(false)

  const [entranceExams, setEntranceExams] = useState([])
  const [newExam, setNewExam] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      city: "",
      state: "",
      rank: "",
      modeOfEntry: "",
      acceptanceRate: "",
      cutOffTrend: "",
      websiteUrl: "",
    },
  })

  if (!isOpen) return null

  /* =======================
     ENTRANCE EXAMS
  ======================= */

  const addExam = () => {
    if (newExam.trim() && !entranceExams.includes(newExam.trim())) {
      setEntranceExams([...entranceExams, newExam.trim()])
      setNewExam("")
    }
  }

  const removeExam = (index) => {
    setEntranceExams(entranceExams.filter((_, i) => i !== index))
  }

  /* =======================
     SUBMIT TO API
  ======================= */

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      await axios.post("/api/university", {
        name: data.name,
        city: data.city,
        state: data.state,
        rankAccreditation: data.rank,
        modeOfEntry: data.modeOfEntry,
        acceptanceRate: data.acceptanceRate,
        cutOffTrend: data.cutOffTrend,
        officialWebsite: data.websiteUrl,
        entranceExams,
      })

      reset()
      setEntranceExams([])
      onClose()
    } catch (error) {
      console.error("Failed to save university:", error)
      alert("Failed to save university")
    } finally {
      setIsLoading(false)
    }
  }

  /* =======================
     UI HELPERS
  ======================= */

  const InputField = ({ name, placeholder, type = "text", icon }) => (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`w-full px-4 py-3 rounded-lg border bg-white placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-teal-500
            ${icon ? "pl-11" : ""}
            ${errors[name] ? "border-red-400" : "border-slate-200"}`}
        />
      </div>
      {errors[name] && (
        <span className="text-xs text-red-500">{errors[name]?.message}</span>
      )}
    </div>
  )

  const SelectField = ({ name, placeholder, options }) => (
    <div className="flex flex-col gap-1.5">
      <select
        {...register(name)}
        className={`w-full px-4 py-3 rounded-lg border bg-white
          focus:outline-none focus:ring-2 focus:ring-teal-500
          ${errors[name] ? "border-red-400" : "border-slate-200"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors[name] && (
        <span className="text-xs text-red-500">{errors[name]?.message}</span>
      )}
    </div>
  )

  /* =======================
     MODAL UI
  ======================= */

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
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Add University</h2>
              <p className="text-slate-400 text-sm">
                Fill in the institution details below
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          {/* Institution Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4">
              Institution Information
            </h3>

            <div className="space-y-4">
              <InputField name="name" placeholder="University/College Name" />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="city"
                  placeholder="City"
                  icon={<MapPin className="w-4 h-4" />}
                />
                <InputField name="state" placeholder="State" />
              </div>

              <SelectField
                name="rank"
                placeholder="Select Rank/Accreditation"
                options={ranks}
              />
            </div>
          </div>

          {/* Admission */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4">
              Admission Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  name="modeOfEntry"
                  placeholder="Mode of Entry"
                  options={modeOfEntryOptions}
                />
                <SelectField
                  name="acceptanceRate"
                  placeholder="Acceptance Rate"
                  options={acceptanceRateOptions}
                />
              </div>

              <SelectField
                name="cutOffTrend"
                placeholder="Cut-off Trend (Last 3 years)"
                options={cutOffTrendOptions}
              />
            </div>
          </div>

          {/* Entrance Exams */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-4">
              Entrance Exams
            </h3>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add entrance exam (e.g., JEE, CUET)"
                value={newExam}
                onChange={(e) => setNewExam(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addExam()
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-700 text-white"
              />
              <button
                type="button"
                onClick={addExam}
                className="px-3 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {entranceExams.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entranceExams.map((exam, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-slate-200 rounded-lg text-sm"
                  >
                    {exam}
                    <button
                      type="button"
                      onClick={() => removeExam(index)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Website */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <InputField
              name="websiteUrl"
              placeholder="https://www.university.edu"
              type="url"
              icon={<Globe className="w-4 h-4" />}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save University"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

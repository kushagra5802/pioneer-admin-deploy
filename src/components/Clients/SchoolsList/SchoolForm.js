"use client";

import React, { useContext, useEffect, useState } from "react";
import { X, School, User, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import useAxiosInstance from "../../../lib/useAxiosInstance";
import SchoolContext from "../../../context/schoolContext";

const schema = Yup.object({
  schoolName: Yup.string().required("School name required"),
  board: Yup.string().required("Board required"),
  state: Yup.string().required("State required"),
  city: Yup.string().required("City required"),

  adminFirstName: Yup.string().required("First name required"),
  adminLastName: Yup.string().required("Last name required"),
  adminEmail: Yup.string()
    .email("Invalid email")
    .required("Email required"),
  adminPhone: Yup.string().required("Phone number required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password required")
});

const SchoolForm = ({ isOpen, mode = "add", schoolId, onClose }) => {
  const adminUser = JSON.parse(localStorage.getItem("admin-user"));
  const isSuperAdmin = adminUser?.type === "superadmin";
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  const schoolContext = useContext(SchoolContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur"
  });

  const closeModal = () => {
    schoolContext.updateOpenModal(false);
    onClose();
    reset();
  };

  useEffect(() => {
    if (mode === "edit" && schoolId) {
      axiosInstance.get(`api/schools/${schoolId}`).then((res) => {
        reset({
          schoolName: res.data.data.schoolName,
          board: res.data.data.board,
          state: res.data.data.state,
          city: res.data.data.city,
          adminFirstName: res.data.data.adminFirstName,
          adminLastName: res.data.data.adminLastName,
          adminEmail: res.data.data.adminEmail,
          adminPhone: res.data.data.adminPhone,
          password: res.data.data.password,
          confirmPassword: res.data.data.password
        });
      });
    }
  }, [mode, schoolId]);

  const createSchool = useMutation(
    (data) => axiosInstance.post("api/schools", data),
    {
      onSuccess: () => {
        toast.success("School created successfully");
        queryClient.invalidateQueries("schools");
        closeModal();
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Something went wrong"
        );
      }
    }
  );

  const updateSchool = useMutation(
    (data) => axiosInstance.put(`api/schools/${schoolId}`, data),
    {
      onSuccess: () => {
        toast.success("School updated successfully");
        queryClient.invalidateQueries("schools");
        closeModal();
      }
    }
  );

  const onSubmit = ({ confirmPassword, ...values }) => {
    if (mode === "edit") {
      updateSchool.mutate(values);
    } else {
      createSchool.mutate(values);
    }
  };

  if (!isOpen) return null;

  const canTogglePassword =
  (mode === "add") ||
  (mode === "edit" && isSuperAdmin);

  const InputField = ({ name, placeholder, type = "text" }) => (
    <div className="flex flex-col gap-1.5">
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full px-4 py-3 rounded-lg border bg-white text-slate-900 placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
          ${errors[name] ? "border-red-400" : "border-slate-200"}`}
      />
      {errors[name] && (
        <span className="text-xs text-red-500">
          {errors[name]?.message}
        </span>
      )}
    </div>
  );

  const PasswordField = ({ name, placeholder, show, onToggle }) => (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          {...register(name)}
          className={`w-full px-4 py-3 pr-12 rounded-lg border bg-white text-slate-900 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
            ${errors[name] ? "border-red-400" : "border-slate-200"}`}
        />
        <button
          type="button"
          onClick={canTogglePassword ? onToggle : undefined}
          disabled={!canTogglePassword}
          className={`absolute right-3 top-1/2 -translate-y-1/2 
            ${canTogglePassword 
              ? "text-slate-400 hover:text-slate-600 cursor-pointer" 
              : "text-slate-300 cursor-not-allowed"}
          `}
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {errors[name] && (
        <span className="text-xs text-red-500">
          {errors[name]?.message}
        </span>
      )}
    </div>
  );
  const isEditMode = mode === "edit";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-slate-100 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-800 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {mode === "edit" ? "Edit School" : "Add School"}
              </h2>
              <p className="text-slate-400 text-sm">
                Fill in the details below
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          {/* School Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-5">
              <School className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-slate-500 uppercase">
                School Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputField name="schoolName" placeholder="School Name" />
              </div>
              <InputField name="board" placeholder="Board (CBSE, ICSE, State)" />
              <InputField name="state" placeholder="State" />
              <div className="md:col-span-2">
                <InputField name="city" placeholder="City" />
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-semibold text-slate-500 uppercase">
                Admin Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="adminFirstName" placeholder="First Name" />
              <InputField name="adminLastName" placeholder="Last Name" />
              <InputField name="adminEmail" placeholder="Email Address" />
              <InputField name="adminPhone" placeholder="Phone Number" />
            </div>
          </div>

          {/* Security */}
          <div className="bg-slate-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Lock className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-semibold text-slate-400 uppercase">
                Security
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PasswordField
                name="password"
                placeholder="Password"
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
              <PasswordField
                name="confirmPassword"
                placeholder="Confirm Password"
                show={showConfirmPassword}
                onToggle={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
            </div>
            <p className="text-slate-500 text-xs mt-3">
              Password must be at least 8 characters long
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 rounded-lg text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSchool.isLoading || isSubmitting}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {createSchool.isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                mode === "edit" ? "Update School" : "Save School"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolForm;

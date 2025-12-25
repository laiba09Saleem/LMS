"use client";

import React from "react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, className = "", ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;

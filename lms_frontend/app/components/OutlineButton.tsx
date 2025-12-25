"use client";

import React from "react";

interface OutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const OutlineButton: React.FC<OutlineButtonProps> = ({ label, className = "", ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full border border-slate-600 bg-transparent px-6 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-slate-400 hover:bg-slate-900/60 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};

export default OutlineButton;

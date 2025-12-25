import React from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = "left",
}) => {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-2 ${alignment}`}>
      {eyebrow && (
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-sm text-slate-400 sm:text-base">{description}</p>
      )}
    </div>
  );
};

export default SectionHeading;

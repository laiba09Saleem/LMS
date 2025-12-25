
"use client";

import Image from "next/image";
import PrimaryButton from "@/app/components/PrimaryButton";
import OutlineButton from "@/app/components/OutlineButton";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center lg:py-24">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs text-slate-300 ring-1 ring-slate-700/70">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Trusted by learners worldwide</span>
            <span className="h-4 w-px bg-slate-700" />
            <span className="font-semibold text-emerald-300">4.9/5 rating</span>
          </div>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Learn New Skills
            <span className="block bg-gradient from-emerald-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              Unlock Your Potential
            </span>
          </h1>

          <p className="max-w-xl text-sm text-slate-300 sm:text-base">
            A practical-first learning platform with world-class mentors, real projects,
            and personalized learning paths to help you grow faster in your career.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <PrimaryButton label="Enroll Now" />
            <OutlineButton label="Watch Our Story" className="inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs">
                ▶
              </span>
              <span>Watch Our Story</span>
            </OutlineButton>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 text-xs text-slate-300 sm:text-sm">
            <div>
              <div className="font-semibold text-white">1k+ Courses</div>
              <div className="text-slate-400">From beginner to advanced levels</div>
            </div>
            <div>
              <div className="font-semibold text-white">100+ Mentors</div>
              <div className="text-slate-400">Learn from industry experts</div>
            </div>
            <div>
              <div className="font-semibold text-white">95% Success Rate</div>
              <div className="text-slate-400">Learners achieve their goals</div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" />

            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/80 backdrop-blur">
              <div className="relative overflow-hidden rounded-2xl bg-slate-900">
                <Image
                  src="/images/lms-hero-student.png"
                  alt="Student learning online"
                  width={520}
                  height={520}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="rounded-2xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
                  <div className="text-[10px] uppercase tracking-wide text-slate-400">
                    Live Classes
                  </div>
                  <div className="text-sm font-semibold text-white">25+ ongoing now</div>
                </div>
                <div className="rounded-2xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
                  <div className="text-[10px] uppercase tracking-wide text-slate-400">
                    Career Tracks
                  </div>
                  <div className="text-sm font-semibold text-white">Design, Dev, Data</div>
                </div>
                <div className="rounded-2xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
                  <div className="text-[10px] uppercase tracking-wide text-slate-400">
                    Avg. Rating
                  </div>
                  <div className="text-sm font-semibold text-emerald-300">4.9 / 5.0</div>
                </div>
                <div className="rounded-2xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
                  <div className="text-[10px] uppercase tracking-wide text-slate-400">
                    Active Learners
                  </div>
                  <div className="text-sm font-semibold text-white">12k+ this month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;


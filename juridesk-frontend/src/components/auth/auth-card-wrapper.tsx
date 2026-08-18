import type { ReactNode } from "react"
import { Scale, ShieldCheck } from "lucide-react"
import Image from "next/image"

export function AuthCardWrapper({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f6f4ef] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_-30px_rgba(45,36,22,0.35)] lg:grid-cols-[1.08fr_0.92fr] sm:min-h-[calc(100vh-3rem)]">
        <section className="relative hidden overflow-hidden bg-[#121212] p-10 text-[#E1E1E1] lg:flex lg:flex-col">
          <Image
            src="/argu.png"
            alt="Courtroom hearing at an Indian labour and industrial tribunal"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/95 via-[#121212]/60 to-[#121212]/30" />
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_15%_15%,#c79745_0,transparent_28%),radial-gradient(circle_at_86%_74%,#58706b_0,transparent_34%)]" />
          <div className="relative flex items-center gap-3 text-lg font-semibold tracking-tight">
            <span className="grid size-10 place-items-center rounded-xl bg-[#c69542] text-[#121212] shadow-lg shadow-black/20">
              <Scale className="size-5" aria-hidden="true" />
            </span>
            JuriDesk
          </div>

          <div className="relative my-auto max-w-md">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-[#dcb86f]">Legal work, made simpler</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#E1E1E1]">A clearer desk for your most important work.</h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-stone-300">Research, organize, and move every matter forward with the focus your practice deserves.</p>
          </div>

          <div className="relative flex items-center gap-3 text-sm text-stone-300">
            <ShieldCheck className="size-5 text-[#dcb86f]" aria-hidden="true" />
            Your work stays private and protected.
          </div>
        </section>

        <section className="flex min-h-full items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-9 flex items-center gap-3 lg:hidden">
              <span className="grid size-10 place-items-center rounded-xl bg-[#121212] text-[#dcb86f]">
                <Scale className="size-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-[#121212]">JuriDesk</span>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

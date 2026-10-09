// import Link from "next/link";
// import { ArrowRight, Bot, ChevronRight, CircleCheck, ClipboardList, Search, Sparkles } from "lucide-react";
// import IngredientTag from "../features/compatibility/atoms/IngredientTag";

// const QUICK_SEARCH = ["Retinol", "Niacinamide", "Vitamin C", "Hyaluronic Acid", "AHA / BHA", "Ceramides"];

// const STEPS = [
//   {
//     icon: Search,
//     title: "Search Ingredients",
//     href: "/ingredients",
//     body: "Look up any ingredient and get a plain-English breakdown of what it does, who it's for, and what to avoid pairing it with.",
//   },
//   {
//     icon: CircleCheck,
//     title: "Check Compatibility",
//     href: "/compatibility",
//     body: "Paste two or more products and see instantly if their actives play nicely together, or if one is cancelling out the other.",
//   },
//   {
//     icon: Bot,
//     title: "Ask the AI",
//     href: "/assistant",
//     body: "Our AI reads ingredient lists, interprets your skin type, and gives you a straight answer — no jargon, no upsell.",
//   },
//   {
//     icon: ClipboardList,
//     title: "Build Your Routine",
//     href: "/routine",
//     body: "Layer your chosen products into a morning and evening routine sequenced correctly — pH-first, actives spaced, SPF last.",
//   },
// ] as const;

// const STATS = [
//   ["12,000+", "Ingredients"],
//   ["48,000+", "Products indexed"],
//   ["200k+", "Questions answered"],
// ] as const;

// export default function HomePage() {
//   return (
//     <>
//       {/* Hero */}
//       <section className="bg-[var(--sw-mint)] py-20 md:py-28">
//         <div className="sw-container flex flex-col items-center text-center">
//           <span className="sw-small inline-flex items-center gap-1.5 rounded-full border border-[var(--sw-line)] bg-[var(--sw-cream)] px-3 py-1 text-[var(--sw-green)]">
//             <Sparkles size={13} aria-hidden /> AI-powered skincare intelligence
//           </span>

//           <h1 className="mt-6">
//             Skincare ingredients,
//             <br />
//             finally made simple.
//           </h1>

//           <p className="mt-5 max-w-xl text-[1.0625rem] text-[var(--sw-forest)]/85">
//             SkinWise decodes your product labels, flags ingredient conflicts, and answers your skincare questions — so
//             you can build a routine that actually works.
//           </p>

//           <form
//             action="/ingredients"
//             role="search"
//             className="mt-9 flex w-full max-w-[34rem] overflow-hidden rounded-[var(--radius-control)] border border-[var(--sw-line)] bg-[var(--sw-cream)] focus-within:border-[var(--sw-green)]"
//           >
//             <label htmlFor="hero-search" className="sr-only">
//               Search an ingredient or product
//             </label>
//             <Search size={18} aria-hidden className="ml-4 self-center text-[var(--sw-muted)]" />
//             <input
//               id="hero-search"
//               name="q"
//               type="search"
//               placeholder="Search an ingredient or product…"
//               className="min-w-0 flex-1 bg-transparent px-3 py-3.5 font-[family-name:var(--font-display)] text-[0.9375rem] outline-none placeholder:text-[var(--sw-muted)]/70"
//             />
//             <button type="submit" className="sw-btn sw-btn-primary !rounded-none !px-7">
//               Search
//             </button>
//           </form>

//           <ul className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Popular ingredients">
//             {QUICK_SEARCH.map((name) => (
//               <li key={name}>
//                 <Link href={`/ingredients?q=${encodeURIComponent(name)}`}>
//                   <IngredientTag label={name} className="hover:border-[var(--sw-green)]" />
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* How it works */}
//       <section className="bg-[var(--sw-mint-alt)] py-20">
//         <div className="sw-container">
//           <p className="sw-eyebrow">How it works</p>
//           <h2 className="mt-2">Four steps to a smarter routine</h2>

//           <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
//             {STEPS.map(({ icon: Icon, title, body, href }, i) => (
//               <li key={title} className="sw-card flex flex-col p-6">
//                 <div className="flex items-start justify-between">
//                   <span className="grid size-10 place-items-center rounded-[var(--radius-control)] border border-[var(--sw-line)] bg-[var(--sw-mint)] text-[var(--sw-green)]">
//                     <Icon size={18} strokeWidth={1.75} aria-hidden />
//                   </span>
//                   <span className="sw-small text-[var(--sw-green)]">Step {String(i + 1).padStart(2, "0")}</span>
//                 </div>
//                 <h3 className="mt-5">{title}</h3>
//                 <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-[var(--sw-charcoal)]">{body}</p>
//                 <Link
//                   href={href}
//                   className="sw-small mt-6 inline-flex items-center gap-1 text-[var(--sw-green)] hover:text-[var(--sw-forest)]"
//                 >
//                   Learn more <ChevronRight size={14} aria-hidden />
//                 </Link>
//               </li>
//             ))}
//           </ol>
//         </div>
//       </section>

//       {/* AI assistant */}
//       <section className="bg-[var(--sw-mint)] py-20">
//         <div className="sw-container grid items-center gap-12 lg:grid-cols-2">
//           <div>
//             <p className="sw-eyebrow">AI Assistant</p>
//             <h2 className="mt-2 max-w-md">Ask anything about your skin, your products, or your routine.</h2>
//             <p className="mt-5 max-w-md">
//               Our AI reads ingredient lists the way a dermatologist would — catching interactions, flagging irritants,
//               and translating clinical names into plain English.
//             </p>
//             <Link href="/assistant" className="sw-btn sw-btn-primary mt-7">
//               Try the AI Assistant <ArrowRight size={16} aria-hidden />
//             </Link>

//             <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
//               {STATS.map(([value, label]) => (
//                 <div key={label}>
//                   <dt className="sr-only">{label}</dt>
//                   <dd className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sw-forest)]">
//                     {value}
//                   </dd>
//                   <dd className="sw-small text-[var(--sw-muted)]" aria-hidden>
//                     {label}
//                   </dd>
//                 </div>
//               ))}
//             </dl>
//           </div>

//           {/* Static chat preview */}
//           <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--sw-line)] bg-[var(--sw-cream)]">
//             <div className="flex items-center gap-3 bg-[var(--sw-forest)] px-5 py-3.5">
//               <span className="grid size-8 place-items-center rounded-full border border-[var(--sw-soft)]/50 text-[var(--sw-soft)]">
//                 <Bot size={16} aria-hidden />
//               </span>
//               <div className="leading-tight">
//                 <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-white">SkinWise AI</p>
//                 <p className="sw-small text-[0.75rem] text-[var(--sw-soft)]">Online · responds instantly</p>
//               </div>
//             </div>

//             <div className="space-y-4 p-5">
//               <p className="ml-auto w-fit max-w-[85%] rounded-[var(--radius-control)] bg-[var(--sw-green)] px-4 py-2.5 text-[0.9375rem] leading-snug text-white">
//                 Can I use my Vitamin C serum and retinol on the same night?
//               </p>
//               <div className="flex items-start gap-2">
//                 <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-[var(--sw-line)] text-[var(--sw-green)]">
//                   <Bot size={12} aria-hidden />
//                 </span>
//                 <div className="max-w-[88%] space-y-3 rounded-[var(--radius-control)] border border-[var(--sw-line)] bg-[var(--sw-mint)] px-4 py-3 text-[0.9375rem] leading-snug">
//                   <p>
//                     Layering both on the same night is generally not recommended — Vitamin C works best at a low pH
//                     while retinol prefers a neutral environment, so they can destabilise each other and cause
//                     irritation.
//                   </p>
//                   <p>
//                     A smarter approach: use Vitamin C in the morning (it pairs well with SPF) and retinol in your
//                     evening routine.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <Link
//               href="/assistant"
//               className="flex items-center justify-between gap-3 border-t border-[var(--sw-line)] px-5 py-3"
//             >
//               <span className="sw-small text-[var(--sw-muted)]">Ask about an ingredient or product…</span>
//               <span className="sw-btn sw-btn-primary !px-4 !py-1.5 !text-[0.8125rem]">Ask</span>
//             </Link>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }


import type { Metadata } from "next";
import CompatibilityPage from "../pages/CompatibilityPage";

export const metadata: Metadata = {
  title: "Compatibility Checker",
  description: "Check whether two skincare products work together, and when to use each one.",
};

export default function Page() {
  return <CompatibilityPage />;
}
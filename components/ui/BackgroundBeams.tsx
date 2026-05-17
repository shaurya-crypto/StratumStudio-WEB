// "use client";

// import { useState, useEffect } from "react";

// interface Beam {
//   id: number; d: string; delay: number; duration: number;
//   color: string; opacity: number; width: number;
// }

// export default function BackgroundBeams() {
//   const [beams, setBeams] = useState<Beam[]>([]);

//   useEffect(() => {
//     // Generate beams client-side only to avoid hydration mismatch
//     const seed = (i: number, range: number) => ((i * 17 + 7) % 100) / 100 * range;
//     setBeams(
//       Array.from({ length: 10 }, (_, i) => {
//         const startX = seed(i, 100);
//         const endX = startX + seed(i + 3, 40) - 20;
//         return {
//           id: i,
//           d: `M${startX} -10 C${startX + seed(i + 1, 20) - 10} 30, ${endX + seed(i + 2, 20) - 10} 70, ${endX} 110`,
//           delay: i * 0.9,
//           duration: 5 + seed(i + 4, 3),
//           color: i % 3 === 0 ? "#3B82F6" : i % 3 === 1 ? "#8B5CF6" : "#06B6D4",
//           opacity: 0.06 + seed(i + 5, 0.06),
//           width: 0.5 + seed(i + 6, 1.5),
//         };
//       })
//     );
//   }, []);

//   if (!beams.length) return null;

//   return (
//     <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
//       <svg viewBox="0 0 100 100" preserveAspectRatio="none"
//         className="absolute inset-0 h-full w-full" style={{ filter: "blur(0.5px)" }}>
//         <defs>
//           {beams.map((b) => (
//             <linearGradient key={`g-${b.id}`} id={`beam-grad-${b.id}`} x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor={b.color} stopOpacity="0" />
//               <stop offset="40%" stopColor={b.color} stopOpacity={b.opacity} />
//               <stop offset="60%" stopColor={b.color} stopOpacity={b.opacity} />
//               <stop offset="100%" stopColor={b.color} stopOpacity="0" />
//             </linearGradient>
//           ))}
//           <filter id="beam-glow">
//             <feGaussianBlur stdDeviation="1.5" result="blur" />
//             <feComposite in="SourceGraphic" in2="blur" operator="over" />
//           </filter>
//         </defs>
//         {beams.map((b) => (
//           <path key={b.id} d={b.d}
//             stroke={`url(#beam-grad-${b.id})`} strokeWidth={b.width}
//             fill="none" filter="url(#beam-glow)"
//             pathLength="100"
//             className="animate-beam"
//             style={{ animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s` }}
//           />
//         ))}
//       </svg>
//     </div>
//   );
// }

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface ThemeState {
//   theme: "dark" | "light";
//   toggle: () => void;
//   setTheme: (theme: "dark" | "light") => void;
// }

// export const useTheme = create<ThemeState>()(
//   persist(
//     (set) => ({
//       theme: "dark", // default theme
//       toggle: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
//       setTheme: (theme) => set({ theme }),
//     }),
//     {
//       name: "electrocode-theme",
//     }
//   )
// );

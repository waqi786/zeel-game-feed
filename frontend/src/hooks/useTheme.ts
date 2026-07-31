import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export function useTheme() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const apply = () => {
      const preference = user?.themePreference ?? (localStorage.getItem("zeel-theme") as "system" | "dark" | "light" | null) ?? "system";
      const dark =
        preference === "dark" ||
        (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("light", !dark);
    };
    apply();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [user?.themePreference]);
}

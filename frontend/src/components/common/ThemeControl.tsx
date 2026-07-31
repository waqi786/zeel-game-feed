import { Monitor, Moon, Sun } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export function ThemeControl() {
  const user = useAuthStore((state) => state.user);
  const updateTheme = useAuthStore((state) => state.updateTheme);
  const preference = user?.themePreference ?? (localStorage.getItem("zeel-theme") as "system" | "dark" | "light" | null) ?? "system";

  const next = preference === "system" ? "dark" : preference === "dark" ? "light" : "system";
  const Icon = preference === "system" ? Monitor : preference === "dark" ? Moon : Sun;

  const change = async () => {
    localStorage.setItem("zeel-theme", next);
    if (user) {
      await updateTheme(next);
    } else {
      document.documentElement.classList.toggle("light", next === "light");
    }
  };

  return (
    <button className="pointer-events-auto icon-btn" onClick={() => void change()} aria-label="Theme">
      <Icon size={18} />
    </button>
  );
}

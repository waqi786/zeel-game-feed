import clsx from "clsx";
import { useAuthStore } from "../../store/authStore";
import { useFeedStore } from "../../store/feedStore";

const tabs = [
  { id: "following", label: "Following" },
  { id: "for-you", label: "For You" }
] as const;

export function DiscoveryRail({ onAuth }: { onAuth: () => void }) {
  const { feedMode, setFeedMode } = useFeedStore();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="pointer-events-auto fixed inset-x-0 top-[58px] z-30 mx-auto max-w-[600px] px-4 lg:top-[68px] lg:max-w-[500px]">
      <div className="flex items-center justify-center gap-6">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === "following" && !user) {
                onAuth();
                return;
              }
              setFeedMode(item.id);
            }}
            className={clsx(
              "relative h-9 px-1 text-base font-black text-white transition",
              feedMode === item.id ? "opacity-100" : "opacity-55 hover:opacity-85"
            )}
          >
            {item.label}
            {feedMode === item.id ? (
              <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-white" />
            ) : null}
            {item.id === "following" ? (
              <span className="absolute -right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-zeel-primary" />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

import { Volume2, VolumeX } from "lucide-react";
import { useAudioStore } from "../../store/audioStore";

export function AudioControl() {
  const { muted, toggleMuted } = useAudioStore();
  const Icon = muted ? VolumeX : Volume2;
  return (
    <button
      onClick={toggleMuted}
      className={muted ? "audio-btn" : "audio-btn audio-btn-live"}
      aria-label={muted ? "Unmute" : "Mute"}
    >
      <Icon size={18} />
      <span className="text-xs font-black">{muted ? "Muted" : "Live"}</span>
    </button>
  );
}

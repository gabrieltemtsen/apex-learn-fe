'use client';
import { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title?: string;
  onProgress?: (seconds: number) => void;
}

export default function VideoPlayer({ src, title, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); }
    else { videoRef.current.play(); }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    setProgress(duration ? (currentTime / duration) * 100 : 0);
    onProgress?.(Math.floor(currentTime));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  const fullscreen = () => videoRef.current?.requestFullscreen();

  return (
    <div className="relative bg-black rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        muted={muted}
      />

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer" onClick={handleSeek}>
          <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggle} className="text-white hover:text-indigo-400 transition-colors">
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={() => setMuted(!muted)} className="text-white hover:text-indigo-400 transition-colors">
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          {title && <span className="text-white/80 text-sm flex-1 truncate">{title}</span>}
          <button onClick={fullscreen} className="text-white hover:text-indigo-400 transition-colors ml-auto">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Play button overlay when paused */}
      {!playing && (
        <button
          onClick={toggle}
          className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-600/90 flex items-center justify-center">
            <Play className="w-7 h-7 text-white ml-1" />
          </div>
        </button>
      )}
    </div>
  );
}

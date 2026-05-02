import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface VideoCardProps {
  src: string;
  title: string;
  caption: string;
  duration: string;
  poster?: string;
}

const VideoCard = ({ src, title, caption, duration, poster }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="video-card" ref={containerRef}>
      <div className="video-card__thumbnail" onClick={togglePlay}>
        {isVisible && (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-cover"
            preload="metadata"
            playsInline
            onEnded={() => setIsPlaying(false)}
          />
        )}
        {!isPlaying && (
          <div className="video-card__play-overlay">
            <div className="video-card__play-btn">
              <Play className="w-6 h-6 text-primary ml-0.5" fill="currentColor" />
            </div>
          </div>
        )}
        {isPlaying && (
          <div className="video-card__play-overlay" style={{ opacity: 0 }}>
            <div className="video-card__play-btn">
              <Pause className="w-6 h-6 text-primary" fill="currentColor" />
            </div>
          </div>
        )}
        <span className="video-card__duration">{duration}</span>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-base mb-1 line-clamp-2">{title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2">{caption}</p>
      </div>
    </div>
  );
};

export default VideoCard;

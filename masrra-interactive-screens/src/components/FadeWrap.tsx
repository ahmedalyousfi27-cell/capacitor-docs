import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface FadeWrapProps {
  children: React.ReactNode;
  duration: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
  overlap: number;
}

export const FadeWrap: React.FC<FadeWrapProps> = ({
  children,
  duration,
  fadeIn = false,
  fadeOut = false,
  overlap,
}) => {
  const frame = useCurrentFrame();

  const fadeInOpacity = fadeIn
    ? interpolate(frame, [0, overlap], [0, 1], { extrapolateRight: "clamp" })
    : 1;

  const fadeOutOpacity = fadeOut
    ? interpolate(frame, [duration - overlap, duration], [1, 0], {
        extrapolateLeft: "clamp",
      })
    : 1;

  const opacity = Math.min(fadeInOpacity, fadeOutOpacity);

  return (
    <div style={{ opacity }}>
      {children}
    </div>
  );
};

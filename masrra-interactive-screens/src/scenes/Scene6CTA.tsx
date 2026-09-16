import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../theme";

export const Scene6CTA: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.accent,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 64, color: colors.bg, margin: 0 }}>
          ابدأ الآن
        </h1>
        <p style={{ fontSize: 28, color: colors.lavender, marginTop: 20 }}>
          Masrra.com
        </p>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../theme";

export const Scene1Hook: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
        fontWeight: "bold",
        color: colors.text,
      }}
    >
      🎉 مسرة
    </AbsoluteFill>
  );
};

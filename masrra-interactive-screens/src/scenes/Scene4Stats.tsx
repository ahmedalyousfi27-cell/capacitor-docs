import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../theme";

export const Scene4Stats: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <div style={{ textAlign: "center", color: colors.text }}>
          <h1 style={{ fontSize: 48 }}>أرقام مميزة</h1>
          <p style={{ fontSize: 24 }}>ملايين الدعوات تم إنشاؤها</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

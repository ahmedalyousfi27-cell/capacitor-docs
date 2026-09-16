import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, fontFamily } from "../theme";

export const TemplatesScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 10], [0.5, 1]);
  const cardsRotate = interpolate(frame, [0, 30], [-5, 0]);
  const card1Y = interpolate(frame, [0, 20], [40, 0]);
  const card2Y = interpolate(frame, [5, 25], [40, 0]);
  const card3Y = interpolate(frame, [10, 30], [40, 0]);

  const templates = [
    { emoji: "💍", name: "زفاف", color: "#B99AE8" },
    { emoji: "🍽️", name: "عشاء", color: "#C7A15F" },
    { emoji: "🎉", name: "حفلة", color: "#70508D" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        padding: "40px 30px",
        fontFamily,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* الرأس */}
      <div style={{ opacity: headerOpacity }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: colors.text,
            margin: "0 0 8px 0",
            textAlign: "right",
          }}
        >
          اختر قالبك المفضل
        </h1>
        <p
          style={{
            fontSize: 13,
            color: colors.muted,
            margin: 0,
            textAlign: "right",
          }}
        >
          قوالب فاخرة ومتنوعة
        </p>
      </div>

      {/* شبكة القوالب */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
          flex: 1,
        }}
      >
        {templates.map((template, i) => {
          const yOffsets = [card1Y, card2Y, card3Y];
          const hoverScale = interpolate(frame, [5 + i * 5, 15 + i * 5], [1, 1.08]);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: 16,
                borderRadius: 20,
                background: `linear-gradient(135deg, ${template.color}22, ${template.color}11)`,
                border: `2px solid ${template.color}44`,
                transform: `translateY(${yOffsets[i]}px) scale(${hoverScale})`,
                transition: "all 0.1s ease-out",
                cursor: "pointer",
              }}
            >
              {/* أيقونة القالب */}
              <div
                style={{
                  fontSize: 48,
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                {template.emoji}
              </div>

              {/* اسم القالب */}
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: colors.text,
                  margin: 0,
                  textAlign: "center",
                }}
              >
                {template.name}
              </p>

              {/* خط ذهبي أسفل */}
              <div
                style={{
                  width: 20,
                  height: 2,
                  background: template.color,
                  borderRadius: 999,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* أزرار التنقل */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 12,
          borderTop: `1px solid ${colors.accent}22`,
        }}
      >
        <button
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: `1px solid ${colors.accent}66`,
            background: "transparent",
            color: colors.accent,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily,
          }}
        >
          السابق
        </button>

        <div style={{ fontSize: 12, color: colors.muted }}>
          {templates.length} من {templates.length}
        </div>

        <button
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: colors.accent,
            color: "#FFF",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily,
          }}
        >
          التالي
        </button>
      </div>
    </AbsoluteFill>
  );
};

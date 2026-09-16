import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, fontFamily } from "../theme";

export const DashboardScreen: React.FC = () => {
  const frame = useCurrentFrame();

  // تأثيرات حركية
  const headerOpacity = interpolate(frame, [0, 10], [0.5, 1]);
  const menuSlide = interpolate(frame, [0, 15], [-40, 0]);
  const cardsOpacity = interpolate(frame, [10, 25], [0, 1]);
  const chartScale = interpolate(frame, [15, 30], [0.8, 1]);

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        padding: "40px 30px",
        fontFamily,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* الرأس */}
      <div style={{ opacity: headerOpacity }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: colors.text,
            margin: "0 0 8px 0",
            textAlign: "right",
          }}
        >
          مرحبا بك في مسرة
        </h1>
        <p
          style={{
            fontSize: 14,
            color: colors.muted,
            margin: 0,
            textAlign: "right",
          }}
        >
          لوحة التحكم الرئيسية
        </p>
      </div>

      {/* القائمة الجانبية والمحتوى */}
      <div style={{ display: "flex", gap: 16, flex: 1 }}>
        {/* القائمة الجانبية */}
        <div
          style={{
            width: 100,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            transform: `translateX(${menuSlide}px)`,
          }}
        >
          {["الرئيسية", "الدعوات", "القوالب", "الإحصائيات"].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 12,
                textAlign: "right",
                background: i === 0 ? colors.accent : "transparent",
                color: i === 0 ? "#FFF" : colors.muted,
                fontWeight: i === 0 ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* المحتوى الرئيسي */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, opacity: cardsOpacity }}>
          {/* بطاقات الإحصائيات */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "إجمالي الدعوات", value: "145" },
              { label: "معدل الفتح", value: "82%" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: `linear-gradient(135deg, ${colors.lavender}22, ${colors.accent}11)`,
                  border: `1px solid ${colors.accent}33`,
                  borderRadius: 12,
                  padding: 12,
                  textAlign: "right",
                }}
              >
                <p style={{ fontSize: 11, color: colors.muted, margin: "0 0 4px 0" }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: 20, fontWeight: 700, color: colors.accent, margin: 0 }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* رسم بياني بسيط */}
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.accent}11, ${colors.lavender}11)`,
              border: `1px solid ${colors.accent}33`,
              borderRadius: 12,
              padding: 12,
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              gap: 6,
              transform: `scale(${chartScale})`,
              transformOrigin: "bottom center",
            }}
          >
            {[40, 65, 45, 75, 55, 70].map((height, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${(height / 100) * 60}px`,
                  background: `linear-gradient(180deg, ${colors.decorativeGold}, ${colors.accent})`,
                  borderRadius: 4,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

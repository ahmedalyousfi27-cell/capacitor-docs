import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, fontFamily } from "../theme";

export const DetailsScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 10], [0.5, 1]);
  const field1Scale = interpolate(frame, [0, 15], [0.9, 1]);
  const field2Scale = interpolate(frame, [5, 20], [0.9, 1]);
  const field3Scale = interpolate(frame, [10, 25], [0.9, 1]);
  const previewScale = interpolate(frame, [15, 35], [0.8, 1]);
  const previewOpacity = interpolate(frame, [15, 25], [0, 1]);

  const fields = [
    { label: "اسم الحدث", value: "حفل الزفاف", icon: "✨" },
    { label: "التاريخ والوقت", value: "15 ذو القعدة 1445", icon: "📅" },
    { label: "الموقع", value: "قصر الريان - الرياض", icon: "📍" },
  ];

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
            fontSize: 26,
            fontWeight: 700,
            color: colors.text,
            margin: "0 0 8px 0",
            textAlign: "right",
          }}
        >
          أضف التفاصيل
        </h1>
        <p
          style={{
            fontSize: 13,
            color: colors.muted,
            margin: 0,
            textAlign: "right",
          }}
        >
          معلومات الحدث
        </p>
      </div>

      {/* حقول الإدخال */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {fields.map((field, i) => {
          const scales = [field1Scale, field2Scale, field3Scale];
          return (
            <div
              key={i}
              style={{
                transform: `scale(${scales[i]})`,
                transformOrigin: "right center",
                transition: "transform 0.05s ease-out",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: 6,
                  textAlign: "right",
                }}
              >
                {field.icon} {field.label}
              </label>
              <input
                type="text"
                value={field.value}
                readOnly
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: `1px solid ${colors.accent}44`,
                  background: `linear-gradient(135deg, ${colors.accent}11, ${colors.lavender}11)`,
                  color: colors.text,
                  fontSize: 13,
                  fontFamily,
                  textAlign: "right",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* معاينة صغيرة */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.accent}11, ${colors.lavender}11)`,
          border: `1px solid ${colors.accent}33`,
          borderRadius: 12,
          padding: 14,
          transform: `scale(${previewScale})`,
          opacity: previewOpacity,
          transformOrigin: "bottom center",
          textAlign: "right",
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: colors.muted,
            margin: "0 0 8px 0",
          }}
        >
          معاينة الدعوة
        </p>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.text,
            margin: "0 0 4px 0",
          }}
        >
          حفل الزفاف
        </p>
        <p
          style={{
            fontSize: 12,
            color: colors.accent,
            margin: 0,
          }}
        >
          15 ذو القعدة 1445 • قصر الريان
        </p>
      </div>

      {/* زر التأكيد */}
      <button
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 12,
          border: "none",
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`,
          color: "#FFF",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily,
          boxShadow: `0 8px 20px rgba(112, 80, 141, 0.3)`,
        }}
      >
        المتابعة
      </button>
    </AbsoluteFill>
  );
};

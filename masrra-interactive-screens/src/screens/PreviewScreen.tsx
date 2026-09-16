import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors, fontFamily } from "../theme";

export const PreviewScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 10], [0.5, 1]);
  const previewZoom = interpolate(frame, [0, 40], [0.85, 1.02]);
  const deviceRotate = interpolate(frame, [10, 30], [-8, 0]);
  const detailsSlide = interpolate(frame, [0, 20], [30, 0]);
  const shareButtonScale = interpolate(frame, [20, 35], [0.8, 1]);

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        padding: "30px 20px",
        fontFamily,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* الرأس */}
      <div style={{ opacity: headerOpacity }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: colors.text,
            margin: "0 0 4px 0",
            textAlign: "center",
          }}
        >
          معاينة الدعوة
        </h1>
      </div>

      {/* منطقة المعاينة الرئيسية */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 240,
            height: 520,
            transform: `rotateY(${-deviceRotate}deg) rotateX(${deviceRotate * 0.3}deg) scale(${previewZoom})`,
            transformStyle: "preserve-3d",
            transition: "transform 0.05s ease-out",
          }}
        >
          {/* إطار الجهاز (فريم) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              background: colors.surface,
              boxShadow: `
                0 40px 100px rgba(36, 29, 51, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
              border: `6px solid #333`,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* شريط الحالة (Status Bar) */}
            <div
              style={{
                height: 24,
                background: colors.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: 8,
                paddingRight: 8,
                fontSize: 10,
                color: "#FFF",
                fontWeight: 600,
              }}
            >
              <span>9:41</span>
              <span>●●●●●</span>
            </div>

            {/* محتوى الدعوة */}
            <div
              style={{
                flex: 1,
                background: `linear-gradient(135deg, ${colors.lavender}44, ${colors.accent}22)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: 16,
                textAlign: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* خط ذهبي ديكوري علوي */}
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  width: 60,
                  height: 2,
                  background: colors.decorativeGold,
                  borderRadius: 999,
                }}
              />

              {/* أيقونة الحدث */}
              <div style={{ fontSize: 36 }}>💍</div>

              {/* عنوان الدعوة */}
              <div>
                <p
                  style={{
                    fontSize: 9,
                    color: colors.muted,
                    margin: "0 0 2px 0",
                    fontWeight: 500,
                  }}
                >
                  لحفل الزفاف
                </p>
                <h2
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: colors.text,
                    margin: "0 0 8px 0",
                  }}
                >
                  محمد و نور
                </h2>
              </div>

              {/* التفاصيل */}
              <div
                style={{
                  fontSize: 8,
                  color: colors.text,
                  lineHeight: 1.4,
                  opacity: 0.8,
                }}
              >
                <p style={{ margin: "2px 0" }}>15 ذو القعدة 1445</p>
                <p style={{ margin: "2px 0" }}>قصر الريان - الرياض</p>
              </div>

              {/* خط ذهبي ديكوري سفلي */}
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  width: 60,
                  height: 2,
                  background: colors.decorativeGold,
                  borderRadius: 999,
                }}
              />
            </div>

            {/* منطقة الزر */}
            <div
              style={{
                height: 48,
                background: colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFF",
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              ردّ على الدعوة
            </div>
          </div>
        </div>
      </div>

      {/* تفاصيل الجانب الأيمن */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          transform: `translateX(${detailsSlide}px)`,
          transition: "transform 0.05s ease-out",
        }}
      >
        {[
          { icon: "📱", text: "يعمل على جميع الأجهزة" },
          { icon: "⚡", text: "سريع وسلس" },
          { icon: "✨", text: "تصميم فاخر" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              color: colors.text,
              textAlign: "right",
            }}
          >
            <span>{item.text}</span>
            <span style={{ fontSize: 14 }}>{item.icon}</span>
          </div>
        ))}
      </div>

      {/* زر المشاركة */}
      <button
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: 10,
          border: "none",
          background: `linear-gradient(135deg, ${colors.decorativeGold}, ${colors.accent})`,
          color: "#FFF",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily,
          boxShadow: `0 8px 20px rgba(199, 161, 95, 0.25)`,
          transform: `scale(${shareButtonScale})`,
          transformOrigin: "center",
          transition: "transform 0.05s ease-out",
        }}
      >
        شارك الدعوة الآن 🎉
      </button>
    </AbsoluteFill>
  );
};

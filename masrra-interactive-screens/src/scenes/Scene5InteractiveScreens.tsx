import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { colors, fontFamily } from "../theme";
import { DashboardScreen } from "../screens/DashboardScreen";
import { TemplatesScreen } from "../screens/TemplatesScreen";
import { DetailsScreen } from "../screens/DetailsScreen";
import { PreviewScreen } from "../screens/PreviewScreen";

const SCREENS = [
  { Component: DashboardScreen, label: "لوحة التحكم" },
  { Component: TemplatesScreen, label: "اختيار القالب" },
  { Component: DetailsScreen, label: "الإعدادات" },
  { Component: PreviewScreen, label: "المعاينة" },
];

const HOLD = 60;
const OVERLAP = 15;
const SCENE_LENGTH = 250;

const ScreenFrame: React.FC<{
  Component: React.FC;
  label: string;
  fadeIn: boolean;
  fadeOut: boolean;
  duration: number;
}> = ({ Component, label, fadeIn, fadeOut, duration }) => {
  const frame = useCurrentFrame();

  // كين بيرنز زوم (تدريجي)
  const zoom = interpolate(frame, [0, duration], [1.04, 1.17]);

  // تأثيرات الظهور والاختفاء
  const inOp = fadeIn ? interpolate(frame, [0, OVERLAP], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const outOp = fadeOut
    ? interpolate(frame, [duration - OVERLAP, duration], [1, 0], { extrapolateLeft: "clamp" })
    : 1;
  const opacity = Math.min(inOp, outOp);

  // حركة صعود خفيفة عند الظهور
  const rise = interpolate(frame, [0, OVERLAP], [16, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div
        style={{
          transform: `translateY(${rise}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
        }}
      >
        {/* إطار الشاشة الفاخر */}
        <div
          style={{
            width: 480,
            height: 1040,
            borderRadius: 54,
            overflow: "hidden",
            background: colors.surface,
            // ظل فاخر
            boxShadow: `
              0 30px 70px rgba(36, 29, 51, 0.32),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            // إطار ذهبي رقيق
            border: `2px solid ${colors.decorativeGold}`,
            position: "relative",
          }}
        >
          {/* خط ذهبي علوي زخرفي */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${colors.decorativeGold}, transparent)`,
              zIndex: 10,
            }}
          />

          {/* محتوى الشاشة */}
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.03s linear",
            }}
          >
            <Component />
          </div>
        </div>

        {/* تسمية الشاشة */}
        <div
          dir="rtl"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            color: "#F7F3EE",
            fontSize: 26,
            fontWeight: 600,
            padding: "12px 32px",
            borderRadius: 999,
            boxShadow: `0 8px 20px rgba(112, 80, 141, 0.3)`,
            fontFamily,
            letterSpacing: "0.5px",
          }}
        >
          ✨ {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene5InteractiveScreens: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.bg, fontFamily }}>
      {SCREENS.map((screen, i) => {
        const from = i * HOLD;
        const isLast = i === SCREENS.length - 1;
        const duration = isLast ? SCENE_LENGTH - from : HOLD + OVERLAP;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <ScreenFrame
              Component={screen.Component}
              label={screen.label}
              fadeIn={i > 0}
              fadeOut={!isLast}
              duration={duration}
            />
          </Sequence>
        );
      })}

      {/* نص أسفل الشاشة */}
      <div
        dir="rtl"
        style={{
          position: "absolute",
          bottom: 40,
          width: "100%",
          textAlign: "center",
          fontSize: 16,
          color: colors.text,
          opacity: 0.5,
          fontFamily,
        }}
      >
        واجهة تفاعلية حديثة و فاخرة
      </div>
    </AbsoluteFill>
  );
};

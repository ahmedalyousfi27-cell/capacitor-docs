import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Templates } from "./scenes/Scene2Templates";
import { Scene3Steps } from "./scenes/Scene3Steps";
import { Scene4Stats } from "./scenes/Scene4Stats";
import { Scene5InteractiveScreens } from "./scenes/Scene5InteractiveScreens";
import { Scene6CTA } from "./scenes/Scene6CTA";
import { FadeWrap } from "./components/FadeWrap";
import { colors } from "./theme";

// Nominal scene timing per the brief (30fps):
// 1 Hook        0:00–0:02   (60f)
// 2 Templates   0:02–0:06   (120f)
// 3 Steps       0:06–0:10   (120f)
// 4 Stats       0:10–0:15   (150f)
// 5 Interactive 0:15–0:23   (240f) - تم استبدال لقطات الشاشة برسومات تفاعلية
// 6 CTA         0:23–0:30   (210f)
//
// SCENE_OVERLAP: every scene except the last is given SCENE_OVERLAP extra
// frames at its tail, and every scene except the first starts its fade-in
// immediately (frame 0) — so scene N is still fading out while scene N+1
// is already fading in. Sequences therefore genuinely overlap in time,
// which is what makes this a true crossfade instead of two independent
// fades either side of a hard cut (that gap was audited and is why a
// same-length fade-out/fade-in pair without overlap produces a blank
// frame at every cut — fixed here).
const SCENE_OVERLAP = 10;

const NOMINAL = [
  { from: 0, duration: 60, Comp: Scene1Hook },
  { from: 60, duration: 120, Comp: Scene2Templates },
  { from: 180, duration: 120, Comp: Scene3Steps },
  { from: 300, duration: 150, Comp: Scene4Stats },
  { from: 450, duration: 240, Comp: Scene5InteractiveScreens }, // ✨ الرسومات التفاعلية بدلاً من لقطات الشاشة الحقيقية
  { from: 690, duration: 210, Comp: Scene6CTA },
];

const SCENES = NOMINAL.map((s, i) => {
  const isLast = i === NOMINAL.length - 1;
  return {
    ...s,
    renderDuration: isLast ? s.duration : s.duration + SCENE_OVERLAP,
    fadeIn: i > 0,
    fadeOut: !isLast,
  };
});

const HAS_MUSIC = true; // audio/masrra-ad-music.mp3 generated via ElevenLabs eleven_music_v2

const MusicBed: React.FC = () => {
  const frame = useCurrentFrame();
  const vol = Math.min(
    interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [880, 900], [1, 0], { extrapolateLeft: "clamp" })
  );
  return <Audio src={staticFile("audio/masrra-ad-music.mp3")} volume={vol} />;
};

export const MasrraAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {SCENES.map(({ from, renderDuration, Comp, fadeIn, fadeOut }, i) => (
        <Sequence key={i} from={from} durationInFrames={renderDuration}>
          <FadeWrap duration={renderDuration} fadeIn={fadeIn} fadeOut={fadeOut} overlap={SCENE_OVERLAP}>
            <Comp />
          </FadeWrap>
        </Sequence>
      ))}

      {HAS_MUSIC && <MusicBed />}
    </AbsoluteFill>
  );
};

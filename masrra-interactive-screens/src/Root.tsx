import React from "react";
import { Composition } from "remotion";
import { MasrraAd } from "./MasrraAd";

export const Root: React.FC = () => {
  return (
    <Composition
      id="MasrraAd"
      component={MasrraAd}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

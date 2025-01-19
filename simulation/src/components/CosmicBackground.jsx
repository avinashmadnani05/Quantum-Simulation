import React from "react";
import { Stars } from "@react-three/drei";

function CosmicBackground() {
  return <Stars radius={100} depth={50} count={5000} factor={5} saturation={0} fade />;
}

export default CosmicBackground;
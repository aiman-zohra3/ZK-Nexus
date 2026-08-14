"use client";

import Background from "./Background";
import HeroMockup from "./HeroMockup";

export default function HeroSection() {
  return (
    <section
      className="
      relative
      overflow-hidden
      bg-white pt-14
      "
    >
      {/* Background */}
      <Background />

    

      {/* Browser -> Mobile Transformation */}
      <HeroMockup />
    </section>
  );
}
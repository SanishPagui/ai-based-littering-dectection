'use client'

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useUser } from "@stackframe/stack";

gsap.registerPlugin(ScrollTrigger);

const HallOfShame = () => {
  const user = useUser()
  const list = [
    { name: user?.displayName, video: "litter_clips/litter_clip_20250411_071701.avi" },
  ];

  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll(".user");

    gsap.from(cards, {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <div
      ref={sectionRef}
      className="p-8 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white"
    >
      <h1 className="text-4xl font-bold text-center mb-10 text-red-600 drop-shadow-md">
        💀 Hall of Shame
      </h1>
      <div className="user-list grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {list.map((user, index) => (
          <div
            key={index}
            className="user bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-105"
          >
            <video
              src={user.video}
              className="rounded-lg w-full h-48 object-cover mb-4"
              controls
              autoPlay
              loop
              muted
            />
            <p className="text-center font-semibold text-lg text-red-400">
              {user.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallOfShame;

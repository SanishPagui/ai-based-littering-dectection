'use client'

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useUser } from "@stackframe/stack";

gsap.registerPlugin(ScrollTrigger);

const HallOfFame = () => {

  const user = useUser()
  const list = [
    { video: "./working/VID-20250411-WA0005.mp4" },
  ];

  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll(".user");


  }, []);

  return (
    <div ref={sectionRef} className="p-8 min-h-screen bg-gradient-to-br from-yellow-50 to-white">
      <h1 className="text-4xl font-bold text-center mb-8 text-yellow-600 drop-shadow-lg">🏆 Hall of Fame</h1>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallOfFame;

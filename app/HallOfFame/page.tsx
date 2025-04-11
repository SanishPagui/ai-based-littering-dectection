'use client'

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HallOfFame = () => {
  const list = [
    { name: "", image: "" },
  ];

  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll(".user");

    gsap.from(cards, {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
    });
  }, []);

  return (
    <div ref={sectionRef} className="p-8 min-h-screen bg-gradient-to-br from-yellow-50 to-white">
      <h1 className="text-4xl font-bold text-center mb-8 text-yellow-600 drop-shadow-lg">🏆 Hall of Fame</h1>
      <div className="user-list grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {list.map((user, index) => (
          <div
            key={index}
            className="user bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <img
              src={user.image}
              alt={user.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <p className="text-center font-semibold text-lg">{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallOfFame;

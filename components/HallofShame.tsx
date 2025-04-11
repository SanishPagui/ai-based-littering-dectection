import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HallOfShame = () => {
  const list = [
    { name: "Litterbug Larry", image: "https://placekitten.com/300/201" },
    { name: "Trashy Tina", image: "https://placekitten.com/301/201" },
    { name: "Messy Max", image: "https://placekitten.com/302/201" },
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
            <img
              src={user.image}
              alt={user.name}
              className="w-full h-48 object-cover rounded-lg mb-4 grayscale hover:grayscale-0 transition"
            />
            <p className="text-center font-semibold text-lg text-red-400">{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallOfShame;

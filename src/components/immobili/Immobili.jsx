import React from "react";
import "./immobili.css";

const Immobili = () => {
  const menuItem = [
    {
      text: "title",
      subtitle: "subtitle",
      image:
        "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      text: "title",
      subtitle: "subtitle",
      image:
        "https://images.pexels.com/photos/17216084/pexels-photo-17216084/free-photo-of-nourriture-tasse-fruit-panier.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      text: "title",
      subtitle: "subtitle",
      image:
        "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      text: "title",
      subtitle: "subtitle",
      image:
        "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  return (
    <div className="max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-3 gap-6">
      {/* Card */}

      {menuItem.map(({ text, subtitle, image }, index) => {
        return (
          <div key={index} className="rounded-xl relative">
            {/* Overlay */}
            <div className="absolute w-full h-full bg-black/50 rounded-xl text-white">
              <p className="font-bold text-2xl px-2 pt-4">{text} </p>
              <p className="px-2">{subtitle}</p>
              <button className="border rounded-xl px-5 py-1 border-white bg-white text-black hover:bg-black/50 hover:text-white border-none mx-2 absolute bottom-4">
                order
              </button>
            </div>
            <img
              className="max-h-[160px]  md:max-h-[200px] w-full object-cover rounded-xl"
              src={image}
              alt="/"
            />
          </div>
        );
      })}
    </div>
  );

};

export default Immobili;

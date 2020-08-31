import React from "https://unpkg.com/react/umd/react.development.js";
import celestial from "../celestial.js";

var map = function () {
  var test;
  var config = {
    width: 300,
    location: true,
    projection: "airy",
    center: [45.3, 3.31, 0],
    interactive: false,
    controls: false,
    zoomlevel: 1,
    form: false,
    lines: {
      graticule: { show: false },
      equatorial: { show: false },
      ecliptic: { show: false },
    },
    constellations: {
      names: false,
      lineStyle: { stroke: "#cccccc", width: 1, opacity: 0.5 },
    },
    background: { fill: "#000", stroke: "#000", opacity: 1, width: 1 },
    datapath: "https://ofrohn.github.io/data/",
    stars: {
      colors: false,
      names: false,
      style: { fill: "#ffffff", opacity: 0.7 },
      limit: 6,
      size: 4,
    },
    dsos: { show: false },
    mw: { show: true,},
  };
  return (
    {((test = Celestial()), test.display(config))}
  );
};

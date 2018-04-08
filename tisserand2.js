/* http://www2.ess.ucla.edu/~jewitt/tisserand.html 
*/

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    step = 200,
    deg2rad = Math.PI / 180,
    // Semimajor axis of the perturbing body (Jupiter)
    ap = {
      j: {a:5.204, e:0.0484, i:0.02276},
      s: {a:9.537, e:0.0539, i:0.04339},
      u: {a:19.189, e:0.0473, i:0.01349},
      n: {a:30.070, e:0.0086, i:0.03089}
    },
    planet = "j",
    limits = {
      a: {min: 1, max: 60, def: 3, y0:-2, y1:6, unit:"AU"},       // semimajor axis 1...10 AU
      e: {min: 0, max: 1, def: 0.1, y0:-2.5, y1:6.5, unit:""},      // eccentricity 0...1
      i: {min: 0, max: Math.PI, def: 0.1, y0:-2.5, y1:6.5, unit:"\u00b0"} // inclination 0...Pi rad
    },
    selected = ["a", "e", "i"],
    palette1 = ["#004529","#006837","#238443","#41ab5d","#78c679","#addd8e","#d9f0a3","#f7fcb9","#ffffd5"],
    palette2 = ["#e7f7ff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"],

    palG = {
      3: ["#f7fcb9","#addd8e","#31a354"],
      4: ["#ffffcc","#c2e699","#78c679","#238443"],
      5: ["#ffffcc","#c2e699","#78c679","#31a354","#006837"],
      6: ["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"],
      7: ["#ffffcc","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
      8: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
      9: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"]
    },
    palB = {
      3: ["#cee7f7","#9ecae1","#3182bd"],
      4: ["#dfe3ff","#bdd7e7","#6baed6","#2171b5"],
      5: ["#dfecff","#bdd7e7","#6baed6","#3182bd","#08519c"],
      6: ["#dfecff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"],
      7: ["#dfecff","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],
      8: ["#e7f7ff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],
      9: ["#e7f7ff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]
    };
    
for (var n in palG) { palG[n].reverse(); }
var parnt = "body", node = $("tisserand-chart");

if (node) {
  parnt = "#tisserand-chart";
  width = node.offsetWidth  - margin.left - margin.right;
  height = Math.round(node.offsetWidth  / 2)  - margin.top - margin.bottom;
}
    
var chart = d3.select(parnt).append("canvas").attr("id", "dataplane")
  .attr("width", width)
  .attr("height", height),
  ctx = chart.node().getContext('2d');  
  
// set the ranges
var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z1 = d3.scaleQuantize().range(palG[9]),
    z2 = d3.scaleQuantize().range(palB[9]);


var svg = d3.select(parnt).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom),
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
var ctrl = d3.select(parnt).append("div").attr("class", "ctrl");

var indicator = d3.select(parnt).append("div").attr("id", "indicator");

ctrl.append("input").attr("type", "range").attr("min", 0).attr("max", 1).attr("step", 0.05).attr("id", "third").attr("value", 0).on("change", function() {
  update(generate());
});
ctrl.append("label").attr("title", "Set " + selected[2]).attr("id", "lblThird").attr("for", "third");

ctrl.append("p");
ctrl.append("span").text("Show parameter ");

ctrl1 = ctrl.append("div").attr("id", "btns");

ctrl1.append("input").attr("type", "button").attr("value", "Semimajor Axis vs. Inclination").attr("id", "ai").on("click", function() {
  setParam(this.id); update(generate());
});
ctrl1.append("br");
ctrl1.append("input").attr("type", "button").attr("value", "Semimajor Axis vs. Excentricity").attr("id", "ae").on("click", function() {
  setParam(this.id); update(generate());
});
ctrl1.append("br");
ctrl1.append("input").attr("type", "button").attr("value", "Excentricity vs. Inclination").attr("id", "ei").on("click", function() {
  setParam(this.id); update(generate());
});
ctrl.append("p");
ctrl.append("span").text(" relative to ");

ctrl.append("input").attr("type", "button").attr("value", "Jupiter").attr("id", "j").on("click", function() {
  setPlanet(this.id); update(generate(selected[0]));
});
ctrl.append("input").attr("type", "button").attr("value", "Saturn").attr("id", "s").on("click", function() {
  setPlanet(this.id); update(generate(selected[0]));
});
ctrl.append("input").attr("type", "button").attr("value", "Uranus").attr("id", "u").on("click", function() {
  setPlanet(this.id); update(generate(selected[0]));
});
ctrl.append("input").attr("type", "button").attr("value", "Neptune").attr("id", "n").on("click", function() {
  setPlanet(this.id); update(generate(selected[0]));
});

ctrl.append("div").attr("id", "formula");
$("formula").innerHTML = "<math display='block' xmlns='http://www.w3.org/1998/Math/MathML' mathsize='small'><msub><mi>T</mi><mi>p</mi></msub><mo>=</mo><mfrac><mi class='frm' id='f_ap'>ap</mi><mi class='frm' id='f_a'>a</mi></mfrac> <mo>+</mo><mn>2</mn><msqrt><mfrac><mi class='frm' id='f_a'>a</mi><mi class='frm' id='f_ap'>ap</mi></mfrac><mo>(</mo><mn>1</mn><mo>-</mo> <msup><mi class='frm' id='f_e'>e</mi><mn>2</mn></msup><mo>)</mo></msqrt><mo>cos</mo> <mi class='frm' id='f_i'>i</mi></math>";

scale = ctrl.append("div").attr("id", "scale");
scanvas = scale.append("canvas")  
  .attr("width", 200)
  .attr("height", 50),
sctx = scanvas.node().getContext('2d');
sx = d3.scaleLinear().domain([0, 200]),

chart.on('mousemove', function() {
  var mouse = d3.mouse(this),
      mx = mouse[0],
      my = mouse[1],
      param = {};
  param[selected[0]] = x.invert(mx);
  param[selected[1]] = selected[1] === "i" ? y.invert(my) * Math.PI/180 : y.invert(my);
  param[selected[2]] = $("third").value * 1;
  var  Q = param.a * (1 + param.e), q = param.a * (1 - param.e),
       tiss = tisserand(param);
  var txt = "T" + planet + " " + Round(tiss, 2) + ", " + Round(q, 2) + "..." + Round(Q, 2) + "AU";
  d3.select("#indicator").text(txt).style("top", px(my + 4)).style("width", px(120)).style("left", px(mx + margin.left + 14));
});

chart.on('mouseover', function() { d3.select("#indicator").style("display", "block"); });
chart.on('mouseout', function() { d3.select("#indicator").style("display", "none"); });

hilight();
update(generate());

function update(data) {
  var dim = { w: width/step+1, h: height/step+1}
  g.selectAll("*").remove();
  
  data.values.forEach(function(d, i) {
    ctx.beginPath();
    ctx.rect(x(d.x), y(d.y) - dim.h, dim.w, dim.h);
    ctx.fillStyle = heatColor(d.t);
    ctx.fill();
    ctx.closePath();
  });

  var pdata = generatePlanet()[0];
  ctx.beginPath();
  ctx.arc(x(pdata.x), y(pdata.y), 5, 0, Math.PI*2, true);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.lineWidth = 2.0;
  ctx.strokeStyle = "#f00";
  ctx.stroke();
  ctx.closePath();
  
  // Add the X Axis
  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the Y Axis
  g.append("g").call(d3.axisLeft(y));
  
  g.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 6)
    .attr("dy", "1.5em")
    .text(selected[0] + " [" + limits[selected[0]].unit + "]");
  
  g.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -height / 2)
    .attr("y", 0)
    .attr("dy", "-1.5em")
    .attr("transform", "rotate(-90)")
    .text(selected[1] + " [" + limits[selected[1]].unit + "]");
  
  //$("lblSecond").innerHTML = getValue(selected[1], "second");
  $("lblThird").innerHTML = getValue(selected[2], "third");
  
  sx.range([z1.domain()[0], z2.domain()[1]]);
  sctx.font = "10px Arial";
  sctx.textAlign  = "center";
  sctx.textBaseline = "top";
  sctx.lineWidth = 1.0;

  sctx.fillStyle = "#fff";
  sctx.fillRect(0, 0, scanvas.attr("width"), scanvas.attr("height"));
  for (var i=0; i<=200; i++) {
    var tiss = sx(i);
    sctx.strokeStyle = heatColor(tiss);
    sctx.beginPath();
    sctx.moveTo(i, 0);
    sctx.lineTo(i, 24);
    sctx.stroke();
    sctx.closePath();
  };
  var diff = Math.round((sx.range()[1] - sx.range()[0]) / 5);
  if (diff <= 0) diff = 1;
  for (var i = Math.ceil(sx.range()[0]); i<=Math.floor(sx.range()[1]); i+=diff) {
    sctx.fillStyle = "#000";
    sctx.fillText(i, sx.invert(i), 26);
  }

}

function setPlanet(id) {
  if (id) planet = id;
  hilight();
}

function setParam(what) {
  switch (what) {
    case "ai": selected = ["a", "i", "e"]; break;
    case "ae": selected = ["a", "e", "i"]; break;
    case "ei": selected = ["e", "i", "a"]; break;
  } 
  hilight();
}
  
function hilight() {
  d3.selectAll("input").each( function(d) { d3.select(this).classed("selected", this.id === planet || this.id === selected[0] + selected[1]); }  );
}

function getValue(what, where) {
  var res = $(where).value * 1;

  if (what === "i") res = Round(res /= deg2rad, 2);

  return what + ": " + res + limits[what].unit;
  
}

function generate() {
  var res = {id:1, values:[]}, 
      tiss, n = 0,
      l0 = limits[selected[0]],
      l1 = limits[selected[1]],
      curr = {a:3, i:0.1, e:0.1};
  
  //curr[selected[1]] = adapt(selected[1], "second");
  curr[selected[2]] = adapt(selected[2], "third");

  document.querySelectorAll('.frm').forEach(function(e) {
    switch (e.id) {
      case "f_ap": e.innerHTML = ap[planet].a + "\u2009AU"; break;
      case "f_a":  if (selected[2] === "a") e.innerHTML = curr.a + "\u2009AU"; else e.innerHTML = "a"; break;
      case "f_e":  if (selected[2] === "e") e.innerHTML = curr.e; else e.innerHTML = "e"; break;
      case "f_i":  if (selected[2] === "i") e.innerHTML = Round(curr.i*180/Math.PI, 3) + "\u2009\u00b0"; else e.innerHTML = "i"; break;
    }
  });
  
  for (var i=l0.min; i<l0.max; i+=(l0.max-l0.min)/step) {
    for (var j=l1.min; j<l1.max; j+=(l1.max-l1.min)/step) {
      curr[selected[0]] = i;
      curr[selected[1]] = j;
      tiss = tisserand(curr);
      if (selected[0] === "i")
        res.values.push({x:i*180/Math.PI, y:j, t:tiss});
      if (selected[1] === "i")
        res.values.push({x:i, y:j*180/Math.PI, t:tiss});
      else
        res.values.push({x:i, y:j, t:tiss});
    }
  }

  if (selected[0] === "i")
    x.domain([l0.min*180/Math.PI, l0.max*180/Math.PI]);
  else
    x.domain([l0.min, l0.max]);

  if (selected[1] === "i")
    y.domain([l1.min*180/Math.PI, l1.max*180/Math.PI]);
  else
    y.domain([l1.min, l1.max]);
  
  var min = d3.min(res.values, function(c) { return c.t; }),
      max = d3.max(res.values, function(c) { return c.t; }),
      rLo = Math.abs((3 - min)/(max - min)),
      rHi = Math.abs((max - 3)/(max - min)); 
  
  if (min > 3) {
    z1.domain([min, min]);
    z2.domain([min, max]);
    z2.range(palB[9]);
  } else if (max < 3) {
    z1.domain([min, max]);
    z2.domain([max, max]);
    z1.range(palG[9]);
  } else {
    z1.domain([min, 3]);
    z2.domain([3, max]);
    z1.range(palG[colorRange(rLo)]);
    z2.range(palB[colorRange(rHi)]);
    
  }
  return res;
}

function heatColor(v) {
   if (v < 3) return z1(v);  
   return z2(v);
}

function colorRange(v) {
  if (v > 0.6) return 9;
  if (v > 0.5) return 8;
  if (v > 0.45) return 7;
  if (v > 0.4) return 6;
  if (v > 0.35) return 5;
  if (v > 0.25) return 4;
  return 3;  
}
 
function generatePlanet() {
  var res = [], 
      tiss, p = planet;
  
  tiss = tisserand(ap[p]);
  if (selected[1] === "i")
    res.push({x:ap[p][selected[0]], y:ap[p].i * 180/Math.PI, t:tiss});
  else
    res.push({x:ap[p][selected[0]], y:ap[p][selected[1]], t:tiss});

  return res;
}


function adapt(what, where) {
  var node = $(where),
      l = limits[what];

  node.min = l.min;
  node.max = l.max;
  node.step = Round((l.max-l.min) / 100, 2);
  if (node.value > l.max) node.value = l.max;
  if (node.value < l.min) node.value = l.min;
  return node.value;
}

//a vs i, a vs e, i vs e
function tisserand(bdy) {
  var a = ap[planet].a;
  return a / bdy.a + 2 * Math.sqrt(bdy.a / a * (1 - bdy.e*bdy.e)) * Math.cos(bdy.i);
}

function Round(x, dg) { return(Math.round(Math.pow(10,dg)*x)/Math.pow(10,dg)); }
function $(id) { return document.getElementById(id); }
function px(v) { return v + "px"; }

/* http://www2.ess.ucla.edu/~jewitt/tisserand.html 
*/

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
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
    selected = ["a", "e", "i"];
    palette = ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704","#6f1802","#2f0800"];

var parnt = "body", node = $("tisserand-chart")

if (node) {
  parnt = "#tisserand-chart";
  width = node.offsetWidth  - margin.left - margin.right;
  height = Math.round(node.offsetWidth  / 2)  - margin.top - margin.bottom;
}
    
// set the ranges
var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(palette);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });


var svg = d3.select(parnt).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom),
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
var ctrl = d3.select(parnt).append("div").attr("class", "ctrl");

ctrl.append("input").attr("type", "range").attr("min", 0).attr("max", 1).attr("step", 0.05).attr("id", "second").attr("value", 0).on("change", function() {
  update(generate());
});
ctrl.append("label").attr("title", "Set " + selected[1]).attr("id", "lblSecond").attr("for", "second").html(selected[1] + ": " + $("second").value);

ctrl.append("input").attr("type", "range").attr("min", 0).attr("max", 1).attr("step", 0.05).attr("id", "third").attr("value", 0).on("change", function() {
  update(generate());
});
ctrl.append("label").attr("title", "Set " + selected[2]).attr("id", "lblThird").attr("for", "third");
ctrl.append("p");
ctrl.append("span").text("Show parameter ");

ctrl.append("input").attr("type", "button").attr("value", "Semimajor Axis a").attr("id", "a").on("click", function() {
  setParam(this.id); update(generate());
});
ctrl.append("input").attr("type", "button").attr("value", "Inclination i").attr("id", "i").on("click", function() {
  setParam(this.id); update(generate());
});
ctrl.append("input").attr("type", "button").attr("value", "Excentricity e").attr("id", "e").on("click", function() {
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
$("formula").innerHTML = "<math display='block' xmlns='http://www.w3.org/1998/Math/MathML' mode='inline' mathsize='small'><msub><mi>T</mi><mi>p</mi></msub><mo>=</mo><mfrac><mi class='frm' id='f_ap'>ap</mi><mi class='frm' id='f_a'>a</mi></mfrac> <mo>+</mo><mn>2</mn><msqrt><mfrac><mi class='frm' id='f_a'>a</mi><mi class='frm' id='f_ap'>ap</mi></mfrac><mo>(</mo><mn>1</mn><mo>-</mo> <msup><mi class='frm' id='f_e'>e</mi><mn>2</mn></msup><mo>)</mo></msqrt><mo>cos</mo> <mi class='frm' id='f_i'>i</mi></math>";

hilight();
update(generate());

function update(data) {
  g.selectAll("*").remove();
  
  //vlines.data(data).enter();
  vlines = g.selectAll(".vlines")
    .data(data)
    .enter().append("g")
    .attr("class", "vline");    

  vlines.append("path")
    .attr("class", "line")
    .attr("d",  function(d) { return valueline(d.values); })
    .style("stroke", function(d) { return "#fc0"; });
/*
  vlines.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[0]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.x) + "," + y(d.value.y) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { if (selected[1] === "i") return Round(d.id * 180 / Math.PI, 1); return Round(d.id, 1); });
*/

  g.selectAll("circle")
    .data(generatePlanet())
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", function(d) { return x(d.x) })
    .attr("cy", function(d) { return y(d.y) })
    .attr("r", 5)
    .style("fill", "white")
    .style("stroke-width", "2.0")
    .style("stroke", "#f00");
  
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
    .text("Tisserand parameter T" + planet);
  
  $("lblSecond").innerHTML = getValue(selected[1], "second");
  $("lblThird").innerHTML = getValue(selected[2], "third");
}

function setPlanet(id) {
  if (id) planet = id;
  hilight();
}

function setParam(what) {
  if (what) selected = [what].concat("aei".replace(what, '').split(''));
  hilight();
}
  
function hilight() {
  d3.selectAll("input").each( function(d) { d3.select(this).classed("selected", this.id === planet || this.id === selected[0]); }  );
}

function getValue(what, where) {
  var res = $(where).value * 1;

  if (what === "i") res = Round(res /= deg2rad, 2);

  return what + ": " + res + limits[what].unit;
  
}

function generate() {
  var res = {id:1, values:[]}, 
      tiss, n = 0,
      l = limits[selected[0]],
      curr = {a:3, i:0.1, e:0.1};
  
  curr[selected[1]] = adapt(selected[1], "second");
  curr[selected[2]] = adapt(selected[2], "third");

  document.querySelectorAll('.frm').forEach(function(e) {
    switch (e.id) {
      case "f_ap": e.innerHTML = ap[planet].a + "\u2009AU"; break;
      case "f_a":  if (selected[0] !== "a") e.innerHTML = curr.a + "\u2009AU"; else e.innerHTML = "a"; break;
      case "f_e":  if (selected[0] !== "e") e.innerHTML = curr.e; else e.innerHTML = "e"; break;
      case "f_i":  if (selected[0] !== "i") e.innerHTML = Round(curr.i*180/Math.PI, 3) + "\u2009\u00b0"; else e.innerHTML = "i"; break;
    }
  });
  
  for (var i=l.min; i<l.max; i+=(l.max-l.min)/100) {
    curr[selected[0]] = i;
    tiss = tisserand(curr);
    if (selected[0] === "i")
      res.values.push({x:i*180/Math.PI, y:tiss});
    else
      res.values.push({x:i, y:tiss});
  }
  
  x.domain([0, d3.max(res.values, function(c) { return c.x; }) ]);
  var ymax = d3.max(res.values, function(c) { return c.y; }),
      ymin = d3.min(res.values, function(c) { return c.y; });
  y.domain([ymin < l.y0 ? ymin : l.y0, ymax > l.y1 ? ymax : l.y1 ]);
  z.domain(res.id);

  return [res];
}

function generatePlanet() {
  var res = [], 
      tiss, p = planet;
  
  tiss = tisserand(ap[p]);
  if (selected[0] === "i")
    res.push({x:ap[p].i * 180/Math.PI, y:tiss});
  else
    res.push({x:ap[p][selected[0]], y:tiss});

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


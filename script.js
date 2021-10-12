"use strict";
document.addEventListener("DOMContentLoaded", start);

async function start() {
  let response = await fetch("images/baggrund2-01.svg");
  let svgData = await response.text();
  document.querySelector("section").innerHTML = svgData;
  manipulateSVG();
}

let elementsToPaint = [];

function manipulateSVG() {
  //hide unchangeable elements
  document.querySelectorAll(`svg > g:not(#background, #toilet, #toilet-2, #wash-4, #handwash-1)`).forEach((element) => {
    element.style.opacity = 0;
  });
}

function mouseOver(event) {
  event.target.style.fill = "green";
  console.log("event", event.target.id);
}

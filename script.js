"use strict";

const features = {
  couch: false,
  tv: false,
  bed: false,
  window: false,
  table: false,
  stove: false,
  kitchenSink: false,
  bigCarpet: false,
  smallCarpet: false,
};

document.addEventListener("DOMContentLoaded", start);

async function start() {
  let response = await fetch("images/baggrund2-01.svg");
  let svgData = await response.text();
  document.querySelector("section").innerHTML = svgData;
  manipulateSVG();
  document.querySelectorAll(".option").forEach((option) => option.addEventListener("click", toggleOption));
  document.querySelectorAll("[data-feature]").forEach((option) => {
    option.addEventListener("mouseover", optionHover);
  });
}

let elementsToPaint = [];

function manipulateSVG() {
  //hide unchangeable elements
  document.querySelectorAll(`svg > g:not(#background, #toilet, #toilet-2, #wash-4, #wash-3)`).forEach((element) => {
    element.style.opacity = 0;
  });
}

function optionHover(event) {
  console.log(this);
  console.log(event);
  let hoveredOption = this.dataset.feature;

  document.querySelectorAll(`.${hoveredOption}`).forEach((element) => {
    element.style.opacity = 0.5;
  });
  this.removeEventListener("mouseover", optionHover);
  this.addEventListener("mouseout", notHovering);

  /* this.addEventListener("mouseout", ()=>{}); */
  // document.querySelectorAll(`svg > g:not(#background, #toilet, #toilet-2, #wash-4, #handwash-1)`).forEach((element) => {
  //   element.style.opacity = 0;
  // document.querySelectorAll("#sofa-2 path").forEach((element) => {
  //   element.style.fill = "green";
  // });
  /* document.querySelectorAll(`svg > g:not(#background, #toilet, #toilet-2, #wash-4, #wash-3)`).forEach((element) => {
    element.style.opacity = 0;
  }); */
}

function notHovering() {
  document.querySelectorAll(`svg > g:not(#background, #toilet, #toilet-2, #wash-4, #wash-3)`).forEach((element) => {
    element.style.opacity = 0;
  });
  this.addEventListener("mouseover", optionHover);
  this.removeEventListener("mouseout", notHovering);
}

function toggleOption(event) {
  const target = event.currentTarget;
  const feature = target.dataset.feature;


  features[feature] = !features[feature];

  if (features[feature]) {
    // feature added
    console.log(`Feature ${feature} is turned on!`);
    target.classList.add("chosen");
    //remover hide fra den
    document.querySelector(`[data-feature*="${feature}"]`).classList.remove("hide");
    let featureElement = createFeatureElement(feature);
    console.log("featureElement:", featureElement);

    document.querySelector("#selected ul").append(featureElement);
    let firstPos = target.getBoundingClientRect();
    let lastPos = featureElement.getBoundingClientRect();
    // console.log("firstPos:", firstPos)
    // console.log("lastPos:", lastPos)

    const deltaX = firstPos.left - lastPos.left;
    const deltaY = firstPos.top - lastPos.top;
    const deltaW = firstPos.width / lastPos.width;
    const deltaH = firstPos.height / lastPos.height;

    featureElement.animate(
      [
        {
          transformOrigin: "top left",
          transform: `
        translate(${deltaX}px, ${deltaY}px)
        scale(${deltaW}, ${deltaH})
      `,
        },
        {
          transformOrigin: "top left",
          transform: "none",
        },
      ],
      {
        duration: 900,
        easing: "ease-in-out",
        fill: "both",
      }
    );



  } else {
    // feature removed
    console.log(`Feature ${feature} is turned off!`);
    target.classList.remove("chosen");

    document.querySelector(`[data-feature*="${feature}"]`).classList.add("hide");
    let existingElement = document.querySelector(`#selected ul [data-feature*="${feature}"]`);
    let firstPos = existingElement.getBoundingClientRect();
    let lastPos = target.getBoundingClientRect();
    console.log("firstPos:", firstPos);
    console.log("lastPos:", lastPos);

    const deltaX = firstPos.left - lastPos.left;
    const deltaY = firstPos.top - lastPos.top;
    const deltaW = firstPos.width / lastPos.width;
    const deltaH = firstPos.height / lastPos.height;

    target.animate(
      [
        {
          transformOrigin: "top left",
          transform: `
        translate(${deltaX}px, ${deltaY}px)
        scale(${deltaW}, ${deltaH})
      `,
        },
        {
          transformOrigin: "top left",
          transform: "none",
        },
      ],
      {
        duration: 900,
        easing: "ease-in-out",
        fill: "both",
      }
    );
    existingElement.remove();

  }
}


function createFeatureElement(feature) {
  const li = document.createElement("li");
  li.dataset.feature = feature;

  const img = document.createElement("img");
  img.src = `images/${feature}.svg`;
  img.alt = capitalize(feature);

  li.append(img);

  return li;
}

function capitalize(text) {
  return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
}

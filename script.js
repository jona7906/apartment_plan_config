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
  /* document.querySelectorAll(".option").forEach((option) => option.addEventListener("click", toggleOption)); */
  document.querySelectorAll(".option").forEach((option) => option.addEventListener("click", toggleFeature));
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

function toggleFeature(event) {
  let clickedFeature = this.dataset.feature;
  document.querySelectorAll(`.${clickedFeature}`).forEach((element) => {
    element.style.opacity = 0.7;
  });
  document.querySelectorAll("[data-feature]").forEach((element) => {
    /* if (element.dataset.feature != this.dataset.feature) { */
    element.removeEventListener("mouseover", optionHover);
    element.removeEventListener("mouseout", notHovering);
    element.removeEventListener("click", toggleFeature);
    /* } */
  });

  document.querySelectorAll(`.couch`).forEach((element) => {
    /* if (element.dataset.feature != this.dataset.feature) { */
    console.log("hey");
    element.dataset.feature = this.dataset.feature;

    document.querySelector("#product-preview").style.zIndex = -1;
    elementsToPaint.push(element);
    element.addEventListener("click", toggleOption);
    element.addEventListener("mouseover", hoverPlacements);
    console.log(elementsToPaint);
    /* } */
  });

  this.removeEventListener("click", toggleFeature);
  this.addEventListener("click", featureOff);
  /* this.removeEventListener("mouseover", optionHover);
      element.removeEventListener("mouseout", notHovering); */
}

function hoverPlacements() {
  console.log(`hovering: ${this.id}`);
  let id = this.id;
  // this.animate([{ transform: "scale(1.3" }]);

  document.querySelectorAll(`#${id}`).forEach((path) => {
    const pulseAnimation = path.animate(
      [
        {
          fill: "white",
        },
        {
          fill: "#C7C7C7",
        },
        {
          fill: "white",
        },
      ],
      {
        iterations: Infinity,
        duration: 1500,
        easing: "ease-in",
      }
    );
    path.addEventListener("mouseout", stopPulse);
    function stopPulse() {
      pulseAnimation.cancel();
    }
  });
}

function featureOff() {
  let clickedFeature = this.dataset.feature;
  document.querySelectorAll(`.${clickedFeature}`).forEach((element) => {
    element.style.opacity = 0;
  });
  this.addEventListener("click", toggleFeature);
  this.removeEventListener("click", featureOff);

  document.querySelectorAll("[data-feature]").forEach((element) => {
    /* if (element.dataset.feature != this.dataset.feature) { */
    element.addEventListener("mouseover", optionHover);
    element.addEventListener("mouseout", notHovering);
    element.addEventListener("click", toggleFeature);

    /* } */
  });
}
function optionHover(event) {
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
  this.removeEventListener("mouseout", notHovering);
  this.addEventListener("mouseover", optionHover);
  document.querySelectorAll(`svg > g:not(#background, #toilet, #toilet-2, #wash-4, #wash-3)`).forEach((element) => {
    element.style.opacity = 0;
    // element.addEventListener("mousedown", showPopup());
  });
}

// function showPopup() {
//   document.querySelector("#popup").offset({ top: pageY, left: pageX }).fadeIn();
// }

function createPlacedElement(id) {}

function toggleOption(event) {
  /* console.log(this.id);
  let chosenPlacement = createPlacedElement(this.id); */
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
  }
  /* else */ document.querySelectorAll("ul li").forEach((element) => {
    element.addEventListener("click", () => {
      /*  console.log(event.currentTarget.dataset.feature); */

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
      /*  const deltaW = firstPos.width / lastPos.width;
      const deltaH = firstPos.height / lastPos.height; */

      this.animate(
        [
          {
            transformOrigin: "top left",
            transform: `
        translate(${deltaX}px, ${deltaY}px)
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
    });
  });
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

// function pickPart(event) {
//   let part = createFeatureElement(event.currentTarget.dataset.feature);
//   if (event.currentTarget.dataset.feature === "couch") {
//     elementsToPaint.push(part);
//     console.log("elementsToPaint", elementsToPaint);
//   }
// }

function pickPart(event) {}

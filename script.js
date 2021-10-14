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
  document.querySelectorAll(".option").forEach((option) => option.addEventListener("click", toggleFeature));
  document.querySelectorAll("[data-feature]").forEach((option) => {
    option.addEventListener("mouseover", optionHover);
  });
}

let elementsToPaint = [];

function manipulateSVG() {
  //hide unchangeable elements
  document.querySelectorAll(`svg > g:not(#background, #toilet, #toilet-2, #wash-4, #wash-3)`).forEach((element) => {
    element.classList.add('available')
    element.style.opacity = 0;
  });
}

function addEventListeners () {
  document.querySelectorAll("[data-feature]").forEach((element) => {
    element.addEventListener("mouseover", optionHover);
    element.addEventListener("mouseout", notHovering);
    element.addEventListener("click", toggleFeature);
  });
}

function removeEventListeners () {
  document.querySelectorAll("[data-feature]").forEach((element) => {
    element.removeEventListener("mouseover", optionHover);
    element.removeEventListener("mouseout", notHovering);
    element.removeEventListener("click", toggleFeature);
  });
}

function toggleFeature() {
  removeEventListeners()

  let clickedFeature = this.dataset.feature;
  document.querySelectorAll(`.${clickedFeature}`).forEach((element) => {
    element.style.opacity = 0.7;
  });


  document.querySelectorAll(`.${clickedFeature}`).forEach((element) => {
    /* if (element.dataset.feature != this.dataset.feature) { */

    element.dataset.feature = this.dataset.feature;

    document.querySelector("#product-preview").style.zIndex = -1;
    /* elementsToPaint.push(element); */
    element.addEventListener("click", togglePlacement);

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
  this.style.backgroundColor = "white";

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

  document.querySelectorAll(`.${hoveredOption}.available`).forEach((element) => {
    element.style.opacity = 0.5;
  });
  this.removeEventListener("mouseover", optionHover);
  this.addEventListener("mouseout", notHovering);
}

function notHovering() {
  this.removeEventListener("mouseout", notHovering);
  this.addEventListener("mouseover", optionHover);
  document.querySelectorAll(`svg > g:not(#background, #toilet, #toilet-2, #wash-4, #wash-3).available`).forEach((element) => {
    element.style.opacity = 0;
  });
}

function togglePlacement() {
  showColorPalette(this);
  this.classList.remove('available')
  document.querySelectorAll('.available path').forEach(path => path.style.opacity = '0')
}

function showColorPalette(element) {
  const id = element.id
  if (document.querySelector(".color_options")) document.querySelector(".color_options").remove()
  const template = document.querySelector("template#colors");
  document.querySelector('#house_section').appendChild(template.content.cloneNode(true));
  const colorPickerDiv = document.querySelector(".color_options");
  const input = colorPickerDiv.querySelector('input')
  input.addEventListener('input', () => {
    document.querySelectorAll(`#${id} > *`).forEach(path => path.style.fill = document.querySelector("#colorchoice").value)
  })
  const button = colorPickerDiv.querySelector('button')
  button.addEventListener('click', () => {
    toggleOption(element, document.querySelector("#colorchoice").value)
    document.querySelector(".color_options").remove()
    addEventListeners()
  })
  const sectionObjectRect = document.querySelector('#house_section').getBoundingClientRect()
  const clickedObjectRect = document.querySelector(`#${id}`).getBoundingClientRect();
  const y = clickedObjectRect.y - sectionObjectRect.y
  const x = clickedObjectRect.x - sectionObjectRect.x
  const newY = y + clickedObjectRect.height + 10
  colorPickerDiv.style.top = newY + "px";
  colorPickerDiv.style.left = x + "px"
}

async function toggleOption(element, color) {
  const feature = element.dataset.feature;

  features[feature] = !features[feature];

  if (features[feature]) {
    let featureElement = await createFeatureElement(element, color);

    document.querySelector("#selected ul").append(featureElement);
    let firstPos = element.getBoundingClientRect();
    let lastPos = featureElement.getBoundingClientRect();

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
  document.querySelectorAll("ul li").forEach((element) => {
    element.addEventListener("click", () => {
      // feature removed
      element.classList.remove("chosen");

      document.querySelector(`[data-feature*="${feature}"]`).classList.add("hide");
      let existingElement = document.querySelector(`#selected ul [data-feature*="${feature}"]`);
      let firstPos = existingElement.getBoundingClientRect();
      let lastPos = element.getBoundingClientRect();

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

async function createFeatureElement(element, color) {
  const feature = element.dataset.feature;

  const li = document.createElement("li");
  li.dataset.feature = feature

  const response = await fetch(`images/${feature}.svg`)
  const svgData = await response.text()
  
  const svgWrapper = document.createElement('div')

  svgWrapper.classList.add('selected_feature')

  svgWrapper.innerHTML = svgData

  svgWrapper.querySelectorAll('*').forEach(path => path.style.fill = color)

  li.append(svgWrapper);

  return li;
}

function capitalize(text) {
  return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
}

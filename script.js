"use strict";
document.addEventListener("DOMContentLoaded", start);



async function start() {
    let response = await fetch("images/baggrund2-01.svg")
    let svgData = await response.text();
    document.querySelector("section").innerHTML = svgData;
    hideNoColorChange()
}





function hideNoColorChange () {
    document.querySelectorAll("#bed-1, #bed-2, #bed-3, #bed-4, #tv-1, #tv-2, #tv-3, #tv-4, #tv-5, #tv-6, #tv-7, #tv-8, #tv-9, #wash-1, #wash-2, #wash-3, #wash-4, #wash-5, #washKitch, #stoveKitch, #stoveKitch-2, #vindueA, #vindueB, #vindueC, #vindueD, #vindueE, #vindueF, #vindueG, #vindueI, #vindueH, #vindueK ").forEach(element => {
        element.style.opacity = 0.0
    })

}


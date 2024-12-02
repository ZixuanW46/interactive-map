function loadMap() {
  var map = document.getElementById("map").contentDocument.querySelector("svg");
  var toolTip = document.getElementById("toolTip");
  let policyData = null;

  // Fetch policy data
  fetch("policy.json")
    .then((response) => response.json())
    .then((data) => {
      policyData = data;
    })
    .catch((error) => console.error("Error loading policy data:", error));

  // Add event listeners to map element
  if (
    !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // If user agent is not mobile add click listener (for wikidata links)
    map.addEventListener("click", handleClick, false);
  }
  map.addEventListener("mousemove", mouseEntered, false);
  map.addEventListener("mouseout", mouseGone, false);

  // Show tooltip on mousemove
  function mouseEntered(e) {
    var target = e.target;

    if (target.nodeName == "path") {
      if (!activeElement.includes(target)) {
        target.style.opacity = 0.6;
        target.style.fill = "#C18C5D";
      }
      var details = e.target.attributes;

      // Follow cursor
      toolTip.style.transform = `translate(${e.offsetX}px, ${e.offsetY}px)`;

      // Tooltip data
      toolTip.innerHTML = `
        <ul>
            <li><b>Province: ${details.name.value}</b></li>
            <li>Local name: ${details.gn_name.value}</li>
            <li>Country: ${details.admin.value}</li>
            <li>Postal: ${details.postal.value}</li>
        </ul>`;
    }
  }

  // Clear tooltip on mouseout
  function mouseGone(e) {
    var target = e.target;
    toolTip.innerHTML = "";

    if (target.nodeName == "path" && !activeElement.includes(target)) {
      target.style.opacity = 1;
      target.style.fill = "#a9a6a6";
    }
  }
  // Track the currently active element
  let activeElement = [];

  function handleClick(e) {
    if (e.target.nodeName == "path") {
      var target = e.target;

      var province = e.target.attributes.name.value;
      // Reset previously active elements
      if (activeElement) {
        activeElement.forEach((elementTarget) => {
          dehighlightProvince(elementTarget);
        });
      }
      activeElement = [];
      // Set new active elements
      if (policyData[province]) {
        policyData[province].forEach((name) => {
          const allowedProvinceTarget = map.querySelectorAll(
            `path[name="${name}"]`
          );
          allowedProvinceTarget.forEach((target) => {
            highlightProvince(target);
            activeElement.push(target);
          });
        });
      } else {
        highlightProvince(target);
        activeElement.push(target);
      }
    }
  }

  // Highlight Province
  function highlightProvince(target) {
    target.style.opacity = 1;
    target.style.fill = "#C18C5D";
  }

  // Dehighlight Province
  function dehighlightProvince(target) {
    target.style.opacity = 1;
    target.style.fill = "#a9a6a6";
  }
}

// Calls init function on window load
window.onload = function () {
  // Init map
  loadMap();
};

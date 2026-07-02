let stationData = {};

async function loadStationData() {
  const response = await fetch("data/stations.json");
  stationData = await response.json();
}

function openPanel(station) {
  document.getElementById("station-name").textContent = station.name;

  const image = document.getElementById("station-image");
  image.src = station.image;
  image.alt = station.name;
  image.style.display = "block";

  const linesList = document.getElementById("station-lines");
  linesList.innerHTML = "";

  station.lines.forEach(line => {
    const li = document.createElement("li");
    li.textContent = line;
    linesList.appendChild(li);
  });

  document.getElementById("side-panel").classList.add("open");

  const destinationsList = document.getElementById("station-destinations");
  destinationsList.innerHTML = "";

  if (station.destinations && station.destinations.length > 0) {
    station.destinations.forEach(destination => {
      const li = document.createElement("li");
      li.textContent = destination;
      destinationsList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "None listed";
    destinationsList.appendChild(li);
  }
  
}

async function setupMap() {
  await loadStationData();

  const mapObject = document.getElementById("rail-map");

  mapObject.addEventListener("load", () => {
    const svgDoc = mapObject.contentDocument;

    svgPanZoom(mapObject, {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: true,
      center: true,
      minZoom: 0.5,
      maxZoom: 20,
      mouseWheelZoomEnabled: true
    });

    Object.keys(stationData).forEach(stationId => {
      const stationElement = svgDoc.getElementById(stationId);

      if (!stationElement) return;

      const station = stationData[stationId];

      const hasDestinations =
        station.destinations &&
        station.destinations.length > 0;

      stationElement.style.fill = hasDestinations ? "#2ecc71" : "white";
      stationElement.style.stroke = "#111";

      stationElement.classList.add("station");

      stationElement.addEventListener("click", () => {
        openPanel(station);
      });
    });
  });
}

document.getElementById("close-panel").addEventListener("click", () => {
  document.getElementById("side-panel").classList.remove("open");
});

setupMap();
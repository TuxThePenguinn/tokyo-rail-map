let stationData = {};
let currentImages = [];
let currentImageIndex = 0;

async function loadStationData() {
  const response = await fetch("data/stations.json");
  stationData = await response.json();
}

function openPanel(station) {
  document.getElementById("station-name").textContent = station.name;

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

  const categoriesContainer = document.getElementById("image-categories");
  categoriesContainer.innerHTML = "";

  const imageCategories = station.images ? Object.keys(station.images) : [];

  imageCategories.forEach((categoryName, index) => {
    const button = document.createElement("button");
    button.textContent = categoryName;
    button.classList.add("category-button");

    button.addEventListener("click", () => {
      setImageCategory(station, categoryName);
    });

    categoriesContainer.appendChild(button);

    if (index === 0) {
      button.classList.add("active");
      setImageCategory(station, categoryName);
    }
  });
  
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

function showCarouselImage() {
  const image = document.getElementById("carousel-image");

  if (currentImages.length === 0) {
    image.style.display = "none";
    return;
  }

  image.src = currentImages[currentImageIndex];
  image.alt = "";
  image.style.display = "block";
}

function setImageCategory(station, categoryName) {
  currentImages = station.images[categoryName] || [];
  currentImageIndex = 0;

  document.querySelectorAll(".category-button").forEach(button => {
    button.classList.toggle("active", button.textContent === categoryName);
  });

  showCarouselImage();
}

document.getElementById("carousel-prev").addEventListener("click", () => {
  if (currentImages.length === 0) return;

  currentImageIndex =
    (currentImageIndex - 1 + currentImages.length) % currentImages.length;

  showCarouselImage();
});

document.getElementById("carousel-next").addEventListener("click", () => {
  if (currentImages.length === 0) return;

  currentImageIndex =
    (currentImageIndex + 1) % currentImages.length;

  showCarouselImage();
});

setupMap();
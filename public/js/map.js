
const [lng, lat] = listing.geometry.coordinates;

console.log("lng:", lng);
console.log("lat:", lat);

const map = L.map("map").setView([lat, lng], 9);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);


const marker = L.marker([lat, lng], {
    icon: L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        shadowSize: [41, 41]
    })
})
    .addTo(map)
    .bindPopup(`<h4>${listing.title}</h4><p>Exact location will be provided after booking </p>`);



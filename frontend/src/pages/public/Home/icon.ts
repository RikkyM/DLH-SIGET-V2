import L from "leaflet";

export const makePinIcon = (color: string) =>
  L.divIcon({
    className: "", // penting: biar gak ada style default leaflet
    html: `
      <svg width="34" height="34" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" d="M12 2c-3.86 0-7 3.14-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"/>
        <circle cx="12" cy="9" r="2.8" fill="white"/>
      </svg>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 33], // titik “nempel” ke map
    popupAnchor: [0, -30],
  });

export const iconPetugas = makePinIcon("#008000");
export const iconTitikSampah = makePinIcon("#ef4444");

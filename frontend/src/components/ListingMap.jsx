import { useEffect, useState } from "react";

export default function ListingMap({ location, country }) {
  const [src, setSrc] = useState(null);
  const query = [location, country].filter(Boolean).join(", ");

  useEffect(() => {
    if (!query.trim()) {
      setSrc(null);
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    fetch(url, { headers: { "Accept-Language": "en" } })
      .then((res) => res.json())
      .then((data) => {
        if (data && data[0]) {
          const { lat, lon } = data[0];
          const delta = 0.02;
          const bbox = `${Number(lon) - delta},${Number(lat) - delta},${Number(lon) + delta},${Number(lat) + delta}`;
          setSrc(
            `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lon}`
          );
        } else {
          setSrc(null);
        }
      })
      .catch(() => setSrc(null));
  }, [query]);

  if (!src) return <div className="map-placeholder">Map unavailable for this location.</div>;

  return (
    <div className="map-wrap">
      <iframe
        title="Listing location"
        src={src}
        className="listing-map"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

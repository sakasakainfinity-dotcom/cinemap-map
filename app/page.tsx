"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [139.7671, 35.6812],
      zoom: 5
    });
    (async () => {
      const res = await fetch("/api/locations");
      const { items } = await res.json();
      items?.forEach((p: any) => {
        if (p.lng && p.lat) {
          new mapboxgl.Marker()
            .setLngLat([p.lng, p.lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<b>${p.title}</b>`))
            .addTo(map);
        }
      });
      setLoading(false);
    })();
    return () => map.remove();
  }, []);

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ fontWeight: 700, marginBottom: 8 }}>ロケ地マップ（MVP）</h1>
      <div ref={ref} style={{ width: "100%", height: "70vh", borderRadius: 12 }} />
      {loading && <p>読込中…</p>}
    </main>
  );
}

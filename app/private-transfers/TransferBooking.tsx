"use client";
import { useEffect, useRef, useState } from "react";
import { WaitingOrb } from "./WaitingOrb";

// ---- Types & data (test values — easy to edit) ------------------------------
type Place = { label: string; lat: number; lng: number };
// Popular presets shown before typing; autocomplete covers all of Sardinia.
const PRESETS: Place[] = [
  { label: "Olbia Costa Smeralda Airport (OLB)", lat: 40.8992, lng: 9.5176 },
  { label: "Alghero Airport (AHO)", lat: 40.6321, lng: 8.2907 },
  { label: "Porto Cervo · Costa Smeralda", lat: 41.1350, lng: 9.5360 },
  { label: "Porto Torres (ferry port)", lat: 40.8377, lng: 8.4020 },
  { label: "Olbia (town / port)", lat: 40.9230, lng: 9.4980 },
];

// Airports & ferry ports — the only valid pickups when "Airport" mode is selected.
const AIRPORTS: Place[] = [
  { label: "Olbia Costa Smeralda Airport (OLB)", lat: 40.8992, lng: 9.5176 },
  { label: "Alghero-Fertilia Airport (AHO)", lat: 40.6321, lng: 8.2907 },
  { label: "Cagliari Elmas Airport (CAG)", lat: 39.2515, lng: 9.0543 },
  { label: "Olbia Isola Bianca (ferry port)", lat: 40.9236, lng: 9.5075 },
  { label: "Golfo Aranci (ferry port)", lat: 40.9997, lng: 9.6165 },
  { label: "Porto Torres (ferry port)", lat: 40.8377, lng: 8.4020 },
  { label: "Cagliari (ferry port)", lat: 39.2072, lng: 9.1128 },
  { label: "Santa Teresa Gallura (ferry port)", lat: 41.2400, lng: 9.1900 },
  { label: "Arbatax / Tortolì (ferry port)", lat: 39.9333, lng: 9.7000 },
];

type Vehicle = { id: string; name: string; image: string; pax: number; luggage: number; base: number; perKm: number };
const VEHICLES: Vehicle[] = [
  { id: "sedan", name: "Mercedes E-Class · Sedan", image: "/transfers/sedan.jpg", pax: 3, luggage: 3, base: 100, perKm: 1.3 },
  { id: "vclass-long", name: "Mercedes V-Class Long", image: "/transfers/vclass-long.jpg", pax: 7, luggage: 6, base: 120, perKm: 1.7 },
  { id: "vclass-xl", name: "Mercedes V-Class Extralong", image: "/transfers/vclass-xl.jpg", pax: 7, luggage: 7, base: 135, perKm: 1.8 },
  { id: "minibus", name: "Mercedes Sprinter · Minibus", image: "/transfers/minibus.jpg", pax: 16, luggage: 16, base: 190, perKm: 2.4 },
];

type Extra = { id: string; label: string; price: number; image: string };
const EXTRAS: Extra[] = [
  { id: "seat-infant", label: "Child seat (0–1 yr)", price: 12, image: "/transfers/extras/infant-seat.jpg" },
  { id: "seat-toddler", label: "Child seat (3+ yr)", price: 12, image: "/transfers/extras/child-seat.jpg" },
  { id: "booster", label: "Booster seat", price: 10, image: "/transfers/extras/booster.jpg" },
  { id: "bike", label: "Bike box", price: 18, image: "/transfers/extras/bike-box.jpg" },
];

// ---- Mock distance/time engine (swap for Google Directions later) ------------
function haversineKm(a: Place, b: Place) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
function estimateRoute(from: Place | null, to: Place | null) {
  if (!from || !to) return null;
  const km = Math.round(haversineKm(from, to) * 1.35 * 10) / 10; // road factor
  const minutes = Math.round((km / 65) * 60) + 6; // avg speed + buffer
  return { km, minutes };
}
const fmtTime = (m: number) => `${Math.floor(m / 60)} h ${m % 60} m`;
const eur = (n: number) => `€${Math.round(n)}`;

const STEPS = ["Enter Ride Details", "Choose a Vehicle", "Enter Contact Details"];


// Leaflet is only needed for this map, so it is loaded here (once) instead of
// in the layout of every page.
const LEAFLET_VERSION = "1.9.4";
function ensureLeaflet() {
  if (typeof document === "undefined" || (window as unknown as { L?: unknown }).L) return;
  if (document.getElementById("leaflet-js")) return;
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = `https://cdnjs.cloudflare.com/ajax/libs/leaflet/${LEAFLET_VERSION}/leaflet.css`;
  document.head.appendChild(css);
  const js = document.createElement("script");
  js.id = "leaflet-js";
  js.src = `https://cdnjs.cloudflare.com/ajax/libs/leaflet/${LEAFLET_VERSION}/leaflet.js`;
  js.async = true;
  document.head.appendChild(js);
}

export function TransferBooking() {
  const [step, setStep] = useState(0);
  const [from, setFrom] = useState<Place | null>(null);
  const [to, setTo] = useState<Place | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [tripType, setTripType] = useState<"oneway" | "return">("oneway");
  const [pickupType, setPickupType] = useState<"airport" | "hotel" | "other">("airport");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("12:00");
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [extras, setExtras] = useState<Record<string, number>>({});
  const [contact, setContact] = useState({ first: "", last: "", email: "", phone: "", flight: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const [route, setRoute] = useState<{ km: number; minutes: number } | null>(null);
  const geomRef = useRef<unknown>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObj = useRef<{ remove: () => void; removeLayer: (l: unknown) => void; invalidateSize: () => void; fitBounds: (b: unknown, o?: unknown) => void; setView: (c: unknown, z: number) => void } | null>(null);
  const layersRef = useRef<unknown[]>([]);

  // Real route: OSRM road distance & time (falls back to a straight-line estimate).
  useEffect(() => {
    let cancelled = false;
    if (!from || !to || (from.lat === to.lat && from.lng === to.lng)) { setRoute(null); geomRef.current = null; return; }
    fetch(`https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`)
      .then(r => r.json())
      .then(d => {
        if (cancelled) return;
        const rt = d?.routes?.[0];
        if (rt) { geomRef.current = rt.geometry; setRoute({ km: Math.round(rt.distance / 100) / 10, minutes: Math.round(rt.duration / 60) }); }
        else { geomRef.current = null; setRoute(estimateRoute(from, to)); }
      })
      .catch(() => { if (!cancelled) { geomRef.current = null; setRoute(estimateRoute(from, to)); } });
    return () => { cancelled = true; };
  }, [from, to]);

  // Leaflet map with dark tiles; draws markers + the road route.
  useEffect(() => {
    if (step !== 0) return;
    ensureLeaflet();
    let raf = 0;
    const draw = () => {
      const L = (window as unknown as { L?: any }).L;
      if (!L || !mapRef.current) { raf = requestAnimationFrame(draw); return; }
      if (!mapObj.current) {
        mapObj.current = L.map(mapRef.current, { zoomControl: true, attributionControl: true, scrollWheelZoom: false }).setView([40.92, 9.5], 8);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" }).addTo(mapObj.current);
      }
      const map = mapObj.current as any;
      setTimeout(() => map.invalidateSize(), 0);
      layersRef.current.forEach(l => map.removeLayer(l));
      layersRef.current = [];
      if (from && to) {
        const mk = (lat: number, lng: number) => L.circleMarker([lat, lng], { radius: 8, color: "#fff", weight: 2, fillColor: "#11b6bb", fillOpacity: 1 }).addTo(map);
        layersRef.current.push(mk(from.lat, from.lng), mk(to.lat, to.lng));
        if (geomRef.current) {
          const line = L.geoJSON(geomRef.current, { style: { color: "#11b6bb", weight: 4, opacity: 0.95 } }).addTo(map);
          layersRef.current.push(line);
          map.fitBounds(line.getBounds(), { padding: [40, 40] });
        } else {
          map.fitBounds(L.latLngBounds([from.lat, from.lng], [to.lat, to.lng]), { padding: [50, 50] });
        }
      } else {
        map.setView([40.92, 9.5], 8);
      }
    };
    draw();
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [step, from, to, route]);

  // Remove the map when leaving step 1 (its container unmounts).
  useEffect(() => {
    if (step === 0) return;
    if (mapObj.current) { mapObj.current.remove(); mapObj.current = null; layersRef.current = []; }
  }, [step]);

  const passengers = adults + children;
  const extrasTotal = EXTRAS.reduce((s, e) => s + (extras[e.id] || 0) * e.price, 0);
  const vehicle = VEHICLES.find(v => v.id === vehicleId) ?? null;
  const priceFor = (v: Vehicle) => {
    if (!route) return null;
    const oneWay = Math.max(100, v.base + v.perKm * route.km);
    return (tripType === "return" ? oneWay * 1.9 : oneWay) + extrasTotal;
  };
  // Cheapest-vehicle "from" estimate for step 1 (no extras yet).
  const fromEstimate = route
    ? Math.round(Math.min(...VEHICLES.map(v => {
        const oneWay = Math.max(100, v.base + v.perKm * route.km);
        return tripType === "return" ? oneWay * 1.9 : oneWay;
      })))
    : null;
  const pickupPlaceholder = pickupType === "airport" ? "Select airport or ferry port…" : pickupType === "hotel" ? "Search your hotel or resort…" : "Search any address in Sardinia…";

  const canStep1 = !!from && !!to && !(from.lat === to.lat && from.lng === to.lng) && !!date && (tripType === "oneway" || !!returnDate);
  const setExtra = (id: string, d: number) => setExtras(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) + d) }));

  const Summary = () => (
    <aside className="pt-summary">
      <h3>Summary</h3>
      <dl>
        <div><dt>Pickup</dt><dd>{from?.label || "—"}</dd></div>
        <div><dt>Drop-off</dt><dd>{to?.label || "—"}</dd></div>
        <div><dt>Trip</dt><dd>{tripType === "return" ? "Return" : "One-way"} · {pickupType === "airport" ? "Airport" : pickupType === "hotel" ? "Hotel" : "Other"} pickup</dd></div>
        <div><dt>Pickup date &amp; time</dt><dd>{date ? `${date}, ${time}` : "—"}</dd></div>
        {tripType === "return" && <div><dt>Return</dt><dd>{returnDate ? `${returnDate}, ${returnTime}` : "—"}</dd></div>}
        <div><dt>Distance</dt><dd>{route ? `${route.km} km${tripType === "return" ? " each way" : ""}` : "—"}</dd></div>
        <div><dt>Travel time</dt><dd>{route ? fmtTime(route.minutes) : "—"}</dd></div>
        <div><dt>Passengers</dt><dd>{passengers} {passengers === 1 ? "passenger" : "passengers"}</dd></div>
        {vehicle && <div><dt>Vehicle</dt><dd>{vehicle.name}</dd></div>}
        {vehicle && route && <div className="pt-summary-total"><dt>Estimated price</dt><dd>{eur(priceFor(vehicle)!)}</dd></div>}
      </dl>
      <p className="pt-summary-note">Test estimate. Final quote confirmed by email — minimum €100.</p>
    </aside>
  );

  if (submitted) {
    return (
      <div className="pt-done">
        <div className="pt-done-badge" aria-hidden="true">✓</div>
        <h2>Request received</h2>
        <p>Thanks{contact.first ? `, ${contact.first}` : ""} — we&apos;ve got your transfer request from <strong>{from?.label}</strong> to <strong>{to?.label}</strong>. We&apos;ll email you a confirmed quote shortly.</p>
        <button type="button" className="pt-btn" onClick={() => { setSubmitted(false); setStep(0); }}>Book another transfer</button>
      </div>
    );
  }

  return (
    <div className="pt-widget">
      <ol className="pt-steps">
        {STEPS.map((s, i) => (
          <li key={s} className={`pt-step${i === step ? " is-active" : ""}${i < step ? " is-done" : ""}`}>
            <button type="button" onClick={() => i < step && setStep(i)} disabled={i > step}>
              <span className="pt-step-num">{i < step ? "✓" : i + 1}</span>
              <span className="pt-step-label">{s}</span>
            </button>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="pt-grid">
          <div className="pt-panel">
            <h3 className="pt-panel-title">Ride details</h3>
            <div className="pt-segrow">
              <div className="pt-segblock">
                <span className="pt-seg-caption">Trip</span>
                <div className="pt-seg">
                  <button type="button" className={tripType === "oneway" ? "is-on" : ""} onClick={() => setTripType("oneway")}>One-way</button>
                  <button type="button" className={tripType === "return" ? "is-on" : ""} onClick={() => setTripType("return")}>Return</button>
                </div>
              </div>
              <div className="pt-segblock">
                <span className="pt-seg-caption">Pickup type</span>
                <div className="pt-seg">
                  <button type="button" className={pickupType === "airport" ? "is-on" : ""} onClick={() => setPickupType("airport")}>Airport</button>
                  <button type="button" className={pickupType === "hotel" ? "is-on" : ""} onClick={() => setPickupType("hotel")}>Hotel</button>
                  <button type="button" className={pickupType === "other" ? "is-on" : ""} onClick={() => setPickupType("other")}>Other</button>
                </div>
              </div>
            </div>
            <div className="pt-field-row">
              <label className="pt-field"><span>Pickup date</span><input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
              <label className="pt-field"><span>Pickup time</span><input type="time" value={time} onChange={e => setTime(e.target.value)} /></label>
            </div>
            <div className={`pt-return-reveal${tripType === "return" ? " is-open" : ""}`} aria-hidden={tripType !== "return"} inert={tripType !== "return"}>
              <div className="pt-return-reveal-inner">
                <div className="pt-field-row">
                  <label className="pt-field"><span>Return date</span><input type="date" disabled={tripType !== "return"} value={returnDate} onChange={e => setReturnDate(e.target.value)} /></label>
                  <label className="pt-field"><span>Return time</span><input type="time" disabled={tripType !== "return"} value={returnTime} onChange={e => setReturnTime(e.target.value)} /></label>
                </div>
              </div>
            </div>
            <div className="pt-field"><span>{pickupType === "airport" ? "Airport / ferry port pickup" : pickupType === "hotel" ? "Hotel pickup" : "Pickup location"}</span>
              <AddressInput placeholder={pickupPlaceholder} value={from} onSelect={setFrom} options={pickupType === "airport" ? AIRPORTS : undefined} />
            </div>
            <div className="pt-field"><span>Drop-off location</span>
              <AddressInput placeholder="Search any address in Sardinia…" value={to} onSelect={setTo} />
            </div>
            <div className="pt-field-row pt-passenger-row">
              <div className="pt-field"><span>Adults</span><Stepper value={adults} min={1} onChange={setAdults} /></div>
              <div className="pt-field"><span>Children</span><Stepper value={children} min={0} onChange={setChildren} /></div>
            </div>
          </div>

          <div className="pt-panel pt-mapcard">
            <div className="pt-map" ref={mapRef} aria-label="Route map" />
            <div className="pt-metrics">
              <div><span className="pt-metric-k">Total distance</span><strong>{route ? `${route.km} km` : "—"}</strong></div>
              <div><span className="pt-metric-k">Total time</span><strong>{route ? fmtTime(route.minutes) : "—"}</strong></div>
              <div className="pt-metric-price"><span className="pt-metric-k">Estimated price</span><strong>{fromEstimate ? `from €${fromEstimate}` : "—"}</strong></div>
            </div>
          </div>

          <div className="pt-actions">
            <button type="button" className="pt-btn button-02" disabled={!canStep1} onClick={() => setStep(1)}>
              <span className="inner"><WaitingOrb active={!canStep1} /><span>Choose a vehicle</span></span>
              <span className="circle" aria-hidden="true"><span>→</span></span>
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="pt-grid pt-grid-summary">
          <Summary />
          <div className="pt-panel">
            <h3 className="pt-panel-title">Choose a vehicle</h3>
            <div className="pt-vehicles">
              {VEHICLES.map(v => {
                const fits = v.pax >= passengers;
                return (
                  <div key={v.id} className={`pt-vehicle${vehicleId === v.id ? " is-selected" : ""}${!fits ? " is-disabled" : ""}`}>
                    <img src={v.image} alt={v.name} loading="lazy" />
                    <div className="pt-vehicle-info">
                      <h4>{v.name}</h4>
                      <div className="pt-vehicle-caps">
                        <span title="Passengers">👥 {v.pax}</span>
                        <span title="Luggage">🧳 {v.luggage}</span>
                      </div>
                      {!fits && <p className="pt-vehicle-warn">Not enough seats for {passengers} passengers</p>}
                    </div>
                    <div className="pt-vehicle-buy">
                      <span className="pt-vehicle-price">{route ? eur(priceFor(v)!) : "—"}</span>
                      <button type="button" className="pt-btn pt-btn-sm" disabled={!fits} onClick={() => setVehicleId(v.id)}>{vehicleId === v.id ? "Selected" : "Select"}</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <h3 className="pt-panel-title pt-extras-title">Extras &amp; travel details</h3>
            <div className="pt-extras">
              {EXTRAS.map(e => (
                <div key={e.id} className="pt-extra">
                  <img className="pt-extra-img" src={e.image} alt="" loading="lazy" />
                  <span className="pt-extra-label">{e.label}<small>+{eur(e.price)}</small></span>
                  <Stepper value={extras[e.id] || 0} min={0} onChange={n => setExtras(p => ({ ...p, [e.id]: n }))} />
                </div>
              ))}
            </div>

            <div className="pt-actions pt-actions-split">
              <button type="button" className="pt-btn pt-btn-ghost" onClick={() => setStep(0)}>← Ride details</button>
              <button type="button" className="pt-btn" disabled={!vehicleId} onClick={() => setStep(2)}>Enter contact details →</button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="pt-grid pt-grid-summary">
          <Summary />
          <div className="pt-panel">
            <h3 className="pt-panel-title">Contact details</h3>
            <div className="pt-field-row">
              <label className="pt-field"><span>First name *</span><input value={contact.first} onChange={e => setContact({ ...contact, first: e.target.value })} /></label>
              <label className="pt-field"><span>Last name *</span><input value={contact.last} onChange={e => setContact({ ...contact, last: e.target.value })} /></label>
            </div>
            <div className="pt-field-row">
              <label className="pt-field"><span>E-mail address *</span><input type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} /></label>
              <label className="pt-field"><span>Phone number</span><input type="tel" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} placeholder="+39 …" /></label>
            </div>
            <label className="pt-field"><span>Flight number</span><input value={contact.flight} onChange={e => setContact({ ...contact, flight: e.target.value })} placeholder="e.g. AZ 1554" /></label>
            <label className="pt-field"><span>Special requests</span><textarea rows={3} value={contact.notes} onChange={e => setContact({ ...contact, notes: e.target.value })} /></label>
            <div className="pt-actions pt-actions-split">
              <button type="button" className="pt-btn pt-btn-ghost" onClick={() => setStep(1)}>← Choose a vehicle</button>
              <button type="button" className="pt-btn" disabled={!contact.first || !contact.last || !contact.email} onClick={() => setSubmitted(true)}>Request my quote →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddressInput({ placeholder, value, onSelect, options }: { placeholder: string; value: Place | null; onSelect: (p: Place | null) => void; options?: Place[] }) {
  const [q, setQ] = useState(value?.label || "");
  const [items, setItems] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { setQ(value?.label || ""); }, [value]);

  const restricted = Array.isArray(options);
  const runSearch = (text: string) => {
    setQ(text);
    onSelect(null);
    if (timer.current) clearTimeout(timer.current);
    if (restricted) {
      const t = text.trim().toLowerCase();
      setItems(t ? options!.filter(o => o.label.toLowerCase().includes(t)) : options!);
      setOpen(true);
      return;
    }
    if (text.trim().length < 3) { setItems(PRESETS); setOpen(true); return; }
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&countrycodes=it&viewbox=8.0,41.4,9.95,38.8&bounded=1&q=${encodeURIComponent(text)}`, { headers: { "Accept-Language": "en" } });
        const d = await r.json();
        setItems((Array.isArray(d) ? d : []).map((x: { display_name: string; lat: string; lon: string }) => ({ label: x.display_name.split(",").slice(0, 3).join(",").trim(), lat: +x.lat, lng: +x.lon })));
        setOpen(true);
      } catch { setItems([]); }
    }, 350);
  };
  const pick = (p: Place) => { onSelect(p); setQ(p.label); setOpen(false); };
  return (
    <div className="pt-ac">
      <input
        value={q}
        placeholder={placeholder}
        onChange={e => runSearch(e.target.value)}
        onFocus={() => { setItems(prev => (prev.length ? prev : (restricted ? options! : PRESETS))); setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
      />
      {open && items.length > 0 && (
        <ul className="pt-ac-list">
          {items.map((it, i) => (
            <li key={i}><button type="button" onMouseDown={e => e.preventDefault()} onClick={() => pick(it)}><span aria-hidden="true">📍</span>{it.label}</button></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stepper({ value, min, onChange }: { value: number; min: number; onChange: (n: number) => void }) {
  return (
    <div className="pt-stepper">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease">−</button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Increase">+</button>
    </div>
  );
}

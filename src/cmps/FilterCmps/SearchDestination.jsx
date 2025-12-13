


import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Tiny starter index. Replace with a larger dataset:
 * - Local JSON (top 10k cities) and import it
 * - Or use Fuse.js for better fuzzy
 * Object shape can be anything; we just need name + country
 */
const CITY_INDEX = [
  { name: "Tel Aviv-Yafo", country: "Israel", countryCode: "IL", lat: 32.0853, lng: 34.7818 },
  { name: "Jerusalem", country: "Israel", countryCode: "IL", lat: 31.7683, lng: 35.2137 },
  { name: "Haifa", country: "Israel", countryCode: "IL", lat: 31.7683, lng: 35.2137 },
  { name: "Herzliya", country: "Israel", countryCode: "IL", lat: 31.7683, lng: 35.2137 },
  { name: "London", country: "United Kingdom", countryCode: "GB", lat: 51.5072, lng: -0.1276 },
  { name: "Paris", country: "France", countryCode: "FR", lat: 48.8566, lng: 2.3522 },
  { name: "New York", country: "United States", countryCode: "US", lat: 40.7128, lng: -74.0060 },
  { name: "Barcelona", country: "Spain", countryCode: "ES", lat: 41.3874, lng: 2.1686 },
  { name: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.6762, lng: 139.6503 },
  { name: "Amsterdam", country: "Netherlands", countryCode: "NL", lat: 52.3676, lng: 4.9041 },
  { name: "Athens", country: "Greece", countryCode: "GR", lat: 52.3676, lng: 4.9041 },
  { name: "Rome", country: "Italy", countryCode: "IT", lat: 41.9028, lng: 12.4964 },
  { name: "Lisbon", country: "Portugal", countryCode: "PT", lat: 38.7223, lng: -9.1393 },
];

function countryCodeToFlag(cc = "") {
  // turns "IL" to 🇮🇱
  return cc
    .toUpperCase()
    .replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt()));
}

function basicFilter(index, q, limit = 8) {
  if (!q) return index.slice(0, limit);
  const needle = q.trim().toLowerCase();
  const starts = [];
  const contains = [];

  for (const c of index) {
    const city = c.name.toLowerCase();
    const country = c.country.toLowerCase();
    if (city.startsWith(needle) || country.startsWith(needle)) starts.push(c);
    else if (city.includes(needle) || country.includes(needle)) contains.push(c);
    if (starts.length >= limit) break;
  }
  const out = [...starts, ...contains].slice(0, limit);
  return out;
}

export function SearchDestination({ handleChange, isOpen, onCloseModal }) {
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(() => CITY_INDEX.slice(0, 8));
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const wrapperRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) onCloseModal?.();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [onCloseModal]);

  // Debounced search
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setResults(basicFilter(CITY_INDEX, query, 8));
      setActiveIdx(0);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  function selectCity(cityObj) {
    handleChange?.(cityObj.name);
    onCloseModal?.();
  }

  function onKeyDown(e) {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectCity(results[activeIdx]);
    } else if (e.key === "Escape") {
      onCloseModal?.();
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="destination-modal p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search destination"
      onKeyDown={onKeyDown}
    >
        {/* <label htmlFor="dest-input" className="label">Where</label> */}
        <input
          id="dest-input"
          ref={inputRef}
          type="text"
          placeholder="Search destinations (city or country)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input"
          autoComplete="off"
        />

      <div className="results">
        {loading && <div className="muted small">Searching…</div>}
        {!loading && results.length === 0 && (
          <div className="muted small">No matches</div>
        )}

        <ul
          ref={listRef}
          role="listbox"
          aria-label="Destination suggestions"
          className="suggestions  custom-scroll"
        >
          {results.map((c, idx) => {
            const isActive = idx === activeIdx;
            return (
              <li
                key={`${c.name}-${c.country}`}
                role="option"
                aria-selected={isActive}
                className={`suggestion ${isActive ? "active" : ""}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseDown={e => e.preventDefault()} // keep focus
                onClick={() => selectCity(c)}
              >
                <span className="flag">{countryCodeToFlag(c.countryCode)}</span>
                <div className="place">
                  <div className="city">{c.name}</div>
                  <div className="country muted">{c.country}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

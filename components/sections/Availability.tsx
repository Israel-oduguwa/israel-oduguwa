import Image from "next/image";
import { Download, Mail } from "lucide-react";

import { buttonClasses } from "@/components/ui/Button";
import { GlobeScene } from "@/components/ui/GlobeScene";
import type { GlobeConfig, GlobeMarker, Position } from "@/components/ui/globe";

const globeConfig: GlobeConfig = {
  pointSize: 4,
  globeColor: "#1e293b",
  showAtmosphere: true,
  atmosphereColor: "#c084fc",
  atmosphereAltitude: 0.15,
  emissive: "#0f172a",
  emissiveIntensity: 0.8,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.8)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

const colors = ["#ec4899", "#8b5cf6", "#3b82f6", "#06b6d4"];
const nigeria = { lat: 6.5244, lng: 3.3792 };
const globalCoords = [
  nigeria,
  { lat: 37.7749, lng: -122.4194 }, // San Francisco
  { lat: 40.7128, lng: -74.006 }, // New York
  { lat: 51.5072, lng: -0.1276 }, // London
  { lat: 46.8182, lng: 8.2275 }, // Switzerland
  { lat: 43.65107, lng: -79.347015 }, // Canada
  { lat: 25.2048, lng: 55.2708 }, // Dubai

  { lat: 35.6762, lng: 139.6503 }, // Tokyo
  { lat: -33.8688, lng: 151.2093 }, // Sydney
  { lat: 1.3521, lng: 103.8198 }, // Singapore
  { lat: 48.8566, lng: 2.3522 }, // Paris
];

const generateArcs = (): Position[] => {
  const arcs: Position[] = [];

  let order = 1;
  for (let i = 1; i < globalCoords.length; i++) {
    arcs.push({
      order: order++,
      startLat: nigeria.lat,
      startLng: nigeria.lng,
      endLat: globalCoords[i].lat,
      endLng: globalCoords[i].lng,
      arcAlt: i % 2 === 0 ? 0.24 : 0.18,
      color: colors[i % colors.length],
    });
  }

  for (let i = 1; i < globalCoords.length; i++) {
    for (let j = i + 1; j < globalCoords.length; j++) {
      if ((i + j) % 3 !== 0) continue;

      arcs.push({
        order: order++,
        startLat: globalCoords[i].lat,
        startLng: globalCoords[i].lng,
        endLat: globalCoords[j].lat,
        endLng: globalCoords[j].lng,
        arcAlt: 0.14 + ((i + j) % 4) * 0.06,
        color: colors[(i + j) % colors.length],
      });
    }
  }

  return arcs;
};

const globeArcs = generateArcs();
const globeMarkers: GlobeMarker[] = [
  {
    lat: nigeria.lat,
    lng: nigeria.lng,
    label: "",
    imageUrl: "/images/profile-tiny.png",
    imageAltitude: 0.1,
    // imageGlowColor: "#0000",
    imageSize: 8,
  },
];

const locations = [
  // { name: "Nigeria", code: "NG" },
  { name: "USA", code: "US" },
  { name: "London", code: "GBR" },
  { name: "Switzerland", code: "CH" },
  { name: "Canada", code: "CA" },
  { name: "Dubai", code: "AE" },
  { name: "Tokyo", code: "JP" },
  { name: "Remote", code: "001" },
];

function Availability() {
  return (
    <section
      className="relative overflow-hidden bg-[#050816] py-28 text-white md:py-32"
      id="availability"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] opacity-25" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1920px]">
        <div className="container mx-auto mb-16 px-6 text-center md:mb-20 md:px-12">
          <h2 className="mx-auto max-w-5xl text-5xl font-bold leading-tight tracking-tight text-white text-balance md:text-7xl lg:text-[5.5rem]">
            Available for the right team
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Open to frontend, full-stack, and product engineering roles where
            clean UI, reliable workflows, and fast execution matter.
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,460px)] lg:gap-8 xl:gap-12">
          <div className="relative h-[500px] overflow-visible sm:h-[640px] md:h-[780px] lg:h-[900px] xl:h-[980px]">
            <div className="pointer-events-none absolute inset-y-0 -left-[8vw] w-[112%] bg-[radial-gradient(circle_at_40%_50%,rgba(56,189,248,0.14),transparent_58%)] [mask-image:radial-gradient(ellipse_at_40%_50%,black_0%,black_54%,transparent_76%)]" />
            {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#050816]/85 to-transparent" /> */}
            <div className="absolute inset-x-0 -top-16 -bottom-16 sm:-top-24 sm:-bottom-24 lg:-top-28 lg:-bottom-28">
              <GlobeScene
                data={globeArcs}
                globeConfig={globeConfig}
                markers={globeMarkers}
              />
            </div>
          </div>

          <div className="relative z-20 px-6 md:px-12 lg:pl-0 lg:pr-12 xl:pr-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Remote-friendly, easy to work with
                </h3>
                <p className="mt-4 text-base leading-relaxed text-slate-300">
                  I work async-first with teams across time zones. Whether
                  you&apos;re in San Francisco or Tokyo, I ensure clean
                  handoffs, reliable delivery, and enough overlap for clear
                  decisions.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <span
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-sky-100 transition-colors hover:bg-white/10 hover:text-white"
                    key={location.name}
                  >
                    {location.code === "001" ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
                    ) : (
                      <Image
                        src={`/flags/s/${location.code}.svg`}
                        alt=""
                        width={20}
                        height={20}
                        loading="lazy"
                        aria-hidden="true"
                        className="h-5 w-5 rounded-full border border-white/20 object-cover shadow-sm"
                      />
                    )}
                    {location.name}
                  </span>
                ))}
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                    Open for work
                  </p>
                </div>
                <p className="text-sm text-slate-400">
                  Available for frontend, full-stack, product engineering,
                  contract, freelance, and full-time opportunities.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="/resume.pdf"
                  download
                  className={buttonClasses({
                    variant: "primary",
                    className:
                      "group h-12 gap-2 rounded-full bg-white px-6 text-slate-950 hover:bg-sky-50",
                  })}
                >
                  <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  Download Resume
                </a>
                <a
                  href="mailto:hello@israeloduguwa.com"
                  className={buttonClasses({
                    variant: "secondary",
                    className:
                      "h-12 gap-2 rounded-full border-white/10 bg-white/5 px-6 text-white hover:bg-white/10",
                  })}
                >
                  <Mail className="h-4 w-4" />
                  Email Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Availability;

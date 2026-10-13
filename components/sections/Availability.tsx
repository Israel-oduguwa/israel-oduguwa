import { Download, Mail } from "lucide-react";
import { GlobeScene } from "@/components/ui/GlobeScene";
import type { GlobeConfig, Position } from "@/components/ui/globe";
import { profile } from "@/lib/portfolio";

const globeConfig: GlobeConfig = {
  pointSize: 4,
  globeColor: "#1e293b",
  showAtmosphere: true,
  atmosphereColor: "#81a6ff",
  atmosphereAltitude: 0.15,
  emissive: "#0f172a",
  emissiveIntensity: 0.8,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.8)",
  ambientLight: "#ffffff",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 0,
  arcLength: 1,
  rings: 0,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: false,
  autoRotateSpeed: 0.5,
};

// Illustrative routes; no point identifies a personal location.
const points = [
  [37.7749, -122.4194],
  [40.7128, -74.006],
  [51.5072, -0.1276],
  [46.8182, 8.2275],
  [43.65107, -79.347015],
  [25.2048, 55.2708],
  [35.6762, 139.6503],
  [-33.8688, 151.2093],
  [1.3521, 103.8198],
  [48.8566, 2.3522],
];
const routes: Position[] = points.flatMap((start, index) =>
  points
    .filter((_, endIndex) => endIndex > index && (index + endIndex) % 3 === 0)
    .map((end, routeIndex) => ({
      order: index * points.length + routeIndex + 1,
      startLat: start[0],
      startLng: start[1],
      endLat: end[0],
      endLng: end[1],
      arcAlt: 0.18 + (routeIndex % 3) * 0.06,
      color: "#81a6ff",
    })),
);

export default function Availability() {
  return (
    <section id="availability" className="availability-section">
      <div className="availability-grid shell">
        <div className="availability-globe">
          <GlobeScene data={routes} globeConfig={globeConfig} />
          <p>Illustrative collaboration routes</p>
        </div>
        <div className="availability-copy" data-reveal>
          <p className="section-kicker">
            <span>06</span> Availability
          </p>
          <h2>
            Available for
            <br />
            remote work<span>.</span>
          </h2>
          <p>
            My work covers system architecture, backend and data services,
            production migrations and AI orchestration. At KinsCare, I guided
            seven developers through design, code review and infrastructure
            decisions.
          </p>
          <p>
            I’m open to senior engineering roles and contract projects with
            ownership of architecture and delivery. I also work at micro1 on
            frontend software engineering evaluation.
          </p>
          <div className="availability-tags">
            <span>Full-stack engineering</span>
            <span>Applied AI</span>
            <span>Full-time & contract</span>
          </div>
          <div className="availability-actions">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              <Download size={17} aria-hidden="true" /> Read my résumé
            </a>
            <a href={`mailto:${profile.email}`} className="availability-email">
              <Mail size={17} aria-hidden="true" /> Email me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

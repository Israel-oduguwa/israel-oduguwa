import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/portfolio";
import { RecoveryPreview } from "@/components/ui/RecoveryPreview";

export function ProjectVisual({ project }: { project: Project }) {
  if (project.slug === "safestripe") {
    return (
      <div className="project-visual stripe">
        <RecoveryPreview />
      </div>
    );
  }
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`project-visual ${project.theme}`}
      aria-label={`Read the ${project.name} case study`}
    >
      <div className="browser-chrome" aria-hidden="true">
        <span />
        <span />
        <span />
        <div>
          {project.slug === "kinscare" ? "kinscare.org" : "excelcna.com"}
        </div>
      </div>
      <Image
        src={project.image}
        alt={project.imageAlt}
        width={1440}
        height={900}
        sizes="(max-width: 800px) 90vw, 550px"
        className="project-screenshot"
      />
      <span className="project-open" aria-hidden="true">
        Read case study
      </span>
    </Link>
  );
}

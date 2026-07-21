"use client";

import { getCalculusUnitCollection } from "../lib/calculus/calculus-units-index.mjs";
import { limitsUnitChapters } from "../lib/calculus/limits-unit-index.mjs";
import {
  UNIT_2A_ROOT,
  UNIT_2B_ROOT,
  UNIT_3A_ROOT,
  UNIT_3B_ROOT,
  UNIT_4A_ROOT,
} from "./CalculusUnitNavigation";

export const CALCULUS_ROOT = "/subjects/math/calculus/";
export const UNIT_1_ROOT = "/subjects/math/calculus/limits-continuity/";
export const CHAPTER_4_ROOT = UNIT_4A_ROOT;

type SectionLink = { id: string; title: string; href: string };
type UnitLink = {
  code: string;
  title: string;
  description: string;
  root: string;
  sections: SectionLink[];
};

const unitIds = {
  "2A": "calc-1-unit-2a-derivative-foundations-techniques",
  "2B": "calc-1-unit-2b-derivative-applications",
  "3A": "calc-1-unit-3a-integral-foundations-techniques",
  "3B": "calc-1-unit-3b-integration-applications",
  "4A": "calc-2-unit-4a-sequences-infinite-series",
} as const;

function sectionsForUnit(code: keyof typeof unitIds): SectionLink[] {
  const collection = getCalculusUnitCollection(unitIds[code]);
  if (!collection) return [];
  const seen = new Set<string>();
  return collection.routes.flatMap((route: { sectionId: string; sectionTitle: string; path: string }) => {
    if (seen.has(route.sectionId)) return [];
    seen.add(route.sectionId);
    return [{ id: route.sectionId, title: route.sectionTitle, href: route.path }];
  });
}

const chapterOneSections: SectionLink[] = limitsUnitChapters.map((section: {
  id: string;
  title: string;
  routes: { path: string }[];
}) => ({
  id: section.id,
  title: section.title.replace(/^Section\s+\d+:\s*/i, ""),
  href: section.routes[0]?.path ?? UNIT_1_ROOT,
}));

const chapters: {
  id: string;
  title: string;
  description: string;
  course: string;
  units: UnitLink[];
}[] = [
  {
    id: "1",
    title: "Limits and Continuity",
    description: "Build the language of approaching, continuity, infinite behavior, and formal limit reasoning.",
    course: "Calculus I",
    units: [{
      code: "1",
      title: "Limits and Continuity",
      description: "The foundation for derivatives and every later calculus model.",
      root: UNIT_1_ROOT,
      sections: chapterOneSections,
    }],
  },
  {
    id: "2",
    title: "Derivatives",
    description: "Learn what derivatives mean and how to compute them, then use them to analyze and model change.",
    course: "Calculus I",
    units: [
      {
        code: "2A",
        title: "Foundations and techniques",
        description: "Meaning, definitions, rules, compositions, implicit work, and higher derivatives.",
        root: UNIT_2A_ROOT,
        sections: sectionsForUnit("2A"),
      },
      {
        code: "2B",
        title: "Applications and modeling",
        description: "Motion, approximation, related rates, curve analysis, optimization, and models.",
        root: UNIT_2B_ROOT,
        sections: sectionsForUnit("2B"),
      },
    ],
  },
  {
    id: "3",
    title: "Integrals",
    description: "Build accumulation and integration technique, then turn integrals into geometric and physical models.",
    course: "Calculus I",
    units: [
      {
        code: "3A",
        title: "Foundations and techniques",
        description: "Antiderivatives, definite integrals, the Fundamental Theorem, and integration methods.",
        root: UNIT_3A_ROOT,
        sections: sectionsForUnit("3A"),
      },
      {
        code: "3B",
        title: "Applications and modeling",
        description: "Area, volume, length, mass, work, fluids, probability, and quantitative models.",
        root: UNIT_3B_ROOT,
        sections: sectionsForUnit("3B"),
      },
    ],
  },
  {
    id: "4",
    title: "Sequences and Series",
    description: "Move from finite accumulation to convergence, infinite series, power series, and controlled approximation.",
    course: "Calculus II",
    units: [{
      code: "4A",
      title: "Sequences and infinite series",
      description: "Sequences, partial sums, convergence tests, absolute and conditional convergence, and error control.",
      root: UNIT_4A_ROOT,
      sections: sectionsForUnit("4A"),
    }],
  },
];

function currentChapterForPath(path: string) {
  if (path.startsWith(UNIT_1_ROOT)) return "1";
  if (path.startsWith(UNIT_2A_ROOT) || path.startsWith(UNIT_2B_ROOT)) return "2";
  if (path.startsWith(UNIT_3A_ROOT) || path.startsWith(UNIT_3B_ROOT)) return "3";
  if (path.startsWith(CHAPTER_4_ROOT) || path.startsWith("/subjects/math/calculus/sequences-series/")) return "4";
  return undefined;
}

export function CalculusCourseNavigation({ currentPath = CALCULUS_ROOT }: { currentPath?: string }) {
  const currentChapter = currentChapterForPath(currentPath);
  return <section className="calculus-course-nav section-pad" aria-labelledby="calculus-course-nav-title">
    <header className="calculus-course-nav-head">
      <div>
        <p className="eyebrow">Calculus course navigator</p>
        <h2 id="calculus-course-nav-title">One course. Clear chapters.</h2>
      </div>
      <p>Open a chapter to see its labeled units and sections. Units 2A and 2B form one derivatives chapter; Units 3A and 3B form one integrals chapter.</p>
    </header>
    <div className="calculus-chapter-list">
      {chapters.map((chapter) => {
        const current = currentChapter === chapter.id;
        return <details className="calculus-chapter" data-chapter={chapter.id} open={current || (!currentChapter && chapter.id === "1")} key={chapter.id}>
          <summary>
            <span className="calculus-chapter-number">Chapter {chapter.id}</span>
            <span className="calculus-chapter-title"><b>{chapter.title}</b><small>{chapter.description}</small></span>
            <span className="calculus-chapter-course">{chapter.course}</span>
            <span className="calculus-chapter-toggle" aria-hidden="true">+</span>
          </summary>
          <div className={`calculus-chapter-units${chapter.units.length > 1 ? " has-parts" : ""}`}>
            {chapter.units.map((unit) => <section className="calculus-chapter-unit" key={unit.code}>
              <header>
                <span>{unit.code === "Chapter guide" ? unit.code : `Unit ${unit.code}`}</span>
                <h3>{unit.title}</h3>
                <p>{unit.description}</p>
                <a href={unit.root}>Open {unit.code === "Chapter guide" ? "chapter" : `Unit ${unit.code}`} map <span aria-hidden="true">→</span></a>
              </header>
              <nav aria-label={`${unit.code} sections`}>
                {unit.sections.map((section) => <a href={section.href} key={section.id}>{section.title}<span aria-hidden="true">→</span></a>)}
              </nav>
            </section>)}
          </div>
        </details>;
      })}
    </div>
  </section>;
}

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const specialSectionKinds = new Map([
  ["Required visual sequence", "figures"],
  ["Check yourself", "checkpoint"],
  ["Practice set", "practice"],
  ["Source guidance", "sources"],
]);

function cleanInline(value) {
  return String(value)
    .replace(/<\/?details[^>]*>/gi, "")
    .replace(/<\/?summary>/gi, "")
    .replace(/\*\*/g, "")
    .replace(/(?<!\w)\*(?!\w)|(?<!\w)_(?!\w)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sectionMap(markdown) {
  const matches = [...markdown.matchAll(/^###\s+(.+?)\s*$/gm)];
  const sections = [];
  for (const [index, match] of matches.entries()) {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? markdown.length;
    sections.push({ heading: cleanInline(match[1]), body: markdown.slice(start, end).trim() });
  }
  return sections;
}

function labeledValue(body, labels) {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = body.match(new RegExp(`\\*\\*${escaped}\\.?\\*\\*\\s*([\\s\\S]*?)(?=\\n\\n(?:\\*\\*|####)|$)`, "i"));
    if (match) return cleanInline(match[1]);
  }
  return "";
}

function firstParagraph(body) {
  return cleanInline(body.split(/\n{2,}/)[0] ?? "");
}

function markdownBlocks(body) {
  const blocks = [];
  const chunks = body.split(/\n{2,}/).map((chunk) => chunk.trim()).filter(Boolean);
  for (const chunk of chunks) {
    if (/^<details/i.test(chunk) || /^<\/?summary/i.test(chunk)) continue;
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (/^####\s+/.test(lines[0])) {
      blocks.push({ type: "subheading", text: cleanInline(lines[0].replace(/^####\s+/, "")) });
      if (lines.length > 1) blocks.push({ type: "paragraph", text: cleanInline(lines.slice(1).join(" ")) });
      continue;
    }
    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      blocks.push({ type: "list", items: lines.map((line) => cleanInline(line.replace(/^\d+\.\s+/, ""))) });
      continue;
    }
    const callout = chunk.match(/^\*\*([^*]+?)\.?\*\*\s*([\s\S]*)$/);
    if (callout) {
      const label = cleanInline(callout[1]);
      if (label.toLowerCase() === "opening solution") continue;
      blocks.push({ type: "callout", label, text: cleanInline(callout[2]) });
      continue;
    }
    const text = cleanInline(lines.join(" "));
    if (/^This mechanism should be visible in the lesson's main figure\./i.test(text)) continue;
    blocks.push({ type: "paragraph", text });
  }
  return blocks.filter((block) => block.text || block.items?.length);
}

function workedExample(body, marker, nextMarker, type, fallbacks) {
  const markerIndex = body.indexOf(marker);
  if (markerIndex < 0) return fallbacks;
  const afterMarker = body.slice(markerIndex + marker.length);
  const end = nextMarker ? afterMarker.indexOf(nextMarker) : -1;
  const slice = end >= 0 ? afterMarker.slice(0, end) : afterMarker;
  return {
    type,
    problem: labeledValue(slice, ["Problem"]) || firstParagraph(slice) || fallbacks.problem,
    solution: labeledValue(slice, ["Worked development", "Solution"]) || fallbacks.solution,
    interpretation: labeledValue(slice, ["Interpretation", "Why this works"]) || fallbacks.interpretation,
  };
}

function parseExamples(openingBody, workedBody, concept) {
  const foundation = {
    type: "foundation",
    problem: firstParagraph(openingBody),
    solution: labeledValue(openingBody, ["Solution"]) || concept.method,
    interpretation: labeledValue(openingBody, ["Why this works"]) || concept.mechanism,
  };
  const transfer = workedExample(
    workedBody,
    "#### Transfer example",
    "#### Reasoning example",
    "transfer",
    foundation,
  );
  const reasoning = workedExample(
    workedBody,
    "#### Reasoning example",
    "**Worked example 4",
    "reasoning",
    foundation,
  );
  return [foundation, transfer, reasoning];
}

function parseFigures(visualBody, lesson, concept) {
  const matches = [...visualBody.matchAll(/^\*\*([^:]+):\s+(.+?)\*\*\s*(.*)$/gm)];
  const roles = ["Anchor figure", "Mechanism figure", "Comparison and error figure"];
  return matches.slice(0, 3).map((match, index) => ({
    id: match[1].trim(),
    role: roles[index],
    title: cleanInline(match[2]).replace(/[.]$/, ""),
    description: [
      cleanInline(match[3]),
      `Mathematical mechanism: ${concept.mechanism}`,
      `Opening context: ${lesson.title}.`,
    ].filter(Boolean).join(" "),
  }));
}

function methodSteps(concept) {
  const candidates = [
    concept.method,
    concept.conditions,
    `Verify the result in a second representation and explain what it means in the original setting.`,
  ];
  return candidates.map((step, index) => `${index + 1}. ${cleanInline(step)}`);
}

function sourceList(sourceBody) {
  return firstParagraph(sourceBody)
    .split(/\s*;\s*/)
    .map(cleanInline)
    .filter(Boolean);
}

function textbookSections(sections) {
  const result = [];
  for (const section of sections) {
    if (section.heading === "Practice answers and guidance") continue;
    const specialKind = specialSectionKinds.get(section.heading);
    if (specialKind) {
      result.push({ kind: specialKind, heading: section.heading, blocks: [] });
      continue;
    }
    const blocks = markdownBlocks(section.body);
    if (blocks.length) result.push({ kind: "reading", heading: section.heading, blocks });
  }
  return result;
}

export async function loadPhaseBLessons(sourceDirectory) {
  const rawLessons = JSON.parse(await readFile(resolve(sourceDirectory, "data/lessons.json"), "utf8"));
  const concepts = JSON.parse(await readFile(resolve(sourceDirectory, "data/concept_notes.json"), "utf8"));
  return rawLessons.map((rawLesson) => {
    const concept = concepts[rawLesson.id];
    if (!concept) throw new Error(`Missing concept notes for ${rawLesson.id}.`);
    const sections = sectionMap(rawLesson.markdown);
    const byHeading = new Map(sections.map((section) => [section.heading, section.body]));
    const openingBody = byHeading.get("The problem that opens the lesson") ?? "";
    const workedBody = byHeading.get("Worked examples") ?? "";
    const visualBody = byHeading.get("Required visual sequence") ?? "";
    const sourceBody = byHeading.get("Source guidance") ?? "";
    const objective = rawLesson.markdown.match(/\*\*Learning objective\.\*\*\s*(.+)/)?.[1];
    const examples = parseExamples(openingBody, workedBody, concept);
    const practice = rawLesson.practice.map(([prompt, answer]) => ({ prompt: cleanInline(prompt), answer: cleanInline(answer) }));
    const figures = parseFigures(visualBody, rawLesson, concept);
    if (practice.length !== 10 || figures.length !== 3) {
      throw new Error(`${rawLesson.id} must contain ten practice items and three visual specifications.`);
    }
    return {
      unit: rawLesson.unit,
      id: rawLesson.id,
      title: rawLesson.title,
      outcome: cleanInline(objective ?? concept.definition),
      opening: [examples[0].problem, concept.application].map(cleanInline),
      prerequisites: [],
      exposition: [concept.definition, concept.development, concept.mechanism].map(cleanInline),
      guide: {
        application: cleanInline(concept.application),
        bigIdea: [concept.definition, concept.development].map(cleanInline),
        method: methodSteps(concept),
        questions: [
          `Which definition or geometric structure controls ${rawLesson.title.toLowerCase()}?`,
          "Which conditions or branch restrictions must remain visible?",
          "How can a second representation verify the conclusion?",
        ],
        verification: cleanInline(concept.conditions),
        foundationWalkthrough: {
          problem: examples[0].problem,
          plan: `${cleanInline(concept.method)} ${cleanInline(concept.conditions)}`,
          conclusion: examples[0].solution,
          check: examples[0].interpretation,
        },
      },
      commonMistake: cleanInline(concept.misconception),
      examples,
      figures,
      visualMechanism: cleanInline(concept.mechanism),
      checkpoint: practice[0],
      practice,
      close: cleanInline(concept.bridge),
      sources: sourceList(sourceBody),
      textbookSections: textbookSections(sections),
      preservePractice: true,
      sourcePackageDirectory: "source-package-phase-b",
      sourcePackageLessonPath: `units/${rawLesson.unit.toLowerCase()}_`,
    };
  });
}

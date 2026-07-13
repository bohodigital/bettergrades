import { beeQuestions, methodQuestions, readinessQuestions, type Question } from "../activities";
import type { AssessmentRecord, RegistryQuestion } from "./schema";

const methodTex = [
  String.raw`\int x e^x\,dx`, String.raw`\int 2x\cos(x^2)\,dx`, String.raw`\int \sin^2x\,dx`,
  String.raw`\int \frac{1}{x^2-1}\,dx`, String.raw`\int \sqrt{9-x^2}\,dx`, String.raw`\int \ln x\,dx`,
  String.raw`\int \frac{3x+2}{x^2+4x+5}\,dx`, String.raw`\int_0^\infty e^{-x}\,dx`,
  String.raw`\int \sec^3x\,dx`, String.raw`\int \frac{x}{x+1}\,dx`,
];

const beeTex = [
  String.raw`\int x^2\,dx`, String.raw`\int \cos x\,dx`, String.raw`\int e^{2x}\,dx`, String.raw`\int \frac1x\,dx`,
  String.raw`\int \sec^2x\,dx`, String.raw`\int 2x(x^2+1)^4\,dx`, String.raw`\int x\sin x\,dx`, String.raw`\int \tan x\,dx`,
  String.raw`\int_0^1 3x^2\,dx`, String.raw`\int \frac{1}{1+x^2}\,dx`, String.raw`\int \csc x\cot x\,dx`, String.raw`\int \ln x\,dx`,
  String.raw`\int \sin(3x)\,dx`, String.raw`\int \frac{x+1}{x^2+2x+4}\,dx`, String.raw`\int \sinh x\,dx`,
  String.raw`\int \frac{x}{\sqrt{x^2+4}}\,dx`, String.raw`\int_1^e \frac1x\,dx`, String.raw`\int \cos^2x\,dx`,
  String.raw`\int \frac{1}{x^2-1}\,dx`, String.raw`\int \sec^3x\,dx`,
];

function registerQuestions(prefix: string, questions: Question[], expressionTex: string[] = []): RegistryQuestion[] {
  return questions.map((question, index) => ({
    ...question,
    id: `${prefix}-${String(index + 1).padStart(2, "0")}`,
    expressionTex: expressionTex[index],
    topicIds: prefix === "readiness" ? ["topic-math-calculus-limits-continuity"] : ["topic-math-calculus-integration-techniques"],
    skillIds: [question.skill.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")],
    remediationResourceIds: prefix === "readiness" ? [] : ["resource-math-calculus-integration-techniques-integration-by-parts"],
  }));
}

const methodSet = registerQuestions("method", methodQuestions, methodTex);
const readinessSet = registerQuestions("readiness", readinessQuestions);
const beeSet = registerQuestions("bee", beeQuestions, beeTex);

export const assessments: AssessmentRecord[] = [
  {
    id: "assessment-math-calculus-method-selection",
    domainId: "domain-math-calculus",
    topicIds: ["topic-math-calculus-integration-techniques"],
    slug: "integration-method-selection",
    title: "Integration method selection",
    description: "Choose the best first move before the algebra begins.",
    kind: "quiz",
    path: "/practice/math/calculus/quizzes/integration-method-selection/",
    aliases: ["/practice/calculus/integration-method-selection/"],
    durationMinutes: 7,
    storageKey: "bg-practice-methods",
    questions: methodSet,
  },
  {
    id: "assessment-math-calculus-readiness",
    domainId: "domain-math-calculus",
    topicIds: ["topic-math-calculus-limits-continuity"],
    slug: "calculus-readiness",
    title: "Calculus readiness diagnostic",
    description: "Find algebra, functions, and trigonometry gaps before calculus makes them louder.",
    kind: "diagnostic",
    path: "/practice/math/calculus/diagnostics/calculus-readiness/",
    aliases: ["/exams/calculus-readiness/"],
    durationMinutes: 8,
    storageKey: "bg-exam-readiness",
    questions: readinessSet,
  },
  {
    id: "assessment-math-calculus-foundations-exam",
    domainId: "domain-math-calculus",
    topicIds: ["topic-math-calculus-limits-continuity", "topic-math-calculus-integration-techniques"],
    slug: "calculus-foundations",
    title: "Calculus foundations practice exam",
    description: "A mixed, no-account practice exam covering prerequisites and integration-method recognition.",
    kind: "practice-exam",
    path: "/practice/math/calculus/exams/calculus-foundations/",
    aliases: [],
    durationMinutes: 25,
    storageKey: "bg-practice-exam-foundations",
    questions: [...readinessSet, ...methodSet],
  },
  {
    id: "assessment-math-calculus-integration-bee",
    domainId: "domain-math-calculus",
    topicIds: ["topic-math-calculus-integration-techniques"],
    slug: "integration-bee",
    title: "Integration Bee",
    description: "Twenty reviewed integrals in timed or untimed mode, with explanations after each answer.",
    kind: "challenge",
    path: "/practice/math/calculus/challenges/integration-bee/",
    aliases: ["/bee/"],
    durationMinutes: 15,
    storageKey: "bg-bee-round",
    questions: beeSet,
  },
];

export const getAssessment = (id: string) => assessments.find((assessment) => assessment.id === id);

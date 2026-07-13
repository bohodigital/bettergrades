import { domains, resources, subjects, tools, topics } from "./catalog";
import { assessments } from "./practice";
import { allLibraryArticles } from "../course-library";
import { validateMathGlossary, validateMathNotation } from "../glossary/math/registry.mjs";
import { publicRoutes, redirects, registryRoutes } from "./routing";

export function validateRegistry() {
  const errors: string[] = [];
  errors.push(...validateMathGlossary().map((error) => `Math glossary: ${error}`));
  const ids = [...subjects, ...domains, ...topics, ...resources, ...assessments, ...tools].map((item) => item.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) errors.push(`Duplicate ids: ${Array.from(new Set(duplicateIds)).join(", ")}`);
  const registeredPaths = registryRoutes.map((route) => route.path);
  const duplicatePaths = registeredPaths.filter((path, index) => registeredPaths.indexOf(path) !== index);
  if (duplicatePaths.length) errors.push(`Duplicate paths: ${Array.from(new Set(duplicatePaths)).join(", ")}`);
  for (const topic of topics) if (!domains.some((domain) => domain.id === topic.domainId)) errors.push(`Missing domain for ${topic.id}`);
  for (const resource of resources) {
    if (!topics.some((topic) => topic.id === resource.topicId)) errors.push(`Missing topic for ${resource.id}`);
    if (!Number.isInteger(resource.sequence) || resource.sequence < 1) errors.push(`Invalid sequence for ${resource.id}`);
    if (!resource.reviewed.trim()) errors.push(`Missing review date for ${resource.id}`);
    if (resource.searchTerms.some((term) => !term.trim())) errors.push(`Blank search term for ${resource.id}`);
    resource.relatedToolIds.forEach((id) => { if (!tools.some((tool) => tool.id === id)) errors.push(`Missing related tool ${id} for ${resource.id}`); });
    resource.relatedAssessmentIds.forEach((id) => { if (!assessments.some((assessment) => assessment.id === id)) errors.push(`Missing related assessment ${id} for ${resource.id}`); });
  }
  for (const topic of topics) {
    const topicResources = resources.filter((resource) => resource.topicId === topic.id);
    if (!topicResources.length) errors.push(`No resources for ${topic.id}`);
    const sequences = topicResources.map((resource) => resource.sequence);
    const duplicateSequences = sequences.filter((sequence, index) => sequences.indexOf(sequence) !== index);
    if (duplicateSequences.length) errors.push(`Duplicate resource sequence in ${topic.id}`);
  }
  for (const article of allLibraryArticles) {
    if (!article.formula && !article.immediate?.tex) errors.push(`Missing lead TeX for ${article.domainSlug}/${article.slug}`);
    if (!resources.some((resource) => resource.slug === article.slug && resource.topicId === `topic-math-${article.domainSlug}-${article.topicSlug}`)) errors.push(`Missing registry resource for ${article.domainSlug}/${article.slug}`);
    article.related.forEach((slug) => { if (!allLibraryArticles.some((candidate) => candidate.domainSlug === article.domainSlug && candidate.slug === slug)) errors.push(`Missing related article ${article.domainSlug}/${slug}`); });
    const notation = validateMathNotation(article.document.source);
    if (notation.unknownCommands.length) errors.push(`Undocumented LaTeX commands for ${article.domainSlug}/${article.slug}: ${notation.unknownCommands.map((command) => `\\${command}`).join(", ")}`);
    if (notation.undocumentedUppercase.length) errors.push(`Undocumented uppercase variables for ${article.domainSlug}/${article.slug}: ${notation.undocumentedUppercase.join(", ")}`);
  }
  for (const tool of tools) if (!domains.some((domain) => domain.id === tool.domainId)) errors.push(`Missing domain for ${tool.id}`);
  for (const assessment of assessments) {
    if (!domains.some((domain) => domain.id === assessment.domainId)) errors.push(`Missing domain for ${assessment.id}`);
    if (!assessment.questions.length) errors.push(`No questions for ${assessment.id}`);
    assessment.topicIds.forEach((id) => { if (!topics.some((topic) => topic.id === id)) errors.push(`Missing assessment topic ${id}`); });
    assessment.questions.forEach((question) => {
      if (question.answer < 0 || question.answer >= question.choices.length) errors.push(`Invalid answer index for ${question.id}`);
      if (question.expression && !question.expressionTex) errors.push(`Missing TeX for visible expression ${question.id}`);
      question.remediationResourceIds.forEach((id) => { if (!resources.some((resource) => resource.id === id)) errors.push(`Missing remediation resource ${id}`); });
    });
  }
  const redirectSources = redirects.map((redirect) => redirect.from);
  const duplicateRedirects = redirectSources.filter((path, index) => redirectSources.indexOf(path) !== index);
  if (duplicateRedirects.length) errors.push(`Duplicate redirects: ${Array.from(new Set(duplicateRedirects)).join(", ")}`);
  for (const redirect of redirects) if (!publicRoutes.includes(redirect.to)) errors.push(`Redirect target is not public: ${redirect.to}`);
  return errors;
}

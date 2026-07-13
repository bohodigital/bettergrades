import { domains, resources, subjects, tools, topics } from "./catalog";
import { assessments } from "./practice";
import { publicRoutes, redirects } from "./routing";

export function validateRegistry() {
  const errors: string[] = [];
  const ids = [...subjects, ...domains, ...topics, ...resources, ...assessments, ...tools].map((item) => item.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) errors.push(`Duplicate ids: ${Array.from(new Set(duplicateIds)).join(", ")}`);
  const duplicatePaths = publicRoutes.filter((path, index) => publicRoutes.indexOf(path) !== index);
  if (duplicatePaths.length) errors.push(`Duplicate paths: ${Array.from(new Set(duplicatePaths)).join(", ")}`);
  for (const topic of topics) if (!domains.some((domain) => domain.id === topic.domainId)) errors.push(`Missing domain for ${topic.id}`);
  for (const resource of resources) if (!topics.some((topic) => topic.id === resource.topicId)) errors.push(`Missing topic for ${resource.id}`);
  for (const article of allLibraryArticles) {
    if (!article.formula && !article.immediate?.tex) errors.push(`Missing lead TeX for ${article.domainSlug}/${article.slug}`);
    article.related.forEach((slug) => { if (!allLibraryArticles.some((candidate) => candidate.domainSlug === article.domainSlug && candidate.slug === slug)) errors.push(`Missing related article ${article.domainSlug}/${slug}`); });
  }
  for (const assessment of assessments) {
    if (!domains.some((domain) => domain.id === assessment.domainId)) errors.push(`Missing domain for ${assessment.id}`);
    if (!assessment.questions.length) errors.push(`No questions for ${assessment.id}`);
    assessment.questions.forEach((question) => {
      if (question.answer < 0 || question.answer >= question.choices.length) errors.push(`Invalid answer index for ${question.id}`);
      if (question.expression && !question.expressionTex) errors.push(`Missing TeX for visible expression ${question.id}`);
      question.remediationResourceIds.forEach((id) => { if (!resources.some((resource) => resource.id === id)) errors.push(`Missing remediation resource ${id}`); });
    });
  }
  for (const redirect of redirects) if (!publicRoutes.includes(redirect.to)) errors.push(`Redirect target is not public: ${redirect.to}`);
  return errors;
}
import { allLibraryArticles } from "../course-library";

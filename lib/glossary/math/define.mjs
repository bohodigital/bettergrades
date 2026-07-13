export function defineMathTerm({
  id,
  term,
  categoryId,
  shortDefinition,
  definition,
  tex,
  visuals,
  aliases = [],
  keywords = [],
  externalLinks = [],
}) {
  const resolvedVisuals = visuals ?? (tex ? [{ tex, label: term }] : []);
  return Object.freeze({
    id,
    term,
    categoryId,
    shortDefinition,
    definition: definition ?? shortDefinition,
    aliases: Object.freeze(aliases),
    keywords: Object.freeze(keywords),
    visuals: Object.freeze(resolvedVisuals.map((visual) => Object.freeze(visual))),
    externalLinks: Object.freeze(externalLinks.map((link) => Object.freeze(link))),
  });
}

export const t = (id, term, categoryId, shortDefinition, tex, definition = shortDefinition, aliases = [], keywords = []) =>
  defineMathTerm({ id, term, categoryId, shortDefinition, definition, tex, aliases, keywords });

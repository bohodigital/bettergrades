export function semanticToken(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function conceptId(value: string) {
  const token = semanticToken(value);
  return token && token !== "general" ? `concept.math.${token}` : null;
}

export function skillId(value: string) {
  const token = semanticToken(value);
  return token ? `skill.math.${token}` : null;
}

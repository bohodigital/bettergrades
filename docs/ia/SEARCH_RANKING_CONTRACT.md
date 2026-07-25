# BetterGrades search ranking contract

Ranking precedence is exact normalized title, exact short title, exact registered alias, exact former path, exact canonical fragment, exact primary concept, exact skill, strong title tokens, topic/course, then description text.

Normalization folds case, whitespace, hyphens and dashes, apostrophes, diacritics, and common mathematical punctuation. Body/description matches cannot outrank exact titles.

Every result shows its precise page-role label. Canonical path fragments and slugs are searchable. Redirect sources may be aliases, but results link only to canonical destinations.

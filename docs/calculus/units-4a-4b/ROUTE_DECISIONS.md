# Unit 4 route and collision decisions

## Unit 4A canonical root

Unit 4A owns `/subjects/math/calculus/sequences-and-series/` and the 33 declared child routes in `content/calculus/units/unit-4a/routes.public.json`. No numeric or improvised suffixes were introduced.

## Unit 4B canonical root

Unit 4B owns `/subjects/math/calculus/power-series-and-taylor-series/` and the 30 declared child routes in `content/calculus/units/unit-4b/routes.public.json`. It is a separate unit and does not reuse or replace the Unit 4A root.

## Legacy collision matrix

| Existing route | Decision | Canonical destination or reason |
| --- | --- | --- |
| `/subjects/math/calculus/sequences-series/` | Redirect after Unit 4A release | Unit 4A is the complete Chapter 4A course map. |
| `/subjects/math/calculus/sequences-series/geometric-series/` | Merge intent and redirect | The Unit 4A geometric-series lesson is the stronger complete treatment. |
| `/subjects/math/calculus/sequences-series/choosing-convergence-test/` | Merge intent and redirect | The Unit 4A test-selection lesson is the canonical decision guide. |
| `/subjects/math/calculus/sequences-series/harmonic-series-diverges/` | Retain | Distinct focused explanation supporting the broader Unit 4A harmonic and p-series lesson. |
| `/subjects/math/calculus/sequences-series/ratio-test-vs-root-test/` | Retain | Distinct focused comparison supporting the separate Unit 4A ratio and root lessons. |
| `/subjects/math/calculus/sequences-series/power-series-interval-of-convergence/` | Merge intent and redirect with Unit 4B | `/subjects/math/calculus/power-series-and-taylor-series/radius-and-interval-of-convergence/` is the complete canonical treatment. |
| `/subjects/math/calculus/sequences-series/taylor-series-remainder/` | Merge intent and redirect with Unit 4B | `/subjects/math/calculus/power-series-and-taylor-series/taylor-remainder-theorem/` is the complete canonical treatment. |

Superseded routes are removed from the public registry and search index and receive permanent redirects. Distinct retained deep dives remain public and indexable.

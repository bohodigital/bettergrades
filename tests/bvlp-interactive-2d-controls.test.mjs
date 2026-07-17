import assert from "node:assert/strict";
import test from "node:test";

import {
  initialControlState,
  normalizeRangeValue,
  sliderValueForKey,
  stepIndexForKey,
} from "../lib/visualization/renderers/bg-interactive-2d/controls.ts";

test("range values snap deterministically and never leave authored bounds", () => {
  assert.equal(normalizeRangeValue(0.749, 0.1, 1.5, 0.05), 0.75);
  assert.equal(normalizeRangeValue(-9, 0.1, 1.5, 0.05), 0.1);
  assert.equal(normalizeRangeValue(9, 0.1, 1.5, 0.05), 1.5);
  assert.throws(() => normalizeRangeValue(1, 2, 1, 0.1), /ordered/);
});

test("slider keyboard commands implement arrows, pages, home, and end", () => {
  const range = { min: 0.1, max: 1.5, step: 0.05 };
  assert.equal(sliderValueForKey(0.75, "ArrowRight", range), 0.8);
  assert.equal(sliderValueForKey(0.75, "ArrowDown", range), 0.7);
  assert.equal(sliderValueForKey(0.75, "PageUp", range), 1.25);
  assert.equal(sliderValueForKey(0.75, "Home", range), 0.1);
  assert.equal(sliderValueForKey(0.75, "End", range), 1.5);
  assert.equal(sliderValueForKey(1.5, "ArrowRight", range), 1.5);
  assert.equal(sliderValueForKey(0.75, "Escape", range), 0.75);
});

test("step controls remain on discrete nonzero values", () => {
  assert.equal(stepIndexForKey(2, "ArrowRight", 4), 3);
  assert.equal(stepIndexForKey(0, "ArrowLeft", 4), 0);
  assert.equal(stepIndexForKey(2, "Home", 4), 0);
  assert.equal(stepIndexForKey(2, "End", 4), 4);
  const state = initialControlState({ controls: [{
    id: "h-control",
    kind: "step-control",
    label: { segments: [{ kind: "text", text: "h" }] },
    announcementTemplate: "h is {value}",
    parameter: "h",
    values: [-0.5, -0.1, 0.1, 0.2],
    initialIndex: 3,
  }] });
  assert.equal(state.h, 0.2);
  assert.equal(Object.isFrozen(state), true);
});


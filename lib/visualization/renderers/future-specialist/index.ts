export const RESERVED_SPECIALIST_CAPABILITIES = Object.freeze([
  "surface-3d",
  "vector-field-3d",
  "molecular-3d",
  "camera-3d",
  "mesh-3d",
] as const);

export type ReservedSpecialistCapability = typeof RESERVED_SPECIALIST_CAPABILITIES[number];

export class UnsupportedSpecialistRendererError extends Error {
  readonly code = "unsupported-3d";
  readonly capability: string;

  constructor(capability: string, visualId: string) {
    super(
      `Visual ${visualId} requires ${capability}, but BetterGrades VisualSpec v1 has no installed 3D or specialist renderer. ` +
      "Authoring and delivery fail closed until a separately reviewed adapter, accessible static projection, budgets, and rollback are approved.",
    );
    this.name = "UnsupportedSpecialistRendererError";
    this.capability = capability;
  }
}

export const FUTURE_SPECIALIST_CONTRACT = Object.freeze({
  status: "reserved-not-installed" as const,
  activation: "explicit-user-action" as const,
  capabilities: RESERVED_SPECIALIST_CAPABILITIES,
  heavyDependencies: Object.freeze([]),
  requiresAccessibleStaticProjection: true,
  requiresIndependentApproval: true,
  productionVersion: null,
});

/** The v1 boundary is intentionally non-loadable and has no vendor dependency. */
export function requestFutureSpecialistAdapter(
  capability: string,
  visualId: string,
): never {
  throw new UnsupportedSpecialistRendererError(capability, visualId);
}

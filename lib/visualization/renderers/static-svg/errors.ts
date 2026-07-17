export class StaticSvgRenderError extends Error {
  readonly code: string;
  readonly sceneId?: string;
  readonly layerId?: string;

  constructor(code: string, message: string, sceneId?: string, layerId?: string) {
    super(message);
    this.name = "StaticSvgRenderError";
    this.code = code;
    this.sceneId = sceneId;
    this.layerId = layerId;
  }
}

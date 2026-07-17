# Future 3D boundary

BVLP v1 reserves, but does not implement, `surface-3d`, `vector-field-3d`, and
`molecular-3d`, plus camera, lighting, mesh, 3D axes, 3D accessibility summaries,
and static projection/image fallback concepts.

No production 3D library, public 3D fixture, runtime CDN, new Cloudflare service,
or silent 2D downgrade is allowed. A production 3D request must fail with the
visual ID, source location, required capability, statement that no adapter is
installed, and guidance to follow [Adding a renderer](ADDING_A_RENDERER.md).

A future approved project must decide data/mesh limits, camera and keyboard
semantics, reduced motion, nonvisual equivalent, deterministic fallback and
print, WebGL failure/recovery, bundle isolation, device support, security,
licensing, and replacement lifecycle before package installation.

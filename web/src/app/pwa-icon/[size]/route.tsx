import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const dynamic = "force-static";

function IconMark({ size, maskable }: { size: number; maskable: boolean }) {
  // Maskable icons need a "safe zone": keep the glyph inside the inner ~66%
  // so Android's adaptive-icon mask doesn't crop it.
  const glyphBox = maskable ? Math.round(size * 0.66) : size;
  const radius = maskable ? 0 : Math.round(size * 0.22);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#6C5CE7",
        borderRadius: radius,
      }}
    >
      <span
        style={{
          fontSize: Math.round(glyphBox * 0.56),
          fontWeight: 600,
          color: "#FFFFFF",
        }}
      >
        N
      </span>
    </div>
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size: sizeParam } = await params;
  const size = Number.parseInt(sizeParam, 10) || 512;
  const maskable = request.nextUrl.searchParams.get("maskable") === "1";

  return new ImageResponse(<IconMark size={size} maskable={maskable} />, {
    width: size,
    height: size,
  });
}

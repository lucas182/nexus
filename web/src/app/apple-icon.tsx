import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6C5CE7",
          color: "#FFFFFF",
          fontSize: 100,
          fontWeight: 600,
        }}
      >
        N
      </div>
    ),
    { ...size },
  );
}

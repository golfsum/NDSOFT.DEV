import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0d12",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 220,
            height: 220,
            display: "flex",
            border: "8px solid #f2ebdd",
            transform: "rotate(45deg)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -28,
              right: -28,
              width: 56,
              height: 56,
              display: "flex",
              background: "#ff5a47",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}

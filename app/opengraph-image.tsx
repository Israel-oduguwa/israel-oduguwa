import { ImageResponse } from "next/og";

export const alt = "Israel Oduguwa — Senior Full Stack Software Engineer";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#f8fafc",
        color: "#0f172a",
        display: "flex",
        height: "100%",
        justifyContent: "space-between",
        overflow: "hidden",
        padding: "72px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#2563eb",
          borderRadius: "999px",
          height: 360,
          opacity: 0.18,
          position: "absolute",
          right: -80,
          top: -120,
          width: 360,
        }}
      />
      <div
        style={{
          background: "#6366f1",
          borderRadius: "999px",
          bottom: -160,
          height: 420,
          left: -120,
          opacity: 0.12,
          position: "absolute",
          width: 420,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
          maxWidth: 760,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 44,
            fontWeight: 900,
            letterSpacing: -2,
          }}
        >
          IO<span style={{ color: "#2563eb" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 0.95,
            }}
          >
            Israel Oduguwa
          </div>
          <div
            style={{
              color: "#334155",
              fontSize: 34,
              fontWeight: 600,
              lineHeight: 1.25,
            }}
          >
            Senior Full Stack Software Engineer. Reliable products, payment
            systems and applied AI.
          </div>
        </div>
      </div>
      <div
        style={{
          alignItems: "center",
          background: "#0f172a",
          borderRadius: 36,
          color: "white",
          display: "flex",
          fontSize: 30,
          fontWeight: 700,
          justifyContent: "center",
          padding: "26px 32px",
        }}
      >
        Product · Systems · AI
      </div>
    </div>,
    size,
  );
}

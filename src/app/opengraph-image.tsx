import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #F1F5EE 0%, #FBF9F5 55%, #F6DEE1 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 36,
            fontWeight: 600,
            color: "#5B7A52",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 28,
              background: "#5B7A52",
            }}
          />
          {SITE_CONFIG.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 64,
            fontWeight: 700,
            color: "#2E2C2A",
            maxWidth: 900,
          }}
        >
          Ibu Sehat, Bayi Bahagia
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 28,
            color: "#6E6A62",
            maxWidth: 800,
          }}
        >
          Platform edukasi dan pemantauan ibu nifas
        </div>
      </div>
    ),
    { ...size }
  );
}

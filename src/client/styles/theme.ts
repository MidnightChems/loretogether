// src/styles/theme.ts

export const theme = {
  bg: "#0f0f0f",
  card: "#1a1a1b",
  subtle: "#aaaaaa",
  text: "#f5f5f5",
  border: "#2c2c2c",
  accent: "#ff4500",
  accentHover: "#ff6326",
};

export const wrap: React.CSSProperties = {
  minHeight: "100vh",
  background: theme.bg,
  color: theme.text,
  display: "flex",
  justifyContent: "center",
  padding: "24px",
  fontFamily: "Inter, system-ui, Arial, sans-serif",
};

export const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 720,
  background: theme.card,
  border: `1px solid ${theme.border}`,
  borderRadius: 12,
  boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
  padding: 20,
};

export const hdr: React.CSSProperties = {
  textAlign: "center",
  paddingBottom: 12,
  marginBottom: 16,
  borderBottom: `1px solid ${theme.border}`,
};

export const storyText: React.CSSProperties = {
  lineHeight: 1.65,
  fontSize: "1.125rem",
  minHeight: 120,
  marginBottom: 16,
};

export const navRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 24,
};

export const circleBtn = (disabled?: boolean): React.CSSProperties => ({
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: `1px solid ${theme.border}`,
  background: disabled ? "#2a2a2a" : theme.accent,
  color: disabled ? "#666" : "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: 18,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 120ms ease",
});

export const choiceBtn = (active: boolean): React.CSSProperties => ({
  width: "100%",
  textAlign: "left",
  padding: "10px 12px",
  borderRadius: 8,
  border: `1px solid ${active ? theme.accent : theme.border}`,
  background: active ? "rgba(255,69,0,0.15)" : "#1c1c1e",
  color: theme.text,
  cursor: "pointer",
  marginTop: 8,
});

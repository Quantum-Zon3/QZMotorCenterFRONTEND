const readEnv = (key: string, fallback: string) => {
  const value = import.meta.env[key];
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
};

export const env = {
  appName: readEnv("VITE_APP_NAME", "QZ Motor Center"),
  publicSiteUrl: readEnv("VITE_PUBLIC_SITE_URL", "http://localhost:5173"),
  apiGatewayUrl: readEnv("VITE_API_GATEWAY_URL", "https://qz-gateway.onrender.com"),
} as const;


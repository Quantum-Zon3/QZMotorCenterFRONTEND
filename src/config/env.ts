const readEnv = (key: string, fallback: string) => {
  const value = import.meta.env[key];
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
};

export const env = {
  appName: readEnv("VITE_APP_NAME", "QZ Motor Center"),
  publicSiteUrl: readEnv("VITE_PUBLIC_SITE_URL", "http://localhost:5173"),
  authApiUrl: readEnv("VITE_AUTH_API_URL", "http://localhost:8081"),
  carsApiUrl: readEnv("VITE_CARS_API_URL", "http://localhost:3001"),
  motorcyclesApiUrl: readEnv("VITE_MOTORCYCLES_API_URL", "http://localhost:5000"),
  electroBikesApiUrl: readEnv("VITE_ELECTROBIKES_API_URL", "http://localhost:3002"),
  scootersApiUrl: readEnv("VITE_SCOOTERS_API_URL", "http://localhost:3003"),
  reportsApiUrl: readEnv("VITE_REPORTS_API_URL", "http://localhost:8080"),
  aiApiUrl: readEnv("VITE_AI_API_URL", "http://localhost:8000"),
  serverlessApiUrl: readEnv("VITE_SERVERLESS_API_URL", "http://localhost:3004"),
} as const;


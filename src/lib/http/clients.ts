import { env } from "../../config/env";
import { createServiceClient } from "./create-service-client";

export const authClient = createServiceClient(env.authApiUrl, { withAuth: false });
export const authProtectedClient = createServiceClient(env.authApiUrl);
export const carsClient = createServiceClient(env.carsApiUrl);
export const motorcyclesClient = createServiceClient(env.motorcyclesApiUrl);
export const electroBikesClient = createServiceClient(env.electroBikesApiUrl);
export const scootersClient = createServiceClient(env.scootersApiUrl);
export const reportsClient = createServiceClient(env.reportsApiUrl);
export const aiClient = createServiceClient(env.aiApiUrl);
export const serverlessClient = createServiceClient(env.serverlessApiUrl);

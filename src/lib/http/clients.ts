import { env } from "../../config/env";
import { createServiceClient } from "./create-service-client";

export const authClient = createServiceClient(env.apiGatewayUrl, { withAuth: false });
export const authProtectedClient = createServiceClient(env.apiGatewayUrl);
export const carsClient = createServiceClient(env.apiGatewayUrl);
export const motorcyclesClient = createServiceClient(env.apiGatewayUrl);
export const electroBikesClient = createServiceClient(env.apiGatewayUrl);
export const scootersClient = createServiceClient(env.apiGatewayUrl);
export const reportsClient = createServiceClient(env.apiGatewayUrl);
export const aiClient = createServiceClient(env.apiGatewayUrl);
export const serverlessClient = createServiceClient(env.apiGatewayUrl);

import { parameterRegistry } from "../parameters/index.js";
import { resolveService } from "../schema.js";
import { airInletServiceConfig } from "./air-inlet.js";

const serviceRegistry = Object.freeze({
  [airInletServiceConfig.id]: resolveService(airInletServiceConfig, parameterRegistry),
});

export function getService(serviceId) {
  const service = serviceRegistry[serviceId];
  if (!service) throw new RangeError(`Unknown service: ${serviceId}`);
  return service;
}

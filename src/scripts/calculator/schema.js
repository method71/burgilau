function assertNonEmptyString(value, path) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`${path} must be a non-empty string`);
  }
}

function resolveParameter(usage, registry, serviceId) {
  const definition = registry[usage.parameterId];
  const path = `Service ${serviceId} parameter ${usage.parameterId}`;

  if (!definition) throw new RangeError(`${path} is not registered`);

  const optionIds = usage.optionIds ?? definition.options.map(({ id }) => id);
  const options = optionIds.map((optionId) => {
    const option = definition.options.find(({ id }) => id === optionId);
    if (!option) throw new RangeError(`${path} has unknown option: ${optionId}`);

    const priceModifier = usage.modifiers[optionId];
    if (!Number.isFinite(priceModifier)) {
      throw new TypeError(`${path} option ${optionId} must have a numeric modifier`);
    }

    return Object.freeze({ ...option, priceModifier });
  });

  if (!options.some(({ id }) => id === usage.defaultOptionId)) {
    throw new RangeError(`${path} has unknown default option: ${usage.defaultOptionId}`);
  }

  return Object.freeze({
    id: definition.id,
    label: usage.label ?? definition.label,
    defaultOptionId: usage.defaultOptionId,
    options: Object.freeze(options),
  });
}

export function resolveService(serviceConfig, registry) {
  assertNonEmptyString(serviceConfig.id, "Service id");
  assertNonEmptyString(serviceConfig.title, `Service ${serviceConfig.id} title`);
  assertNonEmptyString(serviceConfig.whatsappIntro, `Service ${serviceConfig.id} WhatsApp intro`);
  if (!Number.isFinite(serviceConfig.basePrice)) {
    throw new TypeError(`Service ${serviceConfig.id} base price must be numeric`);
  }

  const parameterIds = serviceConfig.parameters.map(({ parameterId }) => parameterId);
  if (new Set(parameterIds).size !== parameterIds.length) {
    throw new RangeError(`Service ${serviceConfig.id} contains duplicate parameters`);
  }

  return Object.freeze({
    id: serviceConfig.id,
    title: serviceConfig.title,
    whatsappIntro: serviceConfig.whatsappIntro,
    basePrice: serviceConfig.basePrice,
    parameters: Object.freeze(
      serviceConfig.parameters.map((usage) => resolveParameter(usage, registry, serviceConfig.id)),
    ),
  });
}

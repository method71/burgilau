export function calculatePrice(service, selections) {
  return service.parameters.reduce((total, parameter) => {
    const selection = selections[parameter.id];
    const option = parameter.options.find(({ id }) => id === selection);

    if (!option) throw new RangeError(`Unknown ${parameter.id} option: ${selection}`);

    return total + option.priceModifier;
  }, service.basePrice);
}

export function describeSelections(service, selections) {
  return service.parameters.map((parameter) => {
    const option = parameter.options.find(({ id }) => id === selections[parameter.id]);
    if (!option)
      throw new RangeError(`Unknown ${parameter.id} option: ${selections[parameter.id]}`);
    return Object.freeze({ label: parameter.label, value: option.label });
  });
}

export function formatPrice(amount, { locale, prefix, suffix }) {
  const formattedAmount = amount.toLocaleString(locale);
  return `${prefix} ${formattedAmount} ${suffix}`;
}

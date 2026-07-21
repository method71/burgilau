export function calculatePrice(config, selections) {
  return Object.entries(config.modifiers).reduce((total, [group, prices]) => {
    const selection = selections[group];

    if (!Object.hasOwn(prices, selection)) {
      throw new RangeError(`Unknown ${group} option: ${selection}`);
    }

    return total + prices[selection];
  }, config.base);
}

export function formatPrice(amount, { locale, prefix, suffix }) {
  const formattedAmount = amount.toLocaleString(locale);
  return `${prefix} ${formattedAmount} ${suffix}`;
}

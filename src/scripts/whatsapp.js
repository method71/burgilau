export function createWhatsAppMessage({ intro, selections, formattedPrice }) {
  return [
    intro,
    "",
    ...selections.map(({ label, value }) => `${label}: ${value}`),
    `Предварительная стоимость: ${formattedPrice}`,
  ].join("\n");
}

export function createWhatsAppUrl({ phone, message }) {
  const params = new URLSearchParams({ phone, text: message });
  return `https://api.whatsapp.com/send?${params}`;
}

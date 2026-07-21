export function createWhatsAppMessage({ material, thickness, formattedPrice }) {
  return [
    "Здравствуйте! Хочу заказать установку приточного клапана.",
    "",
    `Материал стены: ${material}`,
    `Толщина стены: ${thickness}`,
    `Предварительная стоимость: ${formattedPrice}`,
  ].join("\n");
}

export function createWhatsAppUrl({ phone, message }) {
  const params = new URLSearchParams({ phone, text: message });
  return `https://api.whatsapp.com/send?${params}`;
}

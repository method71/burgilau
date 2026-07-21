import { calculatePrice, formatPrice } from "./calculator.js";
import { contactConfig, priceConfig, priceFormatConfig } from "./config.js";
import { createCalculatorUi, initCompanyCard, initHeroSlider } from "./ui.js";
import { createWhatsAppMessage, createWhatsAppUrl } from "./whatsapp.js";

const calculatorUi = createCalculatorUi();

function updateCalculator() {
  const { selections, labels } = calculatorUi.readState();
  const total = calculatePrice(priceConfig, selections);
  const formattedPrice = formatPrice(total, priceFormatConfig);
  const message = createWhatsAppMessage({
    material: labels.material,
    thickness: labels.thickness,
    formattedPrice,
  });
  const whatsappUrl = createWhatsAppUrl({
    phone: contactConfig.whatsappPhone,
    message,
  });

  calculatorUi.render({ formattedPrice, whatsappUrl });
}

calculatorUi.onChange(updateCalculator);
updateCalculator();
initCompanyCard();
initHeroSlider();

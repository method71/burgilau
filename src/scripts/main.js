import { calculatePrice, describeSelections, formatPrice } from "./calculator.js";
import { createCalculatorUi } from "./calculator-ui.js";
import { getService } from "./calculator/services/index.js";
import { contactConfig, priceFormatConfig } from "./config.js";
import { initCompanyCard, initHeroSlider } from "./ui.js";
import { createWhatsAppMessage, createWhatsAppUrl } from "./whatsapp.js";

export function initCalculator(root, index) {
  const service = getService(root.dataset.serviceId);
  const instanceId = `${root.id || service.id}-${index + 1}`;
  const calculatorUi = createCalculatorUi(root, service, instanceId);

  function updateCalculator() {
    const selections = calculatorUi.readSelections();
    const total = calculatePrice(service, selections);
    const formattedPrice = formatPrice(total, priceFormatConfig);
    const message = createWhatsAppMessage({
      intro: service.whatsappIntro,
      selections: describeSelections(service, selections),
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
}

document.querySelectorAll("[data-calculator]").forEach(initCalculator);
initCompanyCard();
initHeroSlider();

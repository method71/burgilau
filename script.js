const priceElement = document.getElementById("price");
  const whatsappLink = document.getElementById("whatsapp");

  document.querySelectorAll('input[id$="-unknown"]').forEach(input => {
    input.closest(".option")?.remove();
  });

  function selectedValue(name) {
    const input = document.querySelector(`input[name="${name}"]:checked`);
    return input ? Number(input.value) : 0;
  }

  function selectedText(name) {
    const input = document.querySelector(`input[name="${name}"]:checked`);
    if (!input) return "";
    const label = document.querySelector(`label[for="${input.id}"]`);
    return label ? label.firstElementChild?.textContent.trim() || label.textContent.trim() : "";
  }

  function updateCalculator() {
    const total =
      35000 +
      selectedValue("material") +
      selectedValue("thickness");

    const formatted = total.toLocaleString("ru-RU");
    priceElement.textContent = `от ${formatted} ₸`;

    const material = selectedText("material");
    const thickness = selectedText("thickness");

    const message =
      `Здравствуйте! Хочу заказать установку приточного клапана.%0A%0A` +
      `Материал стены: ${encodeURIComponent(material)}%0A` +
      `Толщина стены: ${encodeURIComponent(thickness)}%0A` +
      `Предварительная стоимость: от ${formatted} ₸`;

    whatsappLink.href = `https://api.whatsapp.com/send?phone=77788833329&text=${message}`;
  }

  document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener("change", updateCalculator);
  });

  updateCalculator();

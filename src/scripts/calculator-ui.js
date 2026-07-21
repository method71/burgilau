const checkIconPath =
  "M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z";

function createCheckIcon() {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  icon.classList.add("option-card__check");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  path.setAttribute("d", checkIconPath);
  icon.append(path);
  return icon;
}

function createOptionCard(instanceId, parameter, option) {
  const card = document.createElement("div");
  const input = document.createElement("input");
  const label = document.createElement("label");
  const icon = document.createElement("img");
  const text = document.createElement("span");
  const inputId = `${instanceId}-${parameter.id}-${option.id}`;

  card.className = "option-card";
  input.type = "radio";
  input.name = `${instanceId}-${parameter.id}`;
  input.id = inputId;
  input.value = option.id;
  input.checked = option.id === parameter.defaultOptionId;
  input.dataset.calcInput = "";
  input.dataset.parameterId = parameter.id;

  label.htmlFor = inputId;
  icon.className = "option-card__icon";
  icon.src = option.icon;
  icon.alt = "";
  icon.width = 72;
  icon.height = 72;
  icon.loading = "lazy";
  icon.decoding = "async";
  text.dataset.optionLabel = "";
  text.textContent = option.label;

  label.append(icon, text, createCheckIcon());
  card.append(input, label);
  return card;
}

function createParameterField(instanceId, parameter) {
  const field = document.createElement("div");
  const title = document.createElement("span");
  const options = document.createElement("div");
  const titleId = `${instanceId}-${parameter.id}-label`;

  field.className = "calc__field";
  field.setAttribute("role", "group");
  field.setAttribute("aria-labelledby", titleId);
  title.className = "calc__field-title";
  title.id = titleId;
  title.textContent = parameter.label;
  options.className = "calc__options";
  parameter.options.forEach((option) => {
    options.append(createOptionCard(instanceId, parameter, option));
  });

  field.append(title, options);
  return field;
}

export function createCalculatorUi(root, service, instanceId) {
  const fields = root.querySelector("[data-calculator-fields]");
  const priceElement = root.querySelector("[data-price]");
  const whatsappLink = root.querySelector("[data-whatsapp]");

  if (!fields || !priceElement || !whatsappLink) {
    throw new Error(`Calculator ${service.id} has an incomplete DOM contract`);
  }

  fields.replaceChildren(
    ...service.parameters.map((parameter) => createParameterField(instanceId, parameter)),
  );
  const inputs = [...fields.querySelectorAll("[data-calc-input]")];

  function readSelections() {
    return Object.fromEntries(
      service.parameters.map((parameter) => {
        const input = inputs.find(
          (candidate) => candidate.dataset.parameterId === parameter.id && candidate.checked,
        );
        return [parameter.id, input?.value ?? ""];
      }),
    );
  }

  function render({ formattedPrice, whatsappUrl }) {
    priceElement.textContent = formattedPrice;
    whatsappLink.href = whatsappUrl;
  }

  function onChange(handler) {
    inputs.forEach((input) => input.addEventListener("change", handler));
  }

  return { onChange, readSelections, render };
}

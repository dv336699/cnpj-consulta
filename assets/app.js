const API_BASE = "https://api.cnpj.pw";
const THEME_KEY = "cnpj_theme";
const HISTORY_KEY = "cnpj_history";
const HISTORY_MAX = 24;
const EMPTY = "—";

const SITUACAO_LABEL = {
  1: "NULA",
  2: "ATIVA",
  3: "SUSPENSA",
  4: "INAPTA",
  8: "BAIXADA",
};

const ERROR_MESSAGES = {
  404: "CNPJ não encontrado.",
  422: "CNPJ inválido.",
  503: "Muitas consultas em pouco tempo. Aguarde alguns segundos e tente novamente.",
};

const ICONS = {
  copy: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2.2" stroke="currentColor" stroke-width="1.8"/><path d="M15.5 8.5V6.2A2.2 2.2 0 0 0 13.3 4H6.2A2.2 2.2 0 0 0 4 6.2v7.1a2.2 2.2 0 0 0 2.2 2.2h2.3" stroke="currentColor" stroke-width="1.8"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.5 14.5l5-5M8 10.5l-2 2a3.5 3.5 0 0 0 5 5l2-2M16 13.5l2-2a3.5 3.5 0 0 0-5-5l-2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.6" stroke="currentColor" stroke-width="1.8"/></svg>`,
  card: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.4" stroke="currentColor" stroke-width="1.8"/><path d="M3 9.5h18M6.5 14h5M6.5 16.5h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  activity: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12.5h4l2-6 3 12 2.5-8 1.5 2H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 4h3l1.5 4-2 1.4a11 11 0 0 0 4.6 4.6L15.5 16l4 1.5v3a1.6 1.6 0 0 1-1.8 1.6C10.8 21.4 5 15.6 4.4 8.3A1.6 1.6 0 0 1 6 6.5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3.2" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.2a3.2 3.2 0 0 1 0 5.9M17.5 19a5.5 5.5 0 0 0-2.7-4.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.5 21 19H3L12 3.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><circle cx="12" cy="16.6" r="1.05" fill="currentColor"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" stroke="currentColor" stroke-width="1.8"/><line x1="15" y1="15" x2="20" y2="20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
};

/* ------------------------------------------------------------------ utils -- */

const isBlank = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === "string" && value.trim() === "");

const onlyDigits = (value) => String(value ?? "").replace(/\D+/g, "");

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function text(value) {
  return isBlank(value) ? EMPTY : String(value);
}

function formatCnpj(value) {
  const digits = onlyDigits(value);
  if (digits.length !== 14) return isBlank(value) ? EMPTY : String(value);
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
    5,
    8
  )}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

function formatCnae(value) {
  if (isBlank(value)) return EMPTY;
  const digits = onlyDigits(value).padStart(7, "0");
  if (digits.length !== 7) return String(value);
  return `${digits.slice(0, 4)}-${digits.slice(4, 5)}/${digits.slice(5, 7)}`;
}

function formatBRL(value) {
  if (isBlank(value) || Number.isNaN(Number(value))) return EMPTY;
  return brlFormatter.format(Number(value));
}

function formatDate(value) {
  if (isBlank(value)) return EMPTY;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (!match) return String(value);
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function formatCep(value) {
  const digits = onlyDigits(value);
  if (digits.length !== 8) return isBlank(value) ? EMPTY : String(value);
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

function formatPhone(ddd, number) {
  const area = onlyDigits(ddd);
  const line = onlyDigits(number);
  if (!line) return EMPTY;
  const local =
    line.length >= 8
      ? `${line.slice(0, line.length - 4)}-${line.slice(-4)}`
      : line;
  return area ? `(${area}) ${local}` : local;
}

function maskCnpj(digits) {
  const value = digits.slice(0, 14);
  if (value.length > 12)
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
      5,
      8
    )}/${value.slice(8, 12)}-${value.slice(12)}`;
  if (value.length > 8)
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
      5,
      8
    )}/${value.slice(8)}`;
  if (value.length > 5)
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
  if (value.length > 2) return `${value.slice(0, 2)}.${value.slice(2)}`;
  return value;
}

function isValidCnpj(value) {
  const digits = onlyDigits(value);
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const checkDigit = (length) => {
    let sum = 0;
    let weight = length - 7;
    for (let i = 0; i < length; i += 1) {
      sum += Number(digits[i]) * weight;
      weight -= 1;
      if (weight < 2) weight = 9;
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  return (
    checkDigit(12) === Number(digits[12]) &&
    checkDigit(13) === Number(digits[13])
  );
}

/* -------------------------------------------------------------- dom helpers -- */

function svgIcon(name) {
  const template = document.createElement("template");
  template.innerHTML = ICONS[name] || "";
  return template.content.firstElementChild;
}

function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.class) node.className = options.class;
  if (options.text != null) node.textContent = options.text;
  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      if (value != null) node.setAttribute(key, value);
    }
  }
  for (const child of [].concat(children)) {
    if (child != null) node.append(child);
  }
  return node;
}

function field(label, value, options = {}) {
  const item = el("div", {
    class: `kv__item${options.wide ? " kv__item--wide" : ""}`,
  });
  item.append(el("div", { class: "kv__label", text: label }));
  const valueClass = `kv__value${options.mono ? " kv__value--mono" : ""}${
    options.strong ? " kv__value--strong" : ""
  }`;
  const valueNode = el("div", { class: valueClass });
  if (options.node) valueNode.append(options.node);
  else valueNode.textContent = value;
  item.append(valueNode);
  return item;
}

function section(title, iconName, count) {
  const wrapper = el("section", { class: "section" });
  const heading = el("h3", { class: "section__title" });
  heading.append(svgIcon(iconName), document.createTextNode(title));
  if (count != null) {
    heading.append(el("span", { class: "section__count", text: String(count) }));
  }
  wrapper.append(heading);
  return wrapper;
}

/* --------------------------------------------------------------- feedback -- */

let toastTimer = null;

function showToast(message) {
  const toast = refs.toast;
  toast.textContent = message;
  toast.classList.add("is-visible");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

async function copyToClipboard(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.append(helper);
      helper.select();
      const ok = document.execCommand("copy");
      helper.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function copyIconButton(getValue, { ariaLabel, toast, iconName = "copy" }) {
  const button = el("button", {
    class: "icon-btn",
    attrs: { type: "button", "aria-label": ariaLabel },
  });
  button.append(svgIcon(iconName));
  button.addEventListener("click", async () => {
    const ok = await copyToClipboard(getValue());
    if (!ok) return;
    showToast(toast);
    button.classList.add("is-copied");
    button.replaceChildren(svgIcon("check"));
    setTimeout(() => {
      button.classList.remove("is-copied");
      button.replaceChildren(svgIcon(iconName));
    }, 1400);
  });
  return button;
}

function copyChip(getValue, { label, doneLabel, ariaLabel }) {
  const button = el("button", {
    class: "link-chip",
    attrs: { type: "button", "aria-label": ariaLabel },
  });
  const render = (name, caption) => {
    button.replaceChildren(svgIcon(name), document.createTextNode(caption));
  };
  render("copy", label);
  button.addEventListener("click", async () => {
    const ok = await copyToClipboard(getValue());
    if (!ok) return;
    showToast(doneLabel);
    button.classList.add("is-copied");
    render("check", doneLabel);
    setTimeout(() => {
      button.classList.remove("is-copied");
      render("copy", label);
    }, 1400);
  });
  return button;
}

function noticeError(message, title = "Não foi possível consultar") {
  const box = el("div", {
    class: "notice notice--error",
    attrs: { role: "alert" },
  });
  box.append(svgIcon("alert"));
  const body = el("div", { class: "notice__body" });
  body.append(el("div", { class: "notice__title", text: title }));
  body.append(el("div", { class: "notice__text", text: message }));
  box.append(body);
  return box;
}

function skeletonCard() {
  const card = el("div", {
    class: "skeleton-card",
    attrs: { "aria-hidden": "true" },
  });
  card.append(el("div", { class: "sk sk--title" }));
  card.append(el("div", { class: "sk sk--sub" }));
  const chips = el("div", { class: "sk-row" });
  chips.append(el("div", { class: "sk sk--chip" }));
  chips.append(el("div", { class: "sk sk--chip" }));
  card.append(chips);
  const grid = el("div", { class: "sk-grid" });
  for (let i = 0; i < 6; i += 1) {
    grid.append(el("div", { class: "sk sk--line" }));
  }
  card.append(grid);
  return card;
}

/* --------------------------------------------------------------- network -- */

class ApiError extends Error {
  constructor(status) {
    super(`api_error_${status}`);
    this.status = status;
  }
}

async function apiGet(path) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`);
  } catch {
    throw new ApiError(0);
  }
  if (!response.ok) throw new ApiError(response.status);
  return response.json();
}

const fetchCnpj = (cnpj) => apiGet(`/cnpj/${cnpj}`);

function errorMessageFor(status) {
  return (
    ERROR_MESSAGES[status] ||
    "Falha ao consultar. Verifique sua conexão e tente novamente."
  );
}

/* ------------------------------------------------------------ detail card -- */

function statusBadgeClass(code) {
  switch (code) {
    case 2:
      return "badge badge--ok";
    case 3:
    case 4:
      return "badge badge--warn";
    case 1:
    case 8:
      return "badge badge--danger";
    default:
      return "badge";
  }
}

function buildCardHead(data) {
  const head = el("header", { class: "card__head" });

  const eyebrow = el("div", { class: "card__eyebrow" });
  const situacaoLabel = !isBlank(data.situacao_cadastral_descricao)
    ? data.situacao_cadastral_descricao
    : SITUACAO_LABEL[data.situacao_cadastral];
  if (!isBlank(situacaoLabel)) {
    eyebrow.append(
      el("span", {
        class: statusBadgeClass(data.situacao_cadastral),
        text: situacaoLabel,
      })
    );
  }
  if (!isBlank(data.identificador_descricao)) {
    eyebrow.append(
      el("span", {
        class: "chip chip--accent",
        text: data.identificador_descricao,
      })
    );
  }
  if (eyebrow.childElementCount > 0) head.append(eyebrow);

  head.append(el("h2", { class: "card__title", text: text(data.nome_empresarial) }));
  if (!isBlank(data.nome_fantasia)) {
    head.append(el("p", { class: "card__subtitle", text: data.nome_fantasia }));
  }

  const digits = onlyDigits(
    `${data.cnpj_base || ""}${data.cnpj_ordem || ""}${data.cnpj_dv || ""}`
  );
  const formattedCnpj = formatCnpj(digits);
  const idRow = el("div", { class: "card__id" });
  idRow.append(el("span", { text: formattedCnpj }));
  idRow.append(
    copyIconButton(() => digits, {
      ariaLabel: "Copiar CNPJ",
      toast: "CNPJ copiado!",
    })
  );
  idRow.append(
    copyIconButton(() => window.location.href, {
      ariaLabel: "Copiar link desta consulta",
      toast: "Link copiado!",
      iconName: "link",
    })
  );
  head.append(idRow);

  return head;
}

function buildRegistration(data) {
  const sec = section("Dados cadastrais", "card");
  const grid = el("div", { class: "kv" });

  const digits = onlyDigits(
    `${data.cnpj_base || ""}${data.cnpj_ordem || ""}${data.cnpj_dv || ""}`
  );
  grid.append(field("CNPJ", formatCnpj(digits), { mono: true }));

  const situacao = !isBlank(data.situacao_cadastral_descricao)
    ? data.situacao_cadastral_descricao
    : SITUACAO_LABEL[data.situacao_cadastral];
  grid.append(field("Situação cadastral", text(situacao)));
  grid.append(field("Data da situação", formatDate(data.data_situacao_cadastral)));

  const motivo = data.motivo_situacao_desc;
  if (!isBlank(motivo) && motivo.trim().toUpperCase() !== "SEM MOTIVO") {
    grid.append(field("Motivo da situação", motivo));
  }

  let natureza = EMPTY;
  if (!isBlank(data.natureza_juridica_desc)) {
    natureza = isBlank(data.natureza_juridica)
      ? data.natureza_juridica_desc
      : `${data.natureza_juridica_desc} (${data.natureza_juridica})`;
  } else if (!isBlank(data.natureza_juridica)) {
    natureza = String(data.natureza_juridica);
  }
  grid.append(field("Natureza jurídica", natureza, { wide: true }));

  grid.append(field("Porte da empresa", text(data.porte_empresa_descricao)));
  grid.append(field("Capital social", formatBRL(data.capital_social), { strong: true }));
  grid.append(field("Início da atividade", formatDate(data.data_inicio_atividade)));

  const badges = el("div", { class: "kv__badges" });
  badges.append(
    el("span", {
      class: data.opcao_simples ? "badge badge--ok" : "badge",
      text: data.opcao_simples ? "Optante pelo Simples" : "Não optante pelo Simples",
    })
  );
  badges.append(
    el("span", {
      class: data.opcao_mei ? "badge badge--ok" : "badge",
      text: data.opcao_mei ? "MEI" : "Não é MEI",
    })
  );
  grid.append(field("Enquadramento", null, { wide: true, node: badges }));

  sec.append(grid);
  return sec;
}

function buildActivity(data) {
  const sec = section("Atividade econômica", "activity");

  const main = el("div", { class: "cnae-main" });
  main.append(
    el("span", { class: "cnae-code", text: formatCnae(data.cnae_fiscal_principal) })
  );
  main.append(
    el("span", { text: text(data.cnae_fiscal_principal_descricao) })
  );
  sec.append(main);

  const secondary = Array.isArray(data.cnaes_fiscais_secundarios)
    ? data.cnaes_fiscais_secundarios
    : [];
  if (secondary.length > 0) {
    sec.append(
      el("p", { class: "cnae-sub-label", text: "CNAEs secundários" })
    );
    const list = el("ul", { class: "cnae-list" });
    for (const item of secondary) {
      const li = el("li");
      li.append(el("span", { class: "cnae-code", text: formatCnae(item.codigo) }));
      li.append(el("span", { text: text(item.descricao) }));
      list.append(li);
    }
    sec.append(list);
  }

  return sec;
}

function assembleAddress(data) {
  const street = [data.tipo_logradouro, data.logradouro]
    .filter((part) => !isBlank(part))
    .join(" ")
    .trim();

  let streetLine = street;
  if (!isBlank(data.numero)) streetLine += `${streetLine ? ", " : ""}${data.numero}`;
  if (!isBlank(data.complemento))
    streetLine += `${streetLine ? " — " : ""}${data.complemento}`;

  const locality = [];
  if (!isBlank(data.bairro)) locality.push(String(data.bairro));
  const city = [data.municipio_desc, data.uf]
    .filter((part) => !isBlank(part))
    .join("/");
  if (city) locality.push(city);
  const cep = formatCep(data.cep);
  if (cep !== EMPTY) locality.push(`CEP ${cep}`);

  const lines = [streetLine, locality.join(" • ")].filter(Boolean);
  const oneLine = [streetLine, ...locality].filter(Boolean).join(", ");
  return { lines, oneLine };
}

function buildAddress(data) {
  const sec = section("Endereço", "pin");
  const { lines, oneLine } = assembleAddress(data);

  if (lines.length === 0) {
    sec.append(el("p", { class: "addr", text: EMPTY }));
    return sec;
  }

  const block = el("address", { class: "addr" });
  lines.forEach((line, index) => {
    if (index > 0) block.append(el("br"));
    block.append(document.createTextNode(line));
  });
  sec.append(block);

  const actions = el("div", { class: "inline-actions" });
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    oneLine
  )}`;
  const mapLink = el("a", {
    class: "link-chip",
    attrs: {
      href: mapUrl,
      target: "_blank",
      rel: "noopener noreferrer",
    },
  });
  mapLink.append(svgIcon("pin"), document.createTextNode("Ver no mapa"));
  actions.append(mapLink);
  actions.append(
    copyChip(() => oneLine, {
      label: "Copiar endereço",
      doneLabel: "Endereço copiado!",
      ariaLabel: "Copiar endereço",
    })
  );
  sec.append(actions);

  return sec;
}

function buildContact(data) {
  const sec = section("Contato", "phone");
  const grid = el("div", { class: "kv" });

  const phone1 = formatPhone(data.ddd1, data.telefone_1);
  const phone2 = formatPhone(data.ddd2, data.telefone_2);

  if (phone1 === EMPTY && phone2 === EMPTY) {
    grid.append(field("Telefone", EMPTY));
  } else {
    grid.append(field(phone2 !== EMPTY ? "Telefone 1" : "Telefone", phone1));
    if (phone2 !== EMPTY) grid.append(field("Telefone 2", phone2));
  }

  if (isBlank(data.correio_eletronico)) {
    grid.append(field("E-mail", EMPTY));
  } else {
    const email = String(data.correio_eletronico).trim().toLowerCase();
    const link = el("a", {
      text: email,
      attrs: { href: `mailto:${email}` },
    });
    grid.append(field("E-mail", null, { node: link }));
  }

  sec.append(grid);
  return sec;
}

function buildPartners(data) {
  const partners = Array.isArray(data.socios) ? data.socios : [];
  if (partners.length === 0) return null;

  const sec = section("Sócios", "users", partners.length);
  const list = el("div", { class: "socios" });

  for (const partner of partners) {
    const card = el("div", { class: "socio" });
    card.append(el("span", { class: "socio__name", text: text(partner.nome) }));
    if (!isBlank(partner.qualificacao_descricao)) {
      card.append(
        el("span", { class: "socio__role", text: partner.qualificacao_descricao })
      );
    }

    const meta = el("div", { class: "socio__meta" });
    const addMeta = (label, value, mono) => {
      if (isBlank(value)) return;
      const span = el("span");
      span.append(document.createTextNode(`${label} `));
      span.append(
        el("b", { class: mono ? "socio__doc" : null, text: String(value) })
      );
      meta.append(span);
    };
    addMeta("Documento:", partner.cnpj_cpf, true);
    if (!isBlank(partner.data_entrada_sociedade)) {
      addMeta("Entrada:", formatDate(partner.data_entrada_sociedade));
    }
    addMeta("Faixa etária:", partner.faixa_etaria_descricao);
    if (meta.childElementCount > 0) card.append(meta);

    list.append(card);
  }

  sec.append(list);
  return sec;
}

function renderDetail(data) {
  const card = el("article", { class: "card" });
  card.append(buildCardHead(data));
  const body = el("div", { class: "card__body" });
  body.append(buildRegistration(data));
  body.append(buildActivity(data));
  body.append(buildAddress(data));
  body.append(buildContact(data));
  const partners = buildPartners(data);
  if (partners) body.append(partners);
  card.append(body);
  return card;
}

/* --------------------------------------------------------- recent history -- */

function loadHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => entry && onlyDigits(entry.cnpj).length === 14);
  } catch {
    return [];
  }
}

function persistHistory(entries) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    /* storage blocked — history is best-effort */
  }
}

function saveToHistory(cnpj, nome) {
  const digits = onlyDigits(cnpj);
  if (digits.length !== 14) return;
  const entries = loadHistory().filter(
    (entry) => onlyDigits(entry.cnpj) !== digits
  );
  entries.unshift({
    cnpj: digits,
    nome: isBlank(nome) ? "" : String(nome),
    ts: Date.now(),
  });
  persistHistory(entries.slice(0, HISTORY_MAX));
  renderRecent();
}

function clearHistory() {
  persistHistory([]);
  renderRecent();
}

function renderRecent() {
  const entries = loadHistory();
  refs.recentChips.replaceChildren();
  if (entries.length === 0) {
    refs.recent.hidden = true;
    return;
  }
  refs.recent.hidden = false;

  for (const entry of entries) {
    const digits = onlyDigits(entry.cnpj);
    const label = isBlank(entry.nome) ? formatCnpj(digits) : entry.nome;
    const chip = el("button", {
      class: "recent__chip",
      attrs: { type: "button", "aria-label": `Consultar ${label}` },
    });
    if (!isBlank(entry.nome)) {
      chip.append(el("span", { class: "recent__chip-name", text: entry.nome }));
    }
    chip.append(el("span", { class: "recent__chip-cnpj", text: formatCnpj(digits) }));
    chip.addEventListener("click", () => {
      refs.cnpjInput.value = maskCnpj(digits);
      clearFieldError(refs.cnpjError, refs.cnpjInput);
      loadCnpj(digits, { button: refs.cnpjSubmit });
    });
    refs.recentChips.append(chip);
  }
}

/* -------------------------------------------------------------- controllers -- */

const detailCache = new Map();

function setResults(node) {
  refs.results.replaceChildren(node);
}

function updateUrl(cnpj) {
  try {
    const url = `${window.location.pathname}?cnpj=${cnpj}`;
    window.history.replaceState(null, "", url);
  } catch {
    /* history unavailable — non-critical */
  }
}

function setButtonLoading(button, loading, label) {
  if (loading) {
    button.disabled = true;
    button.dataset.loading = "true";
    button.replaceChildren(
      el("span", { class: "spinner" }),
      document.createTextNode(label)
    );
  } else {
    button.disabled = false;
    delete button.dataset.loading;
  }
}

async function loadCnpj(cnpj, { button } = {}) {
  refs.results.setAttribute("aria-busy", "true");
  setResults(skeletonCard());
  if (button) setButtonLoading(button, true, "Consultando…");

  try {
    let data = detailCache.get(cnpj);
    if (!data) {
      data = await fetchCnpj(cnpj);
      detailCache.set(cnpj, data);
    }
    setResults(renderDetail(data));
    updateUrl(cnpj);
    saveToHistory(cnpj, data.nome_empresarial);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 0;
    setResults(noticeError(errorMessageFor(status)));
  } finally {
    refs.results.setAttribute("aria-busy", "false");
    if (button) {
      setButtonLoading(button, false);
      button.replaceChildren(svgIcon("search"), document.createTextNode("Consultar"));
    }
  }
}

/* ----------------------------------------------------------- field errors -- */

function setFieldError(errorNode, input, message) {
  errorNode.textContent = message;
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
}

function clearFieldError(errorNode, input) {
  errorNode.textContent = "";
  input.classList.remove("is-invalid");
  input.removeAttribute("aria-invalid");
}

/* --------------------------------------------------------------- theme -- */

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage blocked — theme still applies for this session */
  }
}

/* ----------------------------------------------------------------- init -- */

const refs = {};

function cacheRefs() {
  refs.results = document.getElementById("results");
  refs.toast = document.getElementById("toast");
  refs.themeToggle = document.getElementById("theme-toggle");
  refs.cnpjForm = document.getElementById("cnpj-form");
  refs.cnpjInput = document.getElementById("cnpj-input");
  refs.cnpjError = document.getElementById("cnpj-error");
  refs.cnpjSubmit = document.getElementById("cnpj-submit");
  refs.recent = document.getElementById("recent");
  refs.recentChips = document.getElementById("recent-chips");
  refs.recentClear = document.getElementById("recent-clear");
}

function bindEvents() {
  refs.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });

  refs.cnpjInput.addEventListener("input", () => {
    const start = refs.cnpjInput.selectionStart;
    const before = refs.cnpjInput.value;
    refs.cnpjInput.value = maskCnpj(onlyDigits(refs.cnpjInput.value));
    if (start != null && start < before.length) {
      const pos = Math.min(refs.cnpjInput.value.length, start);
      refs.cnpjInput.setSelectionRange(pos, pos);
    }
    if (refs.cnpjInput.classList.contains("is-invalid")) {
      clearFieldError(refs.cnpjError, refs.cnpjInput);
    }
  });

  refs.cnpjForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const digits = onlyDigits(refs.cnpjInput.value);
    clearFieldError(refs.cnpjError, refs.cnpjInput);
    if (digits.length === 0) {
      setFieldError(refs.cnpjError, refs.cnpjInput, "Informe um CNPJ para consultar.");
      return;
    }
    if (digits.length !== 14 || !isValidCnpj(digits)) {
      setFieldError(refs.cnpjError, refs.cnpjInput, "CNPJ inválido.");
      return;
    }
    loadCnpj(digits, { button: refs.cnpjSubmit });
  });

  refs.recentClear.addEventListener("click", clearHistory);
}

function handleDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("cnpj");
  if (isBlank(raw)) return;
  const digits = onlyDigits(raw);
  if (digits.length !== 14 || !isValidCnpj(digits)) return;
  refs.cnpjInput.value = maskCnpj(digits);
  loadCnpj(digits);
}

function init() {
  cacheRefs();
  bindEvents();
  renderRecent();
  handleDeepLink();
}

init();

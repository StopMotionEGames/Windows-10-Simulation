// NTKernel.ReadFile("/Windows/System32/Windows.UI.Html.Controls.dll.css", {
//   Type: FileType.Stylesheet,
//   IsCritical: true,
//   AutoAppend: true,
// });
// Início de toda a "mágica"

class Button extends HTMLButtonElement {
  constructor() {
    super();
    /** @type {boolean} Habilita ou desabilita os logs no console */
    this.debug = true;
    /** @type {boolean} Evita múltiplas inicializações */
    this._initialized = false;
    /** @type {boolean} Define se o controle está ativo (visível) ou não.*/
  }

  /**
   * Método estático que define os atributos observados
   * @returns {string[]} Lista de atributos observados
   */
  static get observedAttributes() {
    return ["content", "width", "height", "foreground", "background"];
  }
  get Background() {
    return this.getAttribute("background");
  }

  set Background(value) {
    this.setAttribute("isactive", value.toString());
  }

  get Content() {
    if (!this.getAttribute("content") && this.textContent)
      return this.textContent;
    else if (this.getAttribute("content") && !this.textContent)
      return this.getAttribute("content");
    else return "";
  }

  set Content(text) {
    this.setAttribute("content", text.toString());
  }

  get Foreground() {
    return this.getAttribute("foreground");
  }

  set Foreground(value) {
    this.setAttribute("foreground", value.toString);
  }
  get Height() {
    return this.getAttribute("height") || null;
  }

  set Height(value) {
    this.setAttribute("height", value.toString() || this.clientHeight || null);
  }

  get Width() {
    return this.getAttribute("width") || null;
  }

  set Width(value) {
    this.setAttribute("width", value.toString() || this.clientWidth || null);
  }

  /** Chamado quando o elemento é conectado ao DOM */
  connectedCallback() {
    if (!this._initialized) {
      if (this.debug) console.log(`${this.className} conectado:`, this);
      this.#Initialize();
      this._initialized = true;
    }
  }

  /** Chamado quando um atributo do elemento observado é alterado
   * @param {string} name Nome do atributo alterado
   * @param {string} oldValue Valor anterior do atributo
   * @param {string} newValue Novo valor do atributo */
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.debug) {
      console.log(
        `Atributo "${name}" alterado de ${oldValue} para "${newValue}"`
      );
    }

    const updates = {
      background: () => this.#UpdateBackground(),
      content: () => this.#UpdateContent(),
      foreground: () => this.#UpdateForeground(),
      height: () => this.#UpdateSizes(),
      width: () => this.#UpdateSizes(),
    };

    if (updates[name]) updates[name]();
  }

  #UpdateBackground() {
    /** @type {string} Valor do atributo "foreground" do ProgressRing. Se não definido, usa o valor da variável CSS `--accent-color` */
    const backgroundColor = this.getAttribute("background");

    this.style.background = backgroundColor;
    if (this.debug) {
      console.log(
        `${
          this.#UpdateForeground.name
        }: Cor definida para ${backgroundColor} em`,
        this
      );
    }
  }
  #UpdateContent() {
    this.textContent = this.Content;
  }
  /** Atualiza a cor de primeiro plano do ProgressRing com base no atributo `foreground` */
  #UpdateForeground() {
    /** @type {string} Valor do atributo "foreground" do ProgressRing. Se não definido, usa o valor da variável CSS `--accent-color` */
    const foregroundColor = this.getAttribute("foreground");

    this.querySelectorAll("circle").forEach((circle) => {
      // Atualiza o fill em todos os círculos do elemento
      circle.style.fill = foregroundColor;
    });
    if (this.debug) {
      console.log(
        `${
          this.#UpdateForeground.name
        }: Cor definida para ${foregroundColor} em`,
        this
      );
    }
  }
  /** Atualiza o tamanho do ProgressRing com base nos atributos `width` e `height` */
  #UpdateSizes() {
    /** @type {number} Valor do atributo `width` do ProgressRing */
    var widthVal = this.getAttribute("width") || heightVal;
    /** @type {number} Valor do atributo `height` do ProgressRing */
    var heightVal = this.getAttribute("height") || widthVal;
    this.style.width = widthVal + "px";
    this.style.height = heightVal + "px";
    if (this.debug) {
      console.log(
        `${
          this.#UpdateSizes.name
        }: Definido width = ${widthVal}px e height = ${heightVal}px para`,
        this
      );
    }
  }
  async #Initialize() {
    if (this.debug)
      console.log(`${this.#Initialize.name}: Inicializando para`, this);

    this.#UpdateSizes();
    this.#UpdateForeground();
    // this.textContent = this.Content;
  }
}

class ProgressBar extends HTMLElement {
  constructor() {
    super();
    /** @type {boolean} Habilita ou desabilita os logs no console */
    this.debug = true;
    /** @type {boolean} Evita múltiplas inicializações */
    this._initialized = false;
    /** @type {boolean} Define se o controle está ativo (visível) ou não. */
    this.IsActive = true;
  }
  /** Método estático que define os atributos observados
   * @returns {string[]} Lista de atributos observados */
  static get observedAttributes() {
    return [
      "width",
      "height",
      "foreground",
      "value",
      "isindeterminate",
      "maximum",
      "minimum",
    ];
  }
  get Foreground() {
    return this.getAttribute("foreground") || "var(--SystemAccentColor)";
  }
  set Foreground(value) {
    this.setAttribute("foreground", value.toString() || "var(--SystemAccentColor)");
  }
  get Height() {
    return this.getAttribute("height") || null;
  }
  set Height(value) {
    this.setAttribute("height", value.toString() || this.clientHeight || null);
  }
  get IsIndeterminate() {
    return this.getAttribute("isindeterminate") === "true" ? true : false;
  }
  set IsIndeterminate(value) {
    this.setAttribute("isindeterminate", value ? "true" : "false");
  }
  get Maximum() {
    return parseFloat(this.getAttribute("maximum")) || 100;
  }
  set Maximum(value) {
    this.setAttribute("maximum", value.toString() || "100");
  }
  get Minimum() {
    return parseFloat(this.getAttribute("minimum")) || 0;
  }
  set Minimum(value) {
    this.setAttribute("minimum", value.toString() || "0");
  }
  get Value() {
    return parseFloat(this.getAttribute("value")) || 0;
  }
  set Value(value) {
    this.setAttribute("value", value.toString() || "0");
  }
  get Width() {
    return Number(this.getAttribute("width")) || this.clientWidth || null;
  }
  set Width(value) {
    this.setAttribute("width", value.toString() || this.clientWidth || null);
  }
  /** Chamado quando o elemento é conectado ao DOM */
  connectedCallback() {
    if (this._initialized) return;
    if (this.debug)
      console.log(`${this.connectedCallback.name}: Inicializando para`, this);
    this.#InitalizeControl();
    this.#UpdateForeground();
    this._initialized = true;
  }
  /** Chamado quando um atributo do elemento observado é alterado
   * @param {string} name - Nome do atributo alterado
   * @param {string} oldValue - Valor antigo do atributo
   * @param {string} newValue - Novo valor do atributo */
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.debug) {
      console.log(
        `Atributo "${name}" alterado de ${oldValue} para "${newValue}"`
      );
    }

    const updates = {
      background: () => this.#UpdateBackground(),
      foreground: () => this.#UpdateForeground(),
      height: () => this.#UpdateSizes(),
      maximum: () => this.#UpdateMaximum(),
      minimum: () => this.#UpdateMinimum(),
      value: () => this.#UpdateValue(),
      width: () => this.#UpdateSizes(),
    };

    if (updates[name]) updates[name]();
  }
  #UpdateBackground() {
    /** @type {string} Valor do atributo `background` do ProgressBar. Se não definido, usa o valor da variável CSS `--background-color` */
    const backgroundColor =
      this.getAttribute("background") || this.style.getPropertyValue("--SystemControlBackgroundBaseLowBrush") || "var(--SystemControlBackgroundBaseLowBrush)" || "#0003";
    this.style.backgroundColor = backgroundColor;
    if (this.debug) {
      console.log(
        `${
          this.#UpdateBackground.name
        }: Cor de fundo definida para ${backgroundColor} em`,
        this
      );
    }
  }
  #UpdateForeground() {
    /** @type {string} Valor do atributo `foreground` do ProgressBar. Se não definido, usa o valor da variável CSS `--accent-color` */
    this.style.color = this.Foreground;
  }
  #UpdateMaximum() {
    /** @type {number} Valor do atributo `maximum` do ProgressBar */
    if (this.debug) {
      console.log(
        `${this.#UpdateMaximum.name}: Valor máximo definido para ${
          this.Maximum
        } em`,
        this
      );
    }
    this.ariaValueMax = `${this.Maximum}`;
  }
  #UpdateMinimum() {
    /** @type {number} Valor do atributo `minimum` do ProgressBar */
    if (this.debug) {
      console.log(
        `${this.#UpdateMinimum.name}: Valor mínimo definido para ${
          this.Minimum
        } em`,
        this
      );
    }
    this.ariaValueMin = `${this.Minimum}`;
  }
  #UpdateSizes() {
    /** @type {number} Valor do atributo `width` do ProgressBar */
    const widthVal = this.Width;
    /** @type {number} Valor do atributo `height` do ProgressBar */
    const heightVal =
      this.getAttribute("height") || this.style.getPropertyValue("--ProgressBarThemeMinHeight") || "4";
    this.style.setProperty("--width", `${widthVal}px`);
    this.style.height = `${heightVal}px`;
    if (this.debug) {
      console.log(
        `${
          this.#UpdateSizes.name
        }: Definido width = ${widthVal}px e height = ${heightVal}px para`,
        this
      );
    }
  }
  #UpdateValue() {
    /** @type {number} Valor do atributo `value` do ProgressBar */
    if (this.debug) {
      console.log(
        `${this.#UpdateValue.name}: Valor definido para ${this.Value} em`,
        this
      );
    }
    if (this.Value < this.Minimum) {
      console.warn(
        `${this.#UpdateValue.name}: O valor ${
          this.Value
        } é menor que o mínimo ${this.Minimum}. Ajustando para o mínimo.`
      );
      this.setAttribute("value", this.Minimum.toString());
    }
    if (this.Value > this.Maximum) {
      console.warn(
        `${this.#UpdateValue.name}: O valor ${
          this.Value
        } é maior que o máximo ${this.Maximum}. Ajustando para o máximo.`
      );
      this.setAttribute("value", this.Maximum.toString());
    }
    const percentage =
      ((this.Value - this.Minimum) / (this.Maximum - this.Minimum)) * 100;
    this.querySelector("#ProgressBarIndicator").setAttribute(
      "style",
      `width: ${percentage.toString()}%;`
    );
    this.ariaValueNow = `${this.Value}`;
  }
  #UpdateVisibility() {
    //this function is empty temporarily
  }

  #InitalizeControl() {
    if (this.debug)
      console.log(`${this.#InitalizeControl.name}: Inicializando para`, this);
    this.role = "progressbar";
    this.ariaAtomic = "true"; // Indica que o valor do ProgressBar é atualizado dinamicamente
    // this.tabIndex = 0; // Permite que o ProgressBar seja focável
    this.#UpdateVisibility(); // Atualiza a visibilidade com base no atributo "isactive"
    this.#UpdateSizes(); // Atualiza tamanho com base nos atributos atuais
    this.#UpdateMaximum(); // Atualiza o valor máximo com base no atributo "maximum"
    this.#UpdateMinimum(); // Atualiza o valor mínimo com base no atributo "minimum"
    /** @type {string} Conteúdo HTML do ProgressBar */
    const template = `<div id="IndeterminateRoot">
      <wuhc-border id="B5">
        <wuhc-ellipse id="E5"></wuhc-ellipse>
      </wuhc-border>
      <wuhc-rectangle></wuhc-rectangle>
      <wuhc-border id="B4">
        <wuhc-ellipse id="E4"></wuhc-ellipse>
      </wuhc-border>
      <wuhc-rectangle></wuhc-rectangle>
      <wuhc-border id="B3">
        <wuhc-ellipse id="E3"></wuhc-ellipse>
      </wuhc-border>
      <wuhc-rectangle></wuhc-rectangle>
      <wuhc-border id="B2">
        <wuhc-ellipse id="E2"></wuhc-ellipse>
      </wuhc-border>
      <wuhc-rectangle></wuhc-rectangle>
      <wuhc-border id="B1">
        <wuhc-ellipse id="E1"></wuhc-ellipse>
      </wuhc-border>
    </div>
    <wuhc-border id="DeterminateRoot">
      <wuhc-rectangle id="ProgressBarIndicator"></wuhc-rectangle>
    </wuhc-border>`;
    this.innerHTML = template;
    this.#UpdateForeground();
    this.#UpdateValue(); // Atualiza o valor do ProgressBar com base no atributo "value"
    if (this.debug)
      console.log(
        `${this.#InitalizeControl.name}: SVG carregada com sucesso em`,
        this
      );
  }
}

/**
 * Windows.UI.Html.Controls.ProgressRing
 *
 * Versão web do ProgressRing do Windows 10
 */
class ProgressRing extends HTMLElement {
  constructor() {
    super();
    /** @type {boolean} Habilita ou desabilita os logs no console */
    this.debug = true;
    /** @type {boolean} Evita múltiplas inicializações */
    this._initialized = false;
    /** @type {boolean} Define se o controle está ativo (visível) ou não.*/
  }

  /**
   * Método estático que define os atributos observados
   * @returns {string[]} Lista de atributos observados
   */
  static get observedAttributes() {
    return ["width", "height", "foreground", "isactive"];
  }
  get Width() {
    return this.getAttribute("width") || this.Height || 20;
  }

  set Width(value) {
    this.setAttribute("width", value.toString());
  }

  get Height() {
    return this.getAttribute("height") || this.Width || 20;
  }

  set Height(value) {
    this.setAttribute("height", value.toString());
  }

  get Foreground() {
    return this.getAttribute("foreground");
  }

  set Foreground(value) {
    this.setAttribute("foreground", value);
  }

  get IsActive() {
    return this.getAttribute("isactive") === "true";
  }

  set IsActive(value) {
    this.setAttribute("isactive", value ? "true" : "false");
  }
  /** Chamado quando o elemento é conectado ao DOM */
  connectedCallback() {
    if (!this._initialized) {
      if (this.debug) console.log(`${this.className} conectado:`, this);
      this.#Initialize();
      this._initialized = true;
    }
  }

  /** Chamado quando um atributo do elemento observado é alterado
   * @param {string} name Nome do atributo alterado
   * @param {string} oldValue Valor anterior do atributo
   * @param {string} newValue Novo valor do atributo */
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.debug) {
      console.log(
        `Atributo "${name}" alterado de ${oldValue} para "${newValue}"`
      );
    }

    const updates = {
      width: () => this.#UpdateSizes(),
      height: () => this.#UpdateSizes(),
      foreground: () => this.#UpdateForeground(),
      isactive: () => this.#UpdateVisibility(),
    };

    if (updates[name]) updates[name]();
  }

  /** Atualiza o tamanho do ProgressRing com base nos atributos `width` e `height` */
  #UpdateSizes() {
    /** @type {number} Valor do atributo `width` do ProgressRing */
    var widthVal = this.getAttribute("width") || heightVal || "20";
    /** @type {number} Valor do atributo `height` do ProgressRing */
    var heightVal = this.getAttribute("height") || widthVal || "20";
    this.style.width = widthVal + "px";
    this.style.height = heightVal + "px";
    if (this.debug) {
      console.log(
        `${
          this.#UpdateSizes.name
        }: Definido width = ${widthVal}px e height = ${heightVal}px para`,
        this
      );
    }
  }

  /** Atualiza a cor de primeiro plano do ProgressRing com base no atributo `foreground` */
  #UpdateForeground() {
    /** @type {string} Valor do atributo "foreground" do ProgressRing. Se não definido, usa o valor da variável CSS `--accent-color` */
    const foregroundColor = this.getAttribute("foreground");

    this.querySelectorAll("circle").forEach((circle) => {
      // Atualiza o fill em todos os círculos do elemento
      circle.style.fill = foregroundColor;
    });
    if (this.debug) {
      console.log(
        `${
          this.#UpdateForeground.name
        }: Cor definida para ${foregroundColor} em`,
        this
      );
    }
  }
  #UpdateVisibility() {
    this.style.visibility = this.IsActive ? "visible" : "collapse";
    if (this.debug)
      console.log(
        `${this.#UpdateVisibility.name}: Atualizando visibilidade para ${
          this.IsActive
        } em`,
        this
      );
  }
  /** Carrega e adiciona o conteúdo SVG dentro do elemento `<wuhc-progressring>` */
  async #Initialize() {
    if (this.debug)
      console.log(`${this.#Initialize.name}: Inicializando para`, this);
    // Atualiza os atributos do ProgressRing
    this.#UpdateVisibility();
    this.#UpdateSizes();

    /** @type {string} Conteúdo SVG do ProgressRing */
    const SVG = `<svg id="wuhc-ProgressRing" viewBox="0 0 8 8"><g id="E1R"><circle id="E1" /></g><g id="E2R"><circle id="E2" /></g><g id="E3R"><circle id="E3" /></g><g id="E4R"><circle id="E4" /></g><g id="E5R"><circle id="E5" /></g><g id="E6R"><circle id="E6" /></g></svg>`;
    this.innerHTML = SVG;
    this.#UpdateForeground(); // Após embutir o SVG, aplica a cor de primeiro plano

    if (this.debug) {
      console.log(
        "embedProgressRing: SVG carregado e incorporado com sucesso em",
        this
      );
    }
  }
}

/* Área exclusiva para definir elementos personalizados com suas classes
  Para um código mais limpo, recomendo usar o final do arquivo para definição
  dos elementos personalizados */
customElements.define("wuhc-button", Button , { extends: "button" });
customElements.define("wuhc-progressring", ProgressRing);
customElements.define("wuhc-progressbar", ProgressBar);

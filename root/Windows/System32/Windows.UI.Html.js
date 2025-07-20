NTKernel.ReadFile("/Windows/System32/Windows.UI.Html.Controls.dll.js", {
  Type: FileType.Script,
  IsCritical: true,
  AutoAppend: true,
});
NTKernel.LoadFont("/Windows/Fonts/segoeui.ttf", "Segoe UI");
NTKernel.LoadFont("/Windows/Fonts/segoeuisl.ttf", "Segoe UI Semilight");
class WinRTWindow extends HTMLElement {
  constructor() {
    super();
    /** @type {boolean} Habilita ou desabilita os logs no console */
    this.debug = true;
    /** @type {boolean} Evita múltiplas inicializações */
    this._initialized = false;
    /** @type {boolean} Define se o controle está ativo (visível) ou não.*/
  }
  static get observedAttributes() {
    return ["width", "height", "background", "foreground"];
  }
  /** Chamado quando o elemento é conectado ao DOM */
  connectedCallback() {
    if (!this._initialized) {
      if (this.debug) console.log(`${this.className} conectado:`, this);
      this.#Initialize();
      this._initialized = true;
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.debug) {
      console.log(`Atributo "${name}" alterado de ${oldValue} para "${newValue}"`);
    }

    const updates = {
      // width: () => this.#UpdateSizes(),
      // height: () => this.#UpdateSizes(),
      background: () => this.#UpdateBackground(),
      foreground: () => this.#UpdateForeground(),
      // isactive: () => this.#UpdateVisibility(),
    };

    if (updates[name]) updates[name]();
  }
  get Background() {
    return this.getAttribute("background");
  }
  set Background(value) {
    this.setAttribute("background", value);
  }
  #UpdateBackground() {
    const backgroundColor = this.getAttribute("background");
    this.style.backgroundColor = backgroundColor;
    if (this.debug) {
      console.log(`${this.#UpdateBackground.name}: Cor definida para ${backgroundColor} em`, this);
    }
  }

  get Foreground() {
    return this.getAttribute("foreground");
  }

  set Foreground(value) {
    this.setAttribute("foreground", value);
  }
  #Initialize() {
    if (this.debug) console.log(`${this.#Initialize.name}: Inicializando para`, this);
  }
  #UpdateForeground() {
    /** @type {string} Valor do atributo "foreground" do ProgressRing. Se não definido, usa o valor da variável CSS `--accent-color` */
    const foregroundColor = this.getAttribute("foreground");

    this.style.background = foregroundColor;
    if (this.debug) {
      console.log(`${this.#UpdateForeground.name}: Cor definida para ${foregroundColor} em`, this);
    }
  }
}
customElements.define("wuhc-window", WinRTWindow);

let debug = true;
const Windows = {
  UI: {
    Html: {
      Controls: { Button: null, ProgressBar: null, ProgressRing: null },
    },
  },
};
/**
 * `Windows.UI.Html.Controls.Button`
 *
 * Web version of Button from Windows 10
 */
Windows.UI.Html.Controls.Button = class extends HTMLButtonElement {
  constructor() {
    super();
    /** @type {boolean} Avoid multiple initializations */
    this._initialized = false;
  }

  /**
   * Static method that defines the observed attributes
   * @description This method returns a list of attributes that the element will observe for changes.
   * @returns {string[]} Observed attributes list
   */
  static get observedAttributes() {
    return ["content", "width", "height", "foreground", "background"];
  }
  get Background() {
    return this.getAttribute("background");
  }

  set Background(value) {
    this.setAttribute("background", value.toString());
  }

  get Content() {
    return this.getAttribute("content") || this.textContent || "";
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
    this.setAttribute("height", value.toString() || null);
  }

  get Width() {
    return this.getAttribute("width") || null;
  }

  set Width(value) {
    this.setAttribute("width", value.toString() || null);
  }

  /** Called when the element is connected to the DOM */
  connectedCallback() {
    if (!this._initialized) {
      if (debug) console.log(`${this.className} connected:`, this);
      this.#InitializeControl();
      this._initialized = true;
    }
  }

  /** Called when an observed attribute of the element is changed
   * @param {string} name Name of the changed attribute
   * @param {string} oldValue Previous value of the attribute
   * @param {string} newValue New value of the attribute */
  attributeChangedCallback(name, oldValue, newValue) {
    if (debug) {
      console.log(
        `"${name}" attribute changed from ${oldValue} to "${newValue}"`
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
    this.style.background = this.Background;
    if (debug) {
      console.log(
        `${this.#UpdateBackground.name}: Background color is defined as ${
          this.Background
        } in`,
        this
      );
    }
  }
  #UpdateContent() {
    this.textContent = this.Content;
  }
  /** Updates the text color based on the `foreground` attribute */
  #UpdateForeground() {
    this.style.color = this.Foreground;
    if (debug) {
      console.log(
        `${this.#UpdateForeground.name}: Text color is defined as ${
          this.Foreground
        } in`,
        this
      );
    }
  }
  /** Updates the size of the wuhc-button based on `width` and `height` */
  #UpdateSizes() {
    this.style.width = this.Width + "px";
    this.style.height = this.Height + "px";
    if (debug) {
      console.log(
        `${this.#UpdateSizes.name}: Updated the width (${
          this.Width
        }px) and height (${this.Height}px) to`,
        this
      );
    }
  }
  #InitializeControl() {
    if (debug)
      console.log(
        `${this.#InitializeControl.name}: Control initialized to`,
        this
      );
    if (!this.hasAttribute("is")) this.setAttribute("is", "wuhc-button");
    this.#UpdateSizes();
    this.#UpdateForeground();
    this.#UpdateContent();
    this.#UpdateBackground();
  }
};
/**
 * `Windows.UI.Html.Controls.ProgressBar`
 *
 * Web version of ProgressBar from Windows 10
 */
Windows.UI.Html.Controls.ProgressBar = class extends HTMLElement {
  constructor() {
    super();
    /** @type {boolean} Avoid multiple initializations */
    this._initialized = false;
  }
  /** Static method that defines the observed attributes
   * @returns {string[]} List of observed attributes */
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
  get Background() {
    return (
      this.getAttribute("background") ||
      this.style.getPropertyValue("--SystemControlBackgroundBaseLowBrush") ||
      "var(--SystemControlBackgroundBaseLowBrush)" ||
      "#0003"
    );
  }
  set Background(value) {
    this.setAttribute(
      "background",
      value.toString() ||
        this.style.getPropertyValue("--SystemControlBackgroundBaseLowBrush") ||
        "var(--SystemControlBackgroundBaseLowBrush)" ||
        "#0003"
    );
  }
  get Foreground() {
    return this.getAttribute("foreground") || "var(--SystemAccentColor)";
  }
  set Foreground(value) {
    this.setAttribute(
      "foreground",
      value.toString() || "var(--SystemAccentColor)"
    );
  }
  get Height() {
    return (
      this.getAttribute("height") ||
      this.style.getPropertyValue("--ProgressBarThemeMinHeight") ||
      this.clientHeight ||
      "4"
    );
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
    return Number(this.getAttribute("maximum")) || 100;
  }
  set Maximum(value) {
    this.setAttribute("maximum", value.toString() || "100");
  }
  get Minimum() {
    return Number(this.getAttribute("minimum")) || 0;
  }
  set Minimum(value) {
    this.setAttribute("minimum", value.toString() || "0");
  }
  get Value() {
    return Number(this.getAttribute("value")) || 0;
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
  /** Called when the element is connected to the DOM */
  connectedCallback() {
    if (this._initialized) return;
    if (debug)
      console.log(
        `${this.connectedCallback.name}: Control initialized to`,
        this
      );
    this.#InitalizeControl();
    this.#UpdateForeground();
    this._initialized = true;
  }
  /** Called when an observed attribute of the element is changed
   * @param {string} name - Name of the changed attribute
   * @param {string} oldValue - Old value of the attribute
   * @param {string} newValue - New value of the attribute */
  attributeChangedCallback(name, oldValue, newValue) {
    if (debug) {
      console.log(
        `Attribute "${name}" changed from ${oldValue} to "${newValue}"`
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
    this.style.backgroundColor = this.Background;
    if (debug) {
      console.log(
        `${this.#UpdateBackground.name}: Background color set to ${
          this.Background
        } on`,
        this
      );
    }
  }
  #UpdateForeground() {
    this.style.color = this.Foreground;
  }
  #UpdateMaximum() {
    if (debug) {
      console.log(
        `${this.#UpdateMaximum.name}: Maximum value set to ${this.Maximum} on`,
        this
      );
    }
    this.ariaValueMax = `${this.Maximum}`;
  }
  #UpdateMinimum() {
    if (debug) {
      console.log(
        `${this.#UpdateMinimum.name}: Minimum value set to ${this.Minimum} on`,
        this
      );
    }
    this.ariaValueMin = `${this.Minimum}`;
  }
  #UpdateSizes() {
    this.style.setProperty("--width", `${this.Width}px`);
    this.style.height = `${this.Height}px`;
    if (debug) {
      console.log(
        `${this.#UpdateSizes.name}: Updated the width (${
          this.Width
        }px) and height (${this.Height}px) for`,
        this
      );
    }
  }
  #UpdateValue() {
    if (debug) {
      console.log(
        `${this.#UpdateValue.name}: Progress value set to ${this.Value} in`,
        this
      );
    }
    if (this.Value < this.Minimum) {
      if (debug) {
        console.warn(
          `${this.#UpdateValue.name}: The value ${
            this.Value
          } is less than the minimum ${this.Minimum}. Adjusting to the minimum.`
        );
      }
      this.setAttribute("value", this.Minimum.toString());
    }
    if (this.Value > this.Maximum) {
      if (debug) {
        console.warn(
          `${this.#UpdateValue.name}: The value ${
            this.Value
          } is greater than the maximum ${
            this.Maximum
          }. Adjusting to the maximum.`
        );
      }
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
    //this function is temporarily empty
  }

  #InitalizeControl() {
    if (debug)
      console.log(`${this.#InitalizeControl.name}: Initialized for`, this);
    this.role = "progressbar";
    this.ariaAtomic = "true"; // Indicates that the value of the ProgressBar is updated dynamically
    this.#UpdateVisibility();
    this.#UpdateSizes();
    this.#UpdateMaximum();
    this.#UpdateMinimum();
    this.#UpdateForeground();
    /** @type {string} HTML content of ProgressBar */
    const template = `<div id="IndeterminateRoot"><wuhc-border id="B5"><wuhc-ellipse id="E5"></wuhc-ellipse></wuhc-border><wuhc-rectangle></wuhc-rectangle><wuhc-border id="B4"><wuhc-ellipse id="E4"></wuhc-ellipse></wuhc-border><wuhc-rectangle></wuhc-rectangle><wuhc-border id="B3"><wuhc-ellipse id="E3"></wuhc-ellipse></wuhc-border><wuhc-rectangle></wuhc-rectangle><wuhc-border id="B2"><wuhc-ellipse id="E2"></wuhc-ellipse></wuhc-border><wuhc-rectangle></wuhc-rectangle><wuhc-border id="B1"><wuhc-ellipse id="E1"></wuhc-ellipse></wuhc-border></div><wuhc-border id="DeterminateRoot"><wuhc-rectangle id="ProgressBarIndicator"></wuhc-rectangle></wuhc-border>`;
    this.innerHTML = template;
    this.#UpdateValue(); // Updates the value after embedding the HTML
    if (debug)
      console.log(
        `${this.#InitalizeControl.name}: HTML embedded successfully in`,
        this
      );
  }
};

/**
 * `Windows.UI.Html.Controls.ProgressRing`
 *
 * Web version of ProgressRing from Windows 10
 */
Windows.UI.Html.Controls.ProgressRing = class extends HTMLElement {
  constructor() {
    super();
    /** @type {boolean} Avoid multiple initializations */
    this._initialized = false;
  }

  /**
   * Static method that defines the observed attributes
   * @description This method returns a list of attributes that the element will observe for changes.
   * @returns {string[]} List of observed attributes
   */
  static get observedAttributes() {
    return ["width", "height", "foreground", "isactive"];
  }
  get Width() {
    return Number(this.getAttribute("width")) || this.Height || 20;
  }

  set Width(value) {
    this.setAttribute("width", value.toString());
  }

  get Height() {
    return Number(this.getAttribute("height")) || this.Width || 20;
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
  /** Called when the element is connected to the DOM */
  connectedCallback() {
    if (!this._initialized) {
      if (debug) console.log(`${this.className} connected:`, this);
      this.#Initialize();
      this._initialized = true;
    }
  }

  /** Called when an observed attribute of the element is changed
   * @param {string} name Name of the changed attribute
   * @param {string} oldValue Previous value of the attribute
   * @param {string} newValue New value of the attribute */
  attributeChangedCallback(name, oldValue, newValue) {
    if (debug) {
      console.log(
        `Attribute "${name}" changed from ${oldValue} to "${newValue}"`
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

  /** Updates the size of the ProgressRing based on the `width` and `height` attributes */
  #UpdateSizes() {
    this.style.width = `${this.Width}px`;
    this.style.height = `${this.Height}px`;
    if (debug) {
      console.log(
        `${this.#UpdateSizes.name}: Updated the width (${
          this.Width
        }px) and height (${this.Height}px) for`,
        this
      );
    }
  }

  /** Updates the foreground color of the ProgressRing based on the `foreground` attribute */
  #UpdateForeground() {
    this.style.color = this.Foreground;
    if (debug) {
      console.log(
        `${this.#UpdateForeground.name}: Foreground color set to ${
          this.Foreground
        } for`,
        this
      );
    }
  }
  #UpdateVisibility() {
    this.style.visibility = this.IsActive ? "visible" : "collapse";
    if (debug)
      console.log(
        `${this.#UpdateVisibility.name}: Visibility updates to ${
          this.IsActive
        } for`,
        this
      );
  }
  /** Adds the HTML template to `<wuhc-progressring>` and updates its attributes */
  #Initialize() {
    if (debug) console.log(`${this.#Initialize.name}: Initialized for`, this);
    // Updates the attributes of the ProgressRing
    this.#UpdateForeground();
    this.#UpdateSizes();
    this.#UpdateVisibility();

    /** @type {string} HTML of ProgressRing */
    const template = `<div id="Ring"><wuhc-canvas id="E1R"><wuhc-ellipse id="E1" /></wuhc-canvas><wuhc-canvas id="E2R"><wuhc-ellipse id="E2" /></wuhc-canvas><wuhc-canvas id="E3R"><wuhc-ellipse id="E3" /></wuhc-canvas><wuhc-canvas id="E4R"><wuhc-ellipse id="E4" /></wuhc-canvas><wuhc-canvas id="E5R"><wuhc-ellipse id="E5" /></wuhc-canvas><wuhc-canvas id="E6R"><wuhc-ellipse id="E6" /></wuhc-canvas></div>`;
    this.innerHTML = template;

    if (debug) {
      console.log(
        `${this.#Initialize.name}: HTML template added successfully to`,
        this
      );
    }
  }
};

/* Exclusive area for defining custom elements.
  Recommended to keep this area at the end of the file.
  This ensures that the custom elements are defined after their classes are declared.
*/
customElements.define("wuhc-button", Windows.UI.Html.Controls.Button, {
  extends: "button",
});
customElements.define("wuhc-progressbar", Windows.UI.Html.Controls.ProgressBar);
customElements.define(
  "wuhc-progressring",
  Windows.UI.Html.Controls.ProgressRing
);

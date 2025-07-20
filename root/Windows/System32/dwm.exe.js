/**@type {HTMLElement} */
let desktopContainer;
/**@type {ShadowRoot} */
let desktop;
export async function loadCss(path, shadowRoot) {
  const sheet = new CSSStyleSheet();
  const css = await fetch("/Windows/System32/somedll.dll.css");
  sheet.replaceSync(await css.text());
  shadowRoot.adoptedStyleSheets.push(sheet);
}
const DWM = {
  createWindow: async function (
    opts = {
      id: "",
      maxButton: true,
      minButton: true,
      closeButton: true,
      isResizable: true,
      /**@type {string} */
      baseLayout,
      minW: 100,
      minH: 100,
      container: desktopContainer.shadowRoot,
    }
  ) {
    const container = opts.container || desktop;
    const layoutparser = new DOMParser();
    const win = document.createElement("div");
    container.appendChild(win);
    win.id = opts.id;
    win.attachShadow({ mode: "open" });
    const parsedLayout = layoutparser.parseFromString(
      opts.baseLayout,
      "text/html"
    );
    win.shadowRoot.appendChild(...parsedLayout.body.childNodes);
    // win.shadowRoot.loadCss = loadCss;
    return win.shadowRoot;
  },
};

globalThis.DWM = DWM;
export function main(procInstance) {
  desktopContainer = document.createElement("div");
  document.body.appendChild(desktopContainer);
  desktopContainer.id = "desktop";
  desktop = desktopContainer.attachShadow({ mode: "open" });
  desktop.host.setAttribute("system-use-light-theme", "0");
  desktop.host.setAttribute("use-transparency", "1");
}

const page = document.documentElement;
let nomax = {};
var topmost = [];
function disableIframes() {
  document.querySelectorAll("iframe:not(.nochages)").forEach((iframe) => {
    iframe.style.pointerEvents = "none";
    iframe.style.touchAction = "none";
  });
}

function enableIframes() {
  document.querySelectorAll("iframe:not(.nochages)").forEach((iframe) => {
    iframe.style.pointerEvents = "auto";
    iframe.style.touchAction = "auto";
  });
}
page.addEventListener("mousedown", disableIframes);
page.addEventListener("touchstart", disableIframes);
page.addEventListener("mouseup", enableIframes);
page.addEventListener("touchend", enableIframes);
page.addEventListener("touchcancel", enableIframes);
const ContentMode = {
  Iframe: "iframe",
  Shadow: "shadow",
};

class DesktopWindow {
  constructor(id) {
    this.id = id; // ID do App/janela
    this.title = ""; // Nome do app/janela
    this.allowMultiInstance = true; // Permite múltiplas instâncias
    this.isResizable = false;
    this.minW = 100;
    this.minH = 100;
    this.isMaximizable = true;
    this.isMinimizable = true;
    this.showDisabledWinActBtns = true;
    this.contentType = ContentMode.Shadow;
    this.iframeURL = ""; // URL do iframe, se for o caso
    this.simpleHTML = ""; // HTML simples, se for o caso
    // Outras propriedades padrão podem ser definidas aqui.
    this.windowElement = null;
    // Gera um id único para a instância
    this.instanceId = DesktopWindow.getNextInstanceId();
  }

  Create() {
    // Se não permitir múltiplas instâncias e já houver uma instância registrada, apenas foca nela.
    if (!this.allowMultiInstance) {
      const existing = DesktopWindow.instances[this.id];
      if (existing) {
        focwin(this.id);
        return existing.windowElement;
      }
    }

    const windowContainer = document.getElementById("dwm") || document.body;
    // Cria o elemento principal da janela
    const desktopWindow = document.createElement("div");
    const topbar = document.createElement("div");
    const windowActionButtons = document.createElement("div");
    const titbar = document.createElement("div");
    const minBtn = document.createElement("button");
    const closeBtn = document.createElement("button");
    const icon = document.createElement("img");
    const title = document.createElement("p");
    const contentContainer = document.createElement("div");

    windowContainer.appendChild(desktopWindow);
    desktopWindow.appendChild(topbar);
    topbar.appendChild(titbar);
    topbar.appendChild(windowActionButtons);
    titbar.appendChild(icon);
    titbar.appendChild(title);
    desktopWindow.appendChild(contentContainer);

    desktopWindow.classList.add("window", this.id);
    // Use o atributo "instance-id" para identificar a instância
    desktopWindow.setAttribute("instance-id", this.instanceId);

    // Cria a barra de título (topbar e titbar) com ícone e botões de controle
    topbar.classList.add("topbar");

    titbar.classList.add("titbar");

    windowActionButtons.classList.add("wbtgs");

    // Botão de minimizar
    if (this.isMinimizable) {
      minBtn.classList.add("wbtg");
      windowActionButtons.appendChild(minBtn);
      minBtn.addEventListener("click", () => minwin(this.id, this.instanceId));
    } else if (this.showDisabledWinActBtns) {
      const minBtn = document.createElement("button");
      windowActionButtons.appendChild(minBtn);
      minBtn.classList.add("wbtg", "disabled");
    }

    // Botão de maximizar
    if (this.isMaximizable) {
      const maxBtn = document.createElement("button");
      windowActionButtons.appendChild(maxBtn);
      maxBtn.classList.add("wbtg", "max");
      maxBtn.addEventListener("click", () => maxwin(this.id, this.instanceId));
    } else if (this.showDisabledWinActBtns) {
      const maxBtn = document.createElement("button");
      windowActionButtons.appendChild(maxBtn);
      maxBtn.classList.add("wbtg", "max", "disabled");
    }
    windowActionButtons.appendChild(closeBtn);

    // Botão de fechar
    closeBtn.classList.add("wbtg", "red");
    // Removemos o uso do setAttribute('click', ...) e utilizamos addEventListener para manter o contexto correto.
    closeBtn.addEventListener("click", () =>
      closewin(this.id, this.instanceId)
    );

    // Ícone da janela
    icon.src = `src/icons/?icon=${this.id}&dynamic=true`;
    icon.classList.add("icon");

    // Título
    title.textContent = this.title;

    // Cria o container para o conteúdo da janela
    contentContainer.classList.add("content");

    if (this.contentType === ContentMode.Iframe) {
      const iframe = document.createElement("iframe");
      contentContainer.appendChild(iframe);
      iframe.src = ""; // Valor padrão ou deixado em branco
      iframe.frameBorder = "0";
      iframe.width = "100%";
      iframe.height = "100%";
      if (!this.iframeURL) throw new Error("URL do iframe não definida.");
      else iframe.src = this.iframeURL;
    } else if (this.contentType === ContentMode.Shadow) {
      contentContainer.innerHTML = `<div>Conteúdo simples para ${this.title}</div>`;
    }

    // Se a janela for redimensionável, aplica a função makeResizable
    if (this.isResizable) {
      makeResizable(desktopWindow, this.minW, this.minH);
    }

    // Adiciona a janela ao container desejado (por exemplo, elemento com id "dwm")

    // Bind de eventos para drag (exemplo de bind na titbar para iniciar o arrasto)
    titbar.addEventListener("mousedown", (e) => {
      activeWindow = desktopWindow;
      document.body.classList.add("no-select");
      document.addEventListener("mouseup", stopDrag);
      let x = parseFloat(
        window
          .getComputedStyle(desktopWindow)
          .getPropertyValue("left")
          .replace("px", "")
      );
      let y = parseFloat(
        window
          .getComputedStyle(desktopWindow)
          .getPropertyValue("top")
          .replace("px", "")
      );

      if (y !== 0) {
        bfLeft = x;
        bfTop = y;
      }

      deltaLeft = e.clientX - x;
      deltaTop = e.clientY - y;

      page.onmousemove = win_move.bind(desktopWindow);
    });

    titbar.addEventListener("touchstart", (e) => {
      activeWindow = desktopWindow;
      document.body.classList.add("no-select");
      document.addEventListener("mouseup", stopDrag);

      let x = parseFloat(
        window
          .getComputedStyle(desktopWindow)
          .getPropertyValue("left")
          .replace("px", "")
      );
      let y = parseFloat(
        window
          .getComputedStyle(desktopWindow)
          .getPropertyValue("top")
          .replace("px", "")
      );

      if (y !== 0) {
        bfLeft = x;
        bfTop = y;
      }

      deltaLeft = e.targetTouches[0].clientX - x;
      deltaTop = e.targetTouches[0].clientY - y;

      page.ontouchmove = win_move.bind(desktopWindow);
    });
    // Atribui atributos inline para focar a janela, se necessário
    desktopWindow.addEventListener("mousedown", () =>
      focwin(this.id, this.instanceId)
    );
    desktopWindow.addEventListener("touchstart", () =>
      focwin(this.id, this.instanceId)
    );
    if (titbar) {
      // titbar.setAttribute('oncontextmenu', `return showcm(event,'titbar','${this.id}')`);
      if (!(this.id in nomax)) {
        titbar.addEventListener("dblclick", () =>
          maxwin(this.id, this.instanceId)
        );
      }
    }
    const wbtgs = windowActionButtons.querySelectorAll(".wbtg");
    wbtgs.forEach((wbtg) => {
      wbtg.addEventListener("mousedown", stop);
    });

    this.windowElement = desktopWindow;
    focwin(this.id, this.instanceId);
    showwin(this.id, this.instanceId);
    DesktopWindow.registerInstance(this);

    return desktopWindow;
  }

  close(instanceId) {
    // Verifica se o instanceId fornecido corresponde a esta instância
    if (this.instanceId !== instanceId) return;
    if (this.windowElement) {
      this.windowElement.classList.remove("notrans", "max", "show");
      setTimeout(() => {
        this.windowElement.classList.remove("show-begin");
        this.windowElement.remove();
      }, 200);
      DesktopWindow.removeInstance(this);
    }
  }

  // Registro de instâncias usando propriedade estática.
  static registerInstance(instance) {
    DesktopWindow.instances = DesktopWindow.instances || {};
    if (instance.allowMultiInstance) {
      if (!DesktopWindow.instances[instance.id]) {
        DesktopWindow.instances[instance.id] = [];
      }
      DesktopWindow.instances[instance.id].push(instance);
    } else {
      DesktopWindow.instances[instance.id] = instance;
    }
  }

  static removeInstance(instance) {
    if (!DesktopWindow.instances || !DesktopWindow.instances[instance.id])
      return;
    if (instance.allowMultiInstance) {
      DesktopWindow.instances[instance.id] = DesktopWindow.instances[
        instance.id
      ].filter((inst) => inst !== instance);
      if (DesktopWindow.instances[instance.id].length === 0) {
        delete DesktopWindow.instances[instance.id];
      }
    } else {
      delete DesktopWindow.instances[instance.id];
    }
  }

  // Método para gerar um id único para cada instância
  static getNextInstanceId() {
    DesktopWindow.instanceCounter = (DesktopWindow.instanceCounter || 0) + 1;
    return DesktopWindow.instanceCounter;
  }
}

class run extends DesktopWindow {
  constructor() {
    super("run");
    this.title = "Configurações";
    this.isResizable = true;
    this.minW = 502;
    this.minH = 332;
    this.contentType = ContentMode.Iframe;
    this.iframeURL = "/";
    this.allowMultiInstance = true;
  }
  init() {
    this.Create();
  }
}
function createAppInstance(appID) {
  // A chave será o nome da classe, conforme definida em DesktopWindow
  const appName = appID.id;

  // Verifica se o registro de instâncias já existe
  DesktopWindow.instances = DesktopWindow.instances || {};

  // Se não permitir multi-instance e já existir uma instância, apenas retorna a instância existente
  if (!appID.prototype.allowMultiInstance && DesktopWindow.instances[appName]) {
    return DesktopWindow.instances[appName];
  }

  // Caso contrário, cria uma nova instância
  const newInstance = new appID();
  newInstance.init(); // o método init deve chamar this.create().
  return newInstance;
}
function showwin(appID, instanceId) {
  const windowElement = document.querySelector(
    `.window.${appID}[instance-id="${instanceId}"]`
  );
  windowElement.classList.add("show-begin");
  windowElement.classList.add("show");
  setTimeout(() => {
    windowElement.classList.add("notrans");
  }, 200);
  if (appID !== "run") {
    windowElement.style.top = "10%";
    windowElement.style.left = "15%";
  } else {
    windowElement.style.top = "14.3%";
    windowElement.style.left = "8px";
  }
}
function closewin(appID, instanceId) {
  if (DesktopWindow.instances && DesktopWindow.instances[appID]) {
    const instRecord = DesktopWindow.instances[appID];
    if (Array.isArray(instRecord)) {
      // Procura a instância com o instance-id correspondente e a fecha
      const instance = instRecord.find(
        (inst) => inst.instanceId === instanceId
      );
      if (instance) {
        instance.close(instanceId);
      }
    } else {
      // Se só houver uma instância, fecha-a se o instance-id bater
      if (instRecord.instanceId === instanceId) {
        instRecord.close(instanceId);
      }
    }
  } else {
    console.error(
      `Nenhuma instância encontrada para ${appID} com instance-id: ${instanceId}`
    );
  }
}
function maxwin(appID, instanceId, trigger = true) {
  const windows = document.querySelectorAll(
    `.window.${appID}[instance-id="${instanceId}"]`
  );
  windows.forEach((windowElement) => {
    if (windowElement.classList.contains("max")) {
      windowElement.classList.remove("left", "right", "max");
      if (trigger) {
        setTimeout(() => {
          windowElement.classList.add("notrans");
        }, 200);
      } else {
        windowElement.classList.add("notrans");
      }

      if (
        windowElement.getAttribute("data-pos-x") !== "null" &&
        windowElement.getAttribute("data-pos-y") !== "null"
      ) {
        windowElement.style.left = windowElement.getAttribute("data-pos-x");
        windowElement.style.top = windowElement.getAttribute("data-pos-y");
      }
    } else {
      if (trigger) {
        windowElement.setAttribute("data-pos-x", windowElement.style.left);
        windowElement.setAttribute("data-pos-y", windowElement.style.top);
      }

      windowElement.classList.remove("notrans");
      windowElement.classList.add("max");
    }
  });
}

function minwin(appID) {
  console.log(appID);
  const windowElement = document.querySelector(
    `.window.${appID}[instance-id="${instanceId}"]`
  );
  const taskbarElement = document.querySelector(
    `#taskbar > .${appID}[instance-id="${instanceId}"]`
  );
  console.log(windowElement);
  if (windowElement.classList.contains("min")) {
    windowElement.classList.add("show-begin");
    focwin(appID);

    setTimeout(() => {
      if (taskbarElement) {
        // taskbarElement.classList.remove('min');
      }
      windowElement.classList.remove("min");
      if (windowElement.classList.contains("min-max")) {
        // windowElement.classList.add('max');
      }
      windowElement.classList.remove("min-max");
    }, 0);

    setTimeout(() => {
      if (!windowElement.classList.contains("max")) {
        windowElement.classList.add("notrans");
      }
    }, 200);
  } else {
    focwin(null);

    if (windowElement.classList.contains("max")) {
      windowElement.classList.add("min-max");
    }
    windowElement.classList.remove("foc");
    windowElement.classList.remove("max");

    if (taskbarElement) {
      // taskbarElement.classList.add('min');
    }
    windowElement.classList.add("min");
    windowElement.classList.remove("notrans");

    setTimeout(() => {
      windowElement.classList.remove("show-begin");
    }, 200);
  }
}

function makeResizable(element, minW = 100, minH = 100, size = 16) {
  // Reserva de configurações para cada borda/canto
  const resizers = [
    { edge: "top", cursor: "n-resize", adjust: { y: true, posY: true } },
    { edge: "bottom", cursor: "n-resize", adjust: { y: true } },
    { edge: "left", cursor: "e-resize", adjust: { x: true, posX: true } },
    { edge: "right", cursor: "e-resize", adjust: { x: true } },
    {
      edge: "top-left",
      cursor: "nw-resize",
      adjust: { x: true, posX: true, y: true, posY: true },
    },
    {
      edge: "top-right",
      cursor: "ne-resize",
      adjust: { x: true, y: true, posY: true },
    },
    {
      edge: "bottom-left",
      cursor: "sw-resize",
      adjust: { x: true, posX: true, y: true },
    },
    { edge: "bottom-right", cursor: "se-resize", adjust: { x: true, y: true } },
  ];

  // Função que cria o handler de mousedown para cada resizer
  function createMouseDownHandler(adjust) {
    return function (e) {
      if (e.button !== 0) return e.preventDefault();
      // Posições e dimensões iniciais
      const startX = e.clientX;
      const startY = e.clientY;
      const rect = element.getBoundingClientRect();
      const startLeft = rect.left;
      const startTop = rect.top;
      const startW = rect.width;
      const startH = rect.height;

      function onMouseMove(e) {
        if (adjust.x) {
          let newWidth;
          if (adjust.posX) {
            // Arrastando a borda esquerda: redimensiona e move a janela
            newWidth = startW - (e.clientX - startX);
            if (newWidth < minW) {
              newWidth = minW;
              element.style.left = startLeft + (startW - minW) + "px";
            } else {
              element.style.left = startLeft + (e.clientX - startX) + "px";
            }
          } else {
            // Arrastando a borda direita
            newWidth = startW + (e.clientX - startX);
          }
          if (newWidth < minW) newWidth = minW;
          element.style.width = newWidth + "px";
        }

        if (adjust.y) {
          let newHeight;
          if (adjust.posY) {
            // Arrastando a borda superior
            newHeight = startH - (e.clientY - startY);
            if (newHeight < minH) {
              newHeight = minH;
              element.style.top = startTop + (startH - minH) + "px";
            } else {
              element.style.top = startTop + (e.clientY - startY) + "px";
            }
          } else {
            // Arrastando a borda inferior
            newHeight = startH + (e.clientY - startY);
          }
          if (newHeight < minH) newHeight = minH;
          element.style.height = newHeight + "px";
        }
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };
  }

  resizers.forEach(({ edge, cursor, adjust }) => {
    const resizer = document.createElement("div");
    // Define as dimensões do resizer
    resizer.style.width =
      edge.includes("left") || edge.includes("right")
        ? size + "px"
        : `calc(100% + ${size - 8}px)`;
    resizer.style.height =
      edge.includes("top") || edge.includes("bottom")
        ? size + "px"
        : `calc(100% + ${size - 8}px)`;
    resizer.style.backgroundColor = "transparent";
    resizer.style.position = "absolute";
    // Define a posição do resizer
    resizer.style[edge.split("-")[0]] =
      edge.includes("top") || edge.includes("left") ? "-10px" : "0px";
    resizer.style[edge.split("-")[1]] =
      edge.includes("bottom") || edge.includes("right") ? "-10px" : "0px";
    resizer.style.cursor = cursor;

    // Associa o handler criado pela função factory
    resizer.addEventListener("mousedown", createMouseDownHandler(adjust));
    element.appendChild(resizer);
  });
}
// Global para ordem das janelas (cada item é "appID-instanceId")
let wo = [];
// Lista extra (opcional) para janelas "topmost"
// var topmost = [];

function orderwindow() {
  for (let i = 0; i < wo.length; i++) {
    // Obtém o item na forma "appID-instanceId"
    const compositeId = wo[wo.length - i - 1]; // o último item tem z-index maior
    // Divide a chave composta para obter appID e instanceId
    const [appID, instanceId] = compositeId.split("-");
    // Busca a janela correspondente usando o seletor com [instance-id="..."]
    const win = document.querySelector(
      `.window.${appID}[instance-id="${instanceId}"]`
    );
    if (win) {
      // Se o app estiver na lista "topmost", incrementa o z-index
      if (topmost.includes(appID)) {
        win.style.zIndex = 10 + i + 50;
      } else {
        win.style.zIndex = 10 + i;
      }
    }
  }
}

function focwin(appID, instanceId) {
  // Remove o foco da janela que está atualmente em primeiro (se houver)
  const firstWindowComposite = wo[0];
  if (firstWindowComposite) {
    const [firstApp] = firstWindowComposite.split("-");
    const firstWindow = document.querySelector(
      `.window.${firstApp}[instance-id="${firstWindowComposite.split("-")[1]}"]`
    );
    if (firstWindow) {
      firstWindow.classList.remove("foc");
    }
  }
  // Constrói a chave composta
  const compositeId = `${appID}-${instanceId}`;
  // Remove a chave do array, se já existente
  const index = wo.indexOf(compositeId);
  if (index !== -1) {
    wo.splice(index, 1);
  }
  // Insere a chave no início (janela em foco)
  wo.unshift(compositeId);
  // Atualiza os z-index conforme a ordem
  orderwindow();
  // Faz a query da janela com o seletor composto e adiciona a classe de foco
  const targetWindow = document.querySelector(
    `.window.${appID}[instance-id="${instanceId}"]`
  );
  if (targetWindow) {
    targetWindow.classList.add("foc");
  }
}
const titbars = document.querySelectorAll(".window>.titbar");
const wins = document.querySelectorAll(".window");
let deltaLeft = 0,
  deltaTop = 0,
  fil = false,
  filty = "none",
  bfLeft = 0,
  bfTop = 0;
// isDragging = false;

function win_move(e) {
  if (!this || !this.style) return; // Add this guard clause
  let cx, cy;
  if (e.type === "touchmove") {
    cx = e.targetTouches[0].clientX;
    cy = e.targetTouches[0].clientY;
  } else {
    cx = e.clientX;
    cy = e.clientY;
  }

  this.style.left = `${cx - deltaLeft}px`;
  this.style.top = `${cy - deltaTop}px`;

  if (cy <= 0) {
    this.style.left = `${cx - deltaLeft}px`;
    this.style.top = `${-deltaTop}px`;
    if (!(this.classList[1] in nomax)) {
      const fillElement = document.getElementById("window-fill");
      if (fillElement) {
        fillElement.classList.add("top");
        setTimeout(() => {
          fillElement.classList.add("fill");
        }, 0);
      }
      fil = this;
      filty = "top";
    }
  } else if (cx <= 0) {
    this.style.left = `${-deltaLeft}px`;
    this.style.top = `${cy - deltaTop}px`;
    if (!(this.classList[1] in nomax)) {
      const fillElement = document.getElementById("window-fill");
      if (fillElement) {
        fillElement.classList.add("left");
        setTimeout(() => {
          fillElement.classList.add("fill");
        }, 0);
      }
      fil = this;
      filty = "left";
    }
  } else if (cx >= document.body.offsetWidth - 2) {
    this.style.left = `calc(100% - ${deltaLeft}px)`;
    this.style.top = `${cy - deltaTop}px`;
    if (!(this.classList[1] in nomax)) {
      const fillElement = document.getElementById("window-fill");
      if (fillElement) {
        fillElement.classList.add("right");
        setTimeout(() => {
          fillElement.classList.add("fill");
        }, 0);
      }
      fil = this;
      filty = "right";
    }
  } else if (fil) {
    const fillElement = document.getElementById("window-fill");
    if (fillElement) {
      fillElement.classList.remove("fill");
      setTimeout(() => {
        fillElement.classList.remove("top", "left", "right");
      }, 200);
    }
    fil = false;
    filty = "none";
  } else if (this.classList.contains("max")) {
    deltaLeft =
      (deltaLeft / (this.offsetWidth - 45 * 3)) *
      (0.7 * document.body.offsetWidth - 45 * 3);
    maxwin(this.classList[1], this.getAttribute("instance-id"), false);
    this.style.left = `${cx - deltaLeft}px`;
    this.style.top = `${cy - deltaTop}px`;

    const maxButton = document.querySelector(
      `.window.${this.classList[1]} > .titbar > div > .wbtg.max`
    );
    if (maxButton) {
      maxButton.innerHTML = "W";
    }
    this.classList.add("notrans");
  }
}
let activeWindow = null;
function stopDrag() {
  document.body.classList.remove("no-select");
  document.removeEventListener("mouseup", stopDrag);
  activeWindow = null;
}

page.addEventListener("mouseup", () => {
  page.onmousemove = null;

  if (fil) {
    if (filty === "top") {
      maxwin(fil.classList[1], fil.getAttribute("instance-id"), false);
    } else if (filty === "left") {
      fil.classList.add("left");
      maxwin(fil.classList[1], fil.getAttribute("instance-id"), false);
    } else if (filty === "right") {
      fil.classList.add("right");
      maxwin(fil.classList[1], fil.getAttribute("instance-id"), false);
    }

    setTimeout(() => {
      const fillElement = document.querySelector("#window-fill");
      if (fillElement) {
        fillElement.classList.remove("fill", "top", "left", "right");
      }
    }, 200);

    const windowElement = document.querySelector(`.window.${fil.classList[1]}`);
    if (windowElement) {
      windowElement.setAttribute("data-pos-x", `${bfLeft}px`);
      windowElement.setAttribute("data-pos-y", `${bfTop}px`);
    }

    fil = false;
  }
});

page.addEventListener("touchend", () => {
  page.ontouchmove = null;

  if (fil) {
    if (filty === "top") {
      maxwin(fil.classList[1], fil.getAttribute("instance-id"), false);
    } else if (filty === "left") {
      maxwin(fil.classList[1], fil.getAttribute("instance-id"), false);
      fil.classList.add("left");
    } else if (filty === "right") {
      maxwin(fil.classList[1], fil.getAttribute("instance-id"), false);
      fil.classList.add("right");
    }

    setTimeout(() => {
      const fillElement = document.querySelector("#window-fill");
      if (fillElement) {
        fillElement.classList.remove("fill", "top", "left", "right");
      }
    }, 200);

    setTimeout(() => {
      const windowElement = document.querySelector(
        `.window.${fil.classList[1]}`
      );
      if (windowElement) {
        windowElement.setAttribute("data-pos-x", `${bfLeft}px`);
        windowElement.setAttribute("data-pos-y", `${bfTop}px`);
      }
    }, 200);

    if (fil) {
      fil.style.left = `${bfLeft}px`;
      fil.style.top = `${bfTop}px`;
    }
    fil = false;
  }
});

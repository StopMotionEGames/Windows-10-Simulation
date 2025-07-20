globalThis.ntoskrnl = this;
globalThis.FileType = {
  Script: "script",
  Stylesheet: "style",
  Image: "image",
  Audio: "audio",
  Video: "video",
  Text: "text",
  TS: "typescript",
};

export class NTKernel {
  #debug = true;
  constructor() {
    // this.#debug = true;
    /** @type {Set<string>}*/
    this.criticalFiles = new Set();
    /**@type {boolean} */
    this.bugchecked = false;
    /**@type {boolean} */
    this._isBooting = false;

    this.main();
  }

  set IsBooting(boolean) {
    this._isBooting = boolean;
    const ev = new Event("BootingStateChange");
    ntoskrnl.dispatchEvent(ev);
  }
  async main() {
    window.onerror = (message, source, lineno, colno, error) => {
      // Get file name using Error.stack
      const errorStack = error.stack;
      const stackLines = errorStack.split("\n");
      const fileLine = stackLines.find(
        (line) =>
          line.includes(".js") ||
          line.includes(".html") ||
          line.includes(".css")
      );
      var file = fileLine ? fileLine.split("/").pop().split(":")[0] : "index";
      let stopCode = null;
      switch (error.name) {
        case "SyntaxError":
          stopCode = "0x00000001";
          break;
        case "ReferenceError":
          stopCode = "0x00000002";
          break;
        case "TypeError":
          stopCode = "0x00000003";
          break;
        case "RangeError":
          stopCode = "0x00000004";
          break;
        case "Critical File Not Found":
          stopCode = "0x00000005";
          break;
        case "0x00000064":
          stopCode = "0x00000064";
          break;
        default:
          break;
      }
      if (stopCode !== null) this.BugCheck(file, stopCode, error);
      return this.bugchecked;
    };
    await this.LoadFont(
      "/Windows/Boot/Resources/Fonts/segoe_slboot.ttf",
      "Segoe Boot Semilight",
      async () => {
        window.bootResouces = await this.LoadLibrary(
          "/Windows/Boot/Resources/bootres.dll.json"
        );
        window.dispatchEvent(new Event("BootResourdesLoaded"));
        if (this._isBooting) {
          const breakpoints = [
            { maxWidth: 640, image: window.bootResouces.winlogo1 },
            { maxWidth: 800, image: window.bootResouces.winlogo2 }, // 640x480, 800x600
            { maxWidth: 1280, image: window.bootResouces.winlogo3 }, // 1024x768
            { maxWidth: 1600, image: window.bootResouces.winlogo3 }, // 1366x768, 1600x900
            { maxWidth: 2560, image: window.bootResouces.winlogo4 }, // 1920x1080, 2560x1440
            { maxWidth: Infinity, image: window.bootResouces.winlogo5 }, // 4K+
          ];

          function chooseLogo() {
            const viewportWidth = window.innerWidth;
            const selected = breakpoints.find(
              (bp) => viewportWidth <= bp.maxWidth
            );
            bootLogo.src = selected.image;
          }
          window.addEventListener("resize", chooseLogo);
          const loadBody = document.createElement("div");
          document.body.appendChild(loadBody);
          loadBody.id = "loadBody";

          const aTF = document.createElement("div");
          loadBody.appendChild(aTF);
          aTF.classList.add("aTF");

          const anm = document.createElement("div");
          loadBody.appendChild(anm);
          anm.classList.add("anm");

          const logo = document.createElement("div");
          anm.appendChild(logo);
          logo.classList.add("logo");

          const bootLogo = document.createElement("img");
          logo.appendChild(bootLogo);
          bootLogo.id = "boot-logo";
          bootLogo.alt = " ";
          bootLogo.ariaLabel =
            "Logotipo do Windows 10. Logo do Windows que aparece na tela de inicialização do Windows.";
          chooseLogo();

          const loadFlex = document.createElement("div");
          anm.appendChild(loadFlex);
          loadFlex.classList.add("loadFlex");

          const load = document.createElement("div");
          loadFlex.appendChild(load);
          load.id = "load";

          const loadText = document.createElement("div");
          load.appendChild(loadText);
          loadText.id = "loadText";
          loadText.textContent = " ";
          setTimeout(()=>{
            loadText.textContent = "Instalando atualizações... 999 minutos restantes";
          }, 4000);
          // loadText.textContent = " Windows is still under development";

          const loadAnm = document.createElement("div");
          document.getElementById("load").appendChild(loadAnm);
          loadAnm.id = "loadAnm";
          loadAnm.ariaBusy = true;
          loadAnm.ariaLabel =
            "Animação de inicialização do Windows 10. Descrição: 5 pontinhos brancos orbitando um eixo imaginário indefinidamente. A animação dura 3.7 segundos, os pontinhos aparecem sequencialmente e rapidamente, fazem duas voltas completas, na segunda eles desaparecem rapidamente e sequencialmente e após meio segundo reinicia a animação";
          loadAnm.style.setProperty("--W10Boot", "3.7s W10Boot linear infinite");
        }
      }
    );
  }
  async LoadLibrary(path) {
    try {
      const content = await fetch(path);
      if (!content.ok)
        throw new Error(`Falha ao carregar DLL: ${content.status}`);
      const lib = await content.json();
      return lib;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async LoadFont(url, name, callback) {
    try {
      const font = new FontFace(`${name}`, `url(${url})`);
      document.fonts.add(font);
      await font.load();

      document.fonts.ready.then(() => {
        if (document.fonts.check(`1em ${name}`) && callback) {
          callback();
        } else {
          console.warn(
            `A fonte "${name}" não pôde ser verificada corretamente.`
          );
        }
        console.log("Fontes carregadas:");
        document.fonts.forEach((font) => {
          console.log(
            `Família: ${font.family}, Estilo: ${font.style}, Peso: ${font.weight}`
          );
        });
      });
    } catch (error) {
      console.error(`Erro ao carregar a fonte "${name}":`, error);
    }
  }
  async BugCheck(whatFailed, stopCode, error) {
    if (this.bugchecked) return;
    else this.bugchecked = true;
    document.body.removeAttribute("style");
    // Mapeamento de códigos friendly (opcional)
    const friendlyCodes = {
      "0x00000001": "SYNTAX_ERROR",
      "0x00000002": "REFERENCE_ERROR",
      "0x00000003": "TYPE_ERROR",
      "0x00000004": "RANGE_ERROR",
      "0x00000005": "CRITICAL_FILE_NOT_FOUND",
      "0x00000064": "BOOT_TIME_EXCEEDED",
    };
    const friendlyName = friendlyCodes[stopCode] || stopCode.toString();
    function getDeepestChild(element) {
      if (element.children.length === 0) return element;
      return getDeepestChild(element.children[0]);
    }
    async function pauseElements() {
      const elements = Array.from(document.body.querySelectorAll("*"));
      await Promise.all(
        elements.map(async (el) => {
          el.style.animationPlayState = "paused";
          el.style.cursor = "default";
          el.style.setProperty("--playState", "paused");
        })
      );
      console.log("Paused elements");
    }
    function a() {
      const headFC = document.querySelector("head").firstChild;
      if (headFC) {
        document.head.removeChild(headFC);
        setTimeout(() => {
          a();
        }, 0);
      }
      if (!headFC) {
        document.dispatchEvent(new Event("continueafterhead"));
      }
    }
    function b() {
      // document.querySelectorAll("img").forEach((img) => {
      //   img.remove();
      // });
      if (document.body.children.length > 0) {
        const deepestElement = getDeepestChild(document.body);
        if (deepestElement) {
          deepestElement.parentNode.removeChild(deepestElement);
          setTimeout(b, 0);
        } else {
          document.dispatchEvent(new Event("continueafterbody"));
        }
      }
      if (document.body.children.length === 0) {
        clearTimeout(b);
        document.dispatchEvent(new Event("continueafterbody"));
      }
    }
    await pauseElements();
    b();
    document.addEventListener("continueafterbody", () => a());
    document.addEventListener("continueafterhead", () => {
      const s = document.createElement("style");
      document.head.appendChild(s);
      console.log("continueafterbody");
      s.innerHTML = `body{user-select:none;overflow:hidden;flex-direction:column;width:calc(1024px - 135px);height:768px;display:flex;justify-content:center;margin:0;padding-block:0;padding-left:135px;background:#0078d7;font-family:"Segoe Boot Semilight";color:#fff;background-image:none!important;font-weight:200;transform-origin:top left}html{background:#0078d7!important;display:flex;align-items:center;height:100dvh}#\:\)::before{content:":|"}.bsod0{font-size:147px;font-weight:400;margin-top: 76px}.bsod0 a::before{content:":("}.bsod0 a:hover::before{content:":)"!important}a{text-decoration:none;color:#fff}p{line-height:42px;font-size:26.5px;margin-block:8px;text-overflow:ellipsis;letter-spacing:.5px;word-spacing:.8px;margin-left:12px;margin-bottom:10px}.bsod3{margin-block:16px;display:flex;height:inherit;margin-left:12px}.bsod4{flex-direction:column;margin-inline:18.5px;display:flex;max-width:512px!important;line-height:24px;letter-spacing:.3px;word-spacing:1px;font-size:13px;}.bsod5{margin-bottom:0px;font-size:11px;line-height:22px}.bsod6{margin-bottom:24px;}img{margin-top:5px;font-size:10px;width:117px;height:fit-content}`;
      stopCode = friendlyCodes[stopCode] || stopCode;
      const meta1 = document.createElement("meta");
      meta1.charset = "UTF-8";
      const meta2 = document.createElement("meta");
      meta2.name = "viewport";
      meta2.content =
        "width=device-width, initial-scale=1.0, height=device-height";
      document.head.appendChild(meta1);
      document.head.appendChild(meta2);
      if (!window.bootResouces)
        window.addEventListener("BootResourcesLoaded", () => printBSOD);
      else printBSOD();
      function printBSOD() {
        document.body.innerHTML = `
        <div class="bsod0"><a href="/"></a></div>
        <div class="bsod1">
        <p>
        O dispositivo encontrou um problema e precisa ser reiniciado. Estamos coletando algumas informações sobre o erro e, em seguida, reiniciaremos para você.
        </p>
        </div>
        <div class="bsod2"><p>Nada para coletar</p></div>
        <div class="bsod3">
        <img src="${window.bootResouces.qrcode4}" alt="">
        <div class="bsod4">
        <div class="bsod6">
        Para obter mais informações sobre esse problema e as possíveis correções, visite https://www.windows.com/stopcode
        </div>
        <div class="bsod5">
        Se você ligar para o suporte, forneça estas informações:
        </div>
        <div class="bsod5">
        O que falhou: ${whatFailed}
        </div>
        <div class="bsod5">
        Código de parada: ${stopCode}
        </div>
         <div class="bsod5">
        ${error}
        </div>
        </div>
        </div>`;
      }
      console.error(
        "Critical error in",
        whatFailed,
        "with stop code",
        friendlyName,
        error
      );
      window.setInterval = () => {
        return;
      };
      window.requestAnimationFrame = () => {
        return 0;
      };
      window.addEventListener = () => {
        return;
      };
      document.addEventListener = () => {
        return;
      };

      window.onclick = null;
      document.onclick = null;
    });
  }

  /**
   * Loads a resource from a File URL asynchronously and injects it into the document.
   * @param {string} path - The URL of the resource to be loaded.
   * @param {Object} Options - Options for loading.
   * @param {("script"|"stylesheet"|"image"|"audio"|"video")} [Options.Type=FileType.Script] - The type of resource. It's safer using FileType enum (e.g. FileType.Script).
   * @param {boolean} [Options.IsCritical=false] - If true, the loaded element is marked as critical ("sys-critical") and errors trigger a BugCheck.
   * @param {boolean} [Options.AutoAppend=true] - If true, the element is automatically appended to the DOM (head for Script/Stylesheet, body for other types); otherwise, it is returned for manual insertion.
   * @param {(0|1|2)} [Options.Priority=0] - Values: 0, 1, 2 | 0 = auto, 1 = low and 2 = high
   */
  async ReadFile(path, Options = {}) {
    const type = Options.Type || FileType.Script;
    const isCritical = !!Options.IsCritical;
    const autoAppend =
      Options.AutoAppend === undefined ? true : Options.AutoAppend;
    const priority =
      Options.Priority === null ||
      Options.Priority === undefined ||
      isNaN(Options.Priority)
        ? "auto"
        : Options.Priority === 0
        ? "auto"
        : Options.Priority === 1
        ? "low"
        : Options.Priority === 2
        ? "high"
        : "auto";

    // Cria o elemento de preload para carregar o recurso
    if (type != FileType.Text) {
      const preloadEl = document.createElement("link");
      preloadEl.rel = "preload";
      preloadEl.href = path;
      if (type == FileType.TS) preloadEl.as = "script";
      else preloadEl.as = type;
      preloadEl.fetchPriority = priority;
      if (isCritical) {
        preloadEl.setAttribute("sys-critical", "");
      }

      return new Promise((resolve, reject) => {
        preloadEl.onerror = () => {
          const error = new Error(`Failed to preload resource: ${path}`);
          error.name = "Critical File Not Found";
          if (isCritical) {
            setTimeout(() => {
              throw error;
            }, 0);
            reject(error);
          } else {
            resolve(null);
          }
        };

        preloadEl.onload = () => {
          let elem;
          switch (type) {
            case FileType.Script:
              elem = document.createElement("script");
              elem.src = path;
              if (isCritical) elem.setAttribute("sys-critical", "");
              break;
            case FileType.Stylesheet:
              elem = document.createElement("link");
              elem.rel = "stylesheet";
              elem.href = path;
              if (isCritical) elem.setAttribute("sys-critical", "");
              break;
            case FileType.Image:
              elem = document.createElement("img");
              elem.src = path;
              if (isCritical) elem.setAttribute("sys-critical", "");
              break;
            case FileType.Audio:
              elem = document.createElement("audio");
              elem.src = path;
              elem.controls = true;
              if (isCritical) elem.setAttribute("sys-critical", "");
              break;
            case FileType.Video:
              elem = document.createElement("video");
              elem.src = path;
              elem.controls = true;
              if (isCritical) elem.setAttribute("sys-critical", "");
              break;
            case FileType.TS:
              elem = document.createElement("script");
              elem.src = path;
              elem.type = "text/typescript";
              if (isCritical) elem.setAttribute("sys-critical", "");
              break;
            default:
              elem = document.createElement("script");
              elem.src = path;
              if (isCritical) elem.setAttribute("sys-critical", "");
          }

          if (autoAppend) {
            if (
              type === FileType.Script ||
              type === FileType.Stylesheet ||
              type === FileType.TS
            ) {
              document.head.appendChild(elem);
            } else {
              resolve(elem);
            }
          }

          resolve(elem);
        };

        document.head.appendChild(preloadEl);
      });
    } else {
      // Para FileType.Text, usamos fetch para obter o conteúdo como texto
      try {
        const response = await fetch(path, { priority: priority });
        if (!response.ok) {
          const error = new Error(`Failed to fetch text content: ${path}`);
          error.name = "Critical File Not Found";
          if (isCritical) {
            setTimeout(() => {
              throw error;
            }, 0);
            return Promise.reject(error);
          } else {
            return null;
          }
        }

        const textContent = await response.text();
        return Promise.resolve(textContent);
      } catch (error) {
        if (isCritical) {
          setTimeout(() => {
            throw error;
          }, 0);
          return Promise.reject(error);
        } else {
          return null;
        }
      }
    }
  }
  /** Reboot the System with a specified timeout.
   * @param {number} timeout - The time in milliseconds before rebooting the system.
   *
   * If set to 0 or not specified, the system will reboot immediately. */
  Reboot(timeout = 0) {
    if (timeout < 0) timeout *= -1;
    if (timeout > 0) {
      setTimeout(() => {
        window.location.reload();
      }, timeout);
    } else {
      window.location.reload();
    }
  }
  /** Close the document with a specified timeout.
   * @param {number} timeout - The time in milliseconds before closing the document. */
  Shutdown(timeout) {
    if (timeout < 0) timeout *= -1;
    if (timeout > 0) {
      setTimeout(() => {
        document.body.style.color = "white";
        document.head
          .querySelectorAll("*:not(title):not(meta)")
          .forEach((el) => {
            el.remove();
          });
        document.body.innerHTML = "<p>It's now safe to turn off your computer";
      }, timeout);
    } else {
      document.body.style.color = "white";
      document.head.querySelectorAll("*:not(title):not(meta)").forEach((el) => {
        el.remove();
      });
      document.body.innerHTML = "<p>It's now safe to turn off your computer";
    }
  }
}
export class Registry {
  #openHandles = new Map();
  #nextHandle = 1;

  async RegOpenKey(hKey, subKey) {
    const url = `/registry/${hKey}/${subKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const handle = this.#nextHandle++;
    this.#openHandles.set(handle, data);
    return handle;
  }
  RegEnumKey(handle) {
    const keyData = this.#openHandles.get(handle);
    return Object.keys(keyData).filter(
      (key) =>
        typeof keyData[key] === "object" &&
        Object.keys(keyData[key]).length === 0 // Objeto vazio = subchave
    );
  }
  RegCloseKey(handle) {
    this.#openHandles.delete(handle);
  }

  RegQueryValue(handle, valueName) {
    const keyData = this.#openHandles.get(handle);
    if (!keyData) return null;

    const value = keyData[valueName];

    // Se o valor tem tipo e dados, retorne formatado
    if (value?.type && value.data !== undefined) {
      return {
        type: value.type,
        data: this.#parseValue(value.type, value.data),
      };
    }
    return value;
  }

  RegEnumValue(handle) {
    const keyData = this.#openHandles.get(handle);
    return Object.entries(keyData)
      .filter(([_, value]) => value?.type && value?.data !== undefined)
      .map(([name, value]) => ({
        name,
        type: value.type,
        data: this.#parseValue(value.type, value.data),
      }));
  }
  #parseValue(type, data) {
    switch (type) {
      case "REG_DWORD":
        return parseInt(data, 10);
      case "REG_SZ":
      case "REG_EXPAND_SZ":
        return String(data);
      case "REG_MULTI_SZ":
        return Array.isArray(data) ? data : [data];
      case "REG_BINARY":
        return Buffer.from(data, "hex");
      default:
        return data;
    }
  }
}
class ProcessManager {
  constructor() {
    this.lastPID = 0;
    this.processes = {};
    // Aqui, poderíamos ter um cache global para DLLs,
    // mas neste exemplo não vamos compartilhar kernel32, para simular o comportamento do Windows.
    this.sharedDllCache = {};
  }

  generatePID() {
    return ++this.lastPID;
  }

  // Cria um processo com um nome, caminho do executável e, opcionalmente, um PPID.
  ProcessCreate(name, exePath, ppid = null) {
    const pid = this.generatePID();
    const process = new Process(pid, ppid, name, exePath, this);
    this.processes[pid] = process;
    return process;
  }
}

export class Process {
  constructor(pid, ppid, name, execPath, manager) {
    this.pid = pid;
    this.ppid = ppid;
    this.name = name;
    this.execPath = execPath;
    this.manager = manager;
    this.dlls = {}; // Armazena as DLLs carregadas

    this.LoadImage();
  }
  // Método para carregar o executável e suas dependências...
  async LoadImage() {
    // Carrega o executável
    const module = await import(this.execPath);
    
    console.log("Executável carregado.");

    // Carrega cada dependência conforme definido no 'include'
    const deps = module.include || {};
    for (const depName in deps) {
      const config = deps[depName];
      if (config.type.includes("JSON")) {
        await this.LoadResource(depName, config, "logo", true);
      } else if (config.type.includes("CSS")) {
        await this.LoadGrahphicResource(config.path, document.body);
      } else {
        const shared = config.path.includes("Kernel32") ? false : true;
        let dll = await this.LoadDll(depName, config, shared);
      }
    }

    // Agora que todas as DLLs foram carregadas e injetadas, chama main()
    if (module && typeof module.main === "function") {
      module.main(this);
    }
    Object.assign(this, module);
  }
  async LoadDll(dllName, dllConfig, shared = false) {
    console.log(`Carregando DLL ${dllName} de ${dllConfig.path}`);
    let dllModule;
    if (shared) {
      if (this.manager.sharedDllCache[dllConfig.path]) {
        dllModule = this.manager.sharedDllCache[dllConfig.path];
        console.log(`DLL ${dllName} carregada do cache compartilhado.`);
      } else {
        dllModule = await import(dllConfig.path);
        this.manager.sharedDllCache[dllConfig.path] = dllModule;
        console.log(`DLL ${dllName} carregada e cacheada.`);
      }
    } else {
      // Uso de cache busting para forçar um carregamento individual
      dllModule = await import(dllConfig.path + `?t=${Date.now()}`);
      console.log(`DLL ${dllName} carregada individualmente.`);
    }

    // Se o módulo exportar o caminho do CSS, carrega-o.
    if (dllModule.styleUrl) {
      await loadCss(dllModule.styleUrl, this.graphicContainer);
      console.log(`CSS para ${dllName} carregado de ${dllModule.styleUrl}`);
    }
    Object.assign(this, dllModule);
    this.dlls[dllName] = dllModule;
    return dllModule;
  }

  async LoadResource(dllName, dllConfig, resourceKey, shared = false) {
    console.log(`Carregando recurso da DLL ${dllName} de ${dllConfig.path}`);
    let resourceData;
    if (shared) {
      if (this.manager.sharedDllCache[dllConfig.path]) {
        resourceData = this.manager.sharedDllCache[dllConfig.path];
        console.log(
          `Recurso da DLL ${dllName} carregado do cache compartilhado.`
        );
      } else {
        const response = await fetch(dllConfig.path);
        resourceData = await response.json();
        this.manager.sharedDllCache[dllConfig.path] = resourceData;
        console.log(`Recurso da DLL ${dllName} carregado e cacheado.`);
      }
    } else {
      const response = await fetch(dllConfig.path);
      resourceData = await response.json();
      console.log(`Recurso da DLL ${dllName} carregado individualmente.`);
    }

    const recurso = resourceData[resourceKey];
    if (recurso) {
      console.log(`Recurso "${resourceKey}" encontrado.`);
      const img = document.createElement("img");
      img.src = recurso;
      this.contentContainer.appendChild(img);
    } else {
      console.log(`Recurso "${resourceKey}" não encontrado.`);
    }
    return resourceData;
  }
  async LoadGrahphicResource(path, container) {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = path;
      link.onload = () => resolve();
      link.onerror = (err) => reject(err);
      container.appendChild(link);
    });
  }

  // Método para limpar e encerrar o processo
  terminate() {
    console.log(`Encerrando processo ${this.name}...`);
    if (this.hostElement && this.hostElement.parentNode) {
      this.hostElement.parentNode.removeChild(this.hostElement);
      console.log("Container gráfico removido.");
    }

    // Remove referência do processo do ProcessManager:
    if (this.manager && this.manager.processes[this.pid]) {
      delete this.manager.processes[this.pid];
    }

    // Limpa referências internas para permitir a coleta de lixo.
    this.dlls = null;
    this.contentContainer = null;
    this.graphicContainer = null;
    this.hostElement = null;

    console.log("Processo encerrado com sucesso.");
  }
}

// Função auxiliar para carregar o CSS dinamicamente:
async function loadCss(url, container) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = () => resolve();
    link.onerror = (err) => reject(err);
    container.appendChild(link);
  });
}
const _kernel = new NTKernel();
const _procmgr = new ProcessManager();
globalThis.__KERNEL__ = _kernel;
globalThis.__ProcMgr__ = _procmgr;
__ProcMgr__.ProcessCreate(
  "Session Manager Subsystem",
  "/Windows/System32/smss.exe.js"
);
export let b = await import("/testing-area/desktop/explorer.exe.js")
export let a = await import("./KernelBase.dll.js")
b = a;

// __ProcMgr__.processes[1].__smss__.CreateSession("SYSTEM", "AUTRORIDADE NT/Sistema", {});

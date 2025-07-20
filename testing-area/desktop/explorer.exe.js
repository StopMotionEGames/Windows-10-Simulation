/// <reference path="../../root/Windows/System32/ntoskrnl.exe.js" />
export const include = {
  KernelBase: { path: "/Windows/System32/KernelBase.dll.js", type: "JS" },
  somedll: { path: "/Windows/System32/somedll.dll.css", type: "CSS" },
};

export async function main(procInstance) {
  // setTimeout(async () => {
  console.log("Explorer Started");
  const template = `
      <div id="taskbar-panel">
        <div class="blur"></div>
        <div class="grain"></div>
        <div id="taskbar-left">
          <button id="start" name="start" class="taskbar-button" aria-label="Iniciar" type="button">
            <svg viewBox="0 0 64 64"><path fill="currentColor" d="M 64,33 H 29 V 59.078 L 64,64 Z M 64,0 29,4.921 V 29.5 H 64 Z M 25,5.485 0,9 V 29.5 H 25 Z M 25,33 H 0 v 22 l 25,3.514 z"/></svg>
          </button>
        </div>
        <div id="taskbar-right">
          <button id="taskbar-date-time" class="taskbar-button">
          <div id="time">11:11</div>
            <div id="date">11/11/2011</div>
            </button>
        </div>
        </div>`;

  const taskbar = await DWM.createWindow({
    id: "taskbar",
    maxButton: false,
    minButton: false,
    closeButton: false,
    isResizable: false,
    baseLayout: template,
    minH: undefined,
    minW: undefined,
  });
  taskbar.host.style.display = "flex";
  const sheet = new CSSStyleSheet();
  const css = await fetch("/Windows/System32/somedll.dll.css");
  sheet.replaceSync(await css.text());
  taskbar.adoptedStyleSheets.push(sheet);
  window.addEventListener("keyup", (e) => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      navigator.keyboard.lock();
    }
    if (e.code === "MetaLeft") {
      console.log("MEtA");
      openStartMenu();
    }
  });
  function openStartMenu() {
    throw new RangeError(
      "Poxa vida, pessoa! Será que dá para me deixar em paz??? Sou só um botão para abrir o menu iniciar.... VOCÊ tem um TECLADO com uma tecla Windows e vem clicar em mim?! Ah, para!"
    );
  }
  taskbar.getElementById("start").onclick = openStartMenu;
  // document.getElementById("start").addEventListener("click", () => {
  //   createAppInstance(run);
  // });
  // }, 1000);
}

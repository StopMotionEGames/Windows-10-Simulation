function redirect(number) {
  window.addEventListener("redirect", () => {
    if (number === 0 && select[number])
      window.location.href = "/testing-area/desktop";
    else if (number === 1 && select[number])
      window.location.href = "/testing-area/";
    else if (number === 2 && select[number]) window.location.reload();
  });
}
let selected = false;
let select = [false, false, false];
const hotKeyListener = (e) => {
  if (e.code === "Tab") document.getElementById("oem-logo").remove();
  if (!selected) {
    if (e.code === "Delete") {
      document.getElementById("press-del").textContent =
        "Entering Main Test Page ...";
      selected = true;
      select[0] = true;
      redirect(0);
    }
    if (e.code === "F8") {
      document.getElementById("press-f8").textContent =
        "Testing area selection Popup menu has been selected";
      selected = true;
      select[1] = true;
      redirect(1);
    }
    if (e.code === "F2" && e.altKey) {
      document.getElementById("press-alt+f2").textContent =
        "WinSimu EZ Reload will be executed ...";
      selected = true;
      select[2] = true;
      redirect(2);
    }
  }
};
window.addEventListener("keydown", hotKeyListener);
window.oncontextmenu = (e) => {
  e.preventDefault();
};
let bootSteps = function () {
  const postMessages = [
    "Done.\n8191MB OK (Installed Memory Size:8192MB)\n",
    "USB Device(s): 1 Keyboard, 1 Mouse, 5 Storage Devices\n",
    "Auto-Detecting SATA3G_1...IDE Hard Disk\nSATA3G_1 : KINGSTON SA400S37240G 031790003\n             Ultra DMA Mode-6, S.M.A.R.T Capable and Status OK\n",
    "Auto-detecting USB Mass Storage Devices ..\nDevice #01 : ",
    "  SanDisk 3.2Gen11.00 *HiSpeed*\nDevice #02 : ",
    "Generic USB SD Reader *HiSpeed*\nDevice #03 : ",
    "Generic USB CF Reader *Hispeed*\nDevice #04 : ",
    "Generic USB SM Reader *HiSpeed*\nDevice #05 : ",
    "Generic USB MS Reader *HiSpeed*\n",
    "05 USB mass storage devices found and configured.\n",
    "\nChecking NVRAM..\n ",
  ];
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  window.addEventListener("load", async () => {
    setTimeout(async () => {
      document.querySelector(".footer").remove();
      const pre = document.querySelector(".post-messages pre");
      for (let i = 0; i < postMessages.length; i++) {
        const randomInterval =
          Math.floor(Math.random() * (400 - 200 + 1)) + 200;
        await delay(randomInterval);
        pre.innerHTML += postMessages[i];
        pre.parentElement.parentElement.scrollTop = pre.scrollHeight;
        if (i === postMessages.length - 1)
          setTimeout(() => {
            if (!selected)
              window.dispatchEvent(new CustomEvent("postComplete"));
            else window.dispatchEvent(new CustomEvent("redirect"));
            window.removeEventListener("keydown", hotKeyListener);
          }, Math.floor(Math.random() * (600 - 200 + 1)) + 800);
      }
    }, 2000);
  });
  window.addEventListener("postComplete", async () => {
    await delay(600);
    if (document.getElementById("oem-logo"))
      document.getElementById("oem-logo").remove();
    document.querySelector(".post-messages pre").innerHTML = null;
    await delay(800);
    document.querySelector(".post-messages pre").innerHTML =
      "For a better experience, we recommend using full screen mode.\n" +
      "Activate it?\n" +
      "[Any Key] Yes, [KeyN] No\n" +
      "\nIgnoring automatically in 15 seconds.\n" +
      "Also, activating full screen, we'll try to use the keyboard.lock()\n" +
      "API to lock system keys (except Ctrl + Alt + Delete), to a better\nexpirence simulating a PC.";
    ask();
  });
  function ask() {
    const keyListener = async (e) => {
      if (e.code === "KeyN") next();
      else if (e.code !== "Escape") {
        document.documentElement.requestFullscreen();
        try {
          await navigator.keyboard.lock();
        } catch (error) {
          console.warn("Falha ao bloquear teclas:", error);
        }
        next();
      }
    };
    window.addEventListener("keydown", keyListener);
    let timeout = setTimeout(() => {
      next();
    }, 15000);

    function next() {
      window.removeEventListener("keydown", keyListener);
      if (timeout) clearTimeout(timeout);
      document.body.innerHTML = null;
      const winload = document.createElement("script");
      winload.src = "/Windows/System32/Boot/winload.exe.js";
      document.head.appendChild(winload);

      dispatchEvent(new Event("StartWinload"));
    }
  }
};
document.addEventListener("DOMContentLoaded", bootSteps);
addEventListener("StartWinload", () => {
  bootSteps = null;
});
function updateScale() {
  const contentWidth = document.body.scrollWidth;
  const contentHeight = document.body.scrollHeight;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const scaleX = viewportWidth / contentWidth;
  const scaleY = viewportHeight / contentHeight;

  document.body.style.transform = `scale(${scaleX}, ${scaleY})`;
  document.body.style.transformOrigin = "top left";
}

window.addEventListener("DOMContentLoaded", updateScale);
window.addEventListener("resize", updateScale);

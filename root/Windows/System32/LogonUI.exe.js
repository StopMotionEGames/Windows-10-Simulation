/// <reference path="./ntoskrnl.exe.js" />
(async () => {
  var LogonUIWindow = `
  <wuhc-window id="windows-credentials" style="display: flex; justify-content: center; align-items: center; /*background-color: #0000*/; flex-direction: column">
  <wuhc-progressring isactive="true" width="65" foreground="#fff" style="margin-bottom: 7px"></wuhc-progressring>
  <p style="font-family: Segoe UI Semilight; margin: 0px; text-align: center; font-size: 24px">Trabalhando em atualizações<br />19% concluído(s)<br />Não desligue seu computador</p>
  <wuhc-button content="Cancelar"></wuhc-button>
</wuhc-window>
`;
  document.addEventListener("DOMContentLoaded", () => {
    // await NTKernel.ReadFile("/Windows/System32/Windows.UI.Html.ts", {Type: FileType.TS});
    const parser = new DOMParser();
    LogonUIWindow = parser.parseFromString(LogonUIWindow, "text/html");
    document.body.appendChild(...LogonUIWindow.body.childNodes);
  });
})();

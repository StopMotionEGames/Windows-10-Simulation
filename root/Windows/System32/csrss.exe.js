// csrss.exe.js

// Define as dependências necessárias para este executável.
// Note que cada chave define um módulo que, por exemplo,
// pode conter funções (tipo "JS" ou "JS+CSS") ou recursos gráficos (tipo "JSON").
export const include = {
  kernel32: { path: "/Windows/System32/kernel32.dll.js", type: "JS" },
  WindowsUIHtmlControls: { path: "/Windows/System32/Windows.UI.Html.Controls.dll.js", type: "JS+CSS" },
  RecursosGraficos: { path: "/Windows/System32/RecursosGraficos.dll.json", type: "JSON" },
};

// Função principal do executável que será chamada assim que as dependências estiverem carregadas.
export function main(procInstance) {
  procInstance.log("Dentro de main() do executável.");

  // Exemplo: utilizar uma função da DLL kernel32
  if (procInstance.kernel32 && typeof procInstance.kernel32.systemInfo === "function") {
    const info = procInstance.kernel32.systemInfo();
    procInstance.log("Informações do sistema (kernel32): " + JSON.stringify(info));
  } else {
    procInstance.log("Função systemInfo não encontrada na kernel32.");
  }

  // Exemplo: criar uma janela via WindowsUIHtmlControls, se disponível.
  if (procInstance.WindowsUIHtmlControls && typeof procInstance.WindowsUIHtmlControls.createWindow === "function") {
    procInstance.WindowsUIHtmlControls.createWindow(procInstance);
  } else {
    procInstance.log("Função createWindow não encontrada no WindowsUIHtmlControls.");
  }
}

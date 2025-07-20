/// <reference path="./ntoskrnl.exe.js" />
class WindowsCredentials {
  constructor() {
    this.main();
  }
  main() {
    NTKernel.ReadFile("/Windows/System32/LogonUI.exe.js", { Type: FileType.Script, AutoAppend: true });
  }
  static async GetUsersList() {
    var handle = await Registry.RegOpenKey("HKU");
    var b = Registry.RegEnumKey(handle);
  }
  static async ValidateLogon(accountID, credential) {
    Registry.RegOpenKey("HKU", "");
  }
}
const __WINLOGON__ = new WindowsCredentials();
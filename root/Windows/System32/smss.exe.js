/// <reference path="./ntoskrnl.exe.js" />
/// <reference path="./KernelBase.dll.js" />

// Importações para ajudar no IntelliSense - devem ser removidas ou ajustadas posteriormente.
import { Process } from "./ntoskrnl.exe.js";

export const include = {
  KernelBase: { path: "/Windows/System32/KernelBase.dll.js", type: "JS" },
};
let proc;
/**@param {Process} procInstance */
export function main(procInstance) {
  proc = procInstance;
  console.log("Session Manager Subsystem iniciado");
}

export function createSession(proc, userName, name, settings = {}) {
  if (!proc.sessionManager) proc.sessionManager = new SessionManagerSubsystem();
  return proc.sessionManager.createSession(userName, name, settings);
}

class SessionManagerSubsystem {
  constructor() {
    this.sessions = new Map();
    this.nextSessionId = 0;
  }

  /**
   * Cria uma nova sessão.
   * @param {string} UserName - Nome do usuário.
   * @param {string} [name] - Nome da sessão (se não fornecido, usa o nome do usuário).
   * @param {object} [Settings] - Configurações adicionais.
   * @return {object} session - O objeto da sessão criado.
   */
  CreateSession(UserName, name, Settings = {}) {
    const session = {
      ID: this.nextSessionId++,
      Name: name || UserName,
      UserName: UserName,
      Settings: Settings,
      StartedAt: new Date(),
    };

    this.sessions.set(session.ID, session);
    console.log("Sessão criada:", session);
    return session;
  }

  /**
   * Fecha uma sessão existente pelo ID.
   * @param {number} sID - ID da sessão.
   * @return {boolean} - Verdadeiro se a sessão foi fechada, falso caso contrário.
   */
  CloseSession(sID) {
    if (this.sessions.has(sID)) {
      const session = this.sessions.get(sID);
      this.sessions.delete(sID);
      console.log("Sessão fechada:", session);
      return true;
    }
    console.warn(`Sessão ${sID} não encontrada.`);
    return false;
  }

  /**
   * Pode ser útil ter um método para buscar uma sessão.
   * @param {number} sID - ID da sessão.
   * @return {object|null} - A sessão encontrada ou null.
   */
  GetSession(sID) {
    return this.sessions.get(sID) || null;
  }
}
export const __smss__ = new SessionManagerSubsystem();

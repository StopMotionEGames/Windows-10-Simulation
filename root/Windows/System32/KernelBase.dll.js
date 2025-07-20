/**
 * Loads a resource from a File URL asynchronously and injects it into the document.
 * @param {string} path - The URL of the resource to be loaded.
 * @param {Object} Options - Options for loading.
 * @param {("script"|"stylesheet"|"image"|"audio"|"video")} [Options.Type=FileType.Script] - The type of resource. It's safer using FileType enum (e.g. FileType.Script).
 * @param {boolean} [Options.IsCritical=false] - If true, the loaded element is marked as critical ("sys-critical") and errors trigger a BugCheck.
 * @param {boolean} [Options.AutoAppend=true] - If true, the element is automatically appended to the DOM (head for Script/Stylesheet, body for other types); otherwise, it is returned for manual insertion.
 * @param {(0|1|2)} [Options.Priority=0] - Values: 0, 1, 2 | 0 = auto, 1 = low and 2 = high
 */
export async function ReadFile(path, Options = {}) {
  const type = Options.Type || FileType.Script;
  const isCritical = !!Options.IsCritical;
  const autoAppend = Options.AutoAppend === undefined ? true : Options.AutoAppend;
  const priority = Options.Priority === null || Options.Priority === undefined || isNaN(Options.Priority) ? "auto" : Options.Priority === 0 ? "auto" : Options.Priority === 1 ? "low" : Options.Priority === 2 ? "high" : "auto";
  __KERNEL__.ReadFile(path, { Type: type, IsCritical: isCritical, AutoAppend: autoAppend, Priority: priority });
}
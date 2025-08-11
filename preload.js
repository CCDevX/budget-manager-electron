// const { contextBridge } = require("electron");
//
// contextBridge.exposeInMainWorld("electronAPI", {
//   versions: {
//     chrome: process.versions.chrome,
//     node: process.versions.node,
//     electron: process.versions.electron,
//   },
// });

window.addEventListener("DOMContentLoaded", (event) => {
  const replaceText = (selector, text) => {
    const el = document.getElementById(selector);
    if (el) {
      el.innerHTML = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

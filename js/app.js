(() => {
  const { ipcRenderer } = require("electron");
  const ipc = ipcRenderer;

  const reduceBtn = document.getElementById("reduceBtn");
  const sizeBtn = document.getElementById("sizeBtn");
  const closeBtn = document.getElementById("closeBtn");

  reduceBtn.addEventListener("click", (e) => {
    ipc.send("reduceApp");
  });

  sizeBtn.addEventListener("click", (e) => {
    ipc.send("sizeApp");
  });

  closeBtn.addEventListener("click", (e) => {
    ipc.send("closeApp");
  });

  //Gestion ajout nouvelle entrée registre + prépa BDD

  const btnAddLigne = document.getElementById("btnSaveLigne");

  if (btnAddLigne != null) {
    btnAddLigne.addEventListener("click", (e) => {
      const dateVal = document.getElementById("dateLigne");
      const montantVal = document.getElementById("montantLigne");
      const infoVal = document.getElementById("infoLigne");

      const _myRecord = {
        date: dateVal.value,
        montant: montantVal.value,
        info: infoVal.value,
      };

      ipc.send("addLigneToDb", _myRecord);
    });
  }
})();

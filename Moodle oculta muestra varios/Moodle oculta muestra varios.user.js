// ==UserScript==
// @name     Moodle oculta muestra varios
// @version  1
// @include  https://campus*.ull.es/*course/view.php*
// @description   Autor: Alberto Hamilton 2023. Licencia: GPLv3.
// @grant    none
// ==/UserScript==

function creaEstilos() {
  // Create our stylesheet
  var style = document.createElement('style');
  style.innerHTML = `

.modalGSM {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding-top: 100px;
  background-color: rgba(0,0,0,0.4);

  z-index: 1050;
  overflow: hidden;
  outline: 0;

}

/* Modal Content */
.modalGSM-content {

  position: relative;
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 90%;
  pointer-events: auto;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.2);
  outline: 0;

  margin: auto;
  padding: 20px;


}

/* The Close Button */
.modalGSM-close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.modalGSM-close:hover,
.modalGSM-close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.divListaItems {
  overflow: scroll;
}

.divListaItems table {
  width: 100%;
}


.divListaItems thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}


.liItem {
    list-style-type: none;

}

.liItem td {
  padding-left: 4px;
  padding-right: 4px;
}

.liItem label {
  margin: 0px;
}

.liItem:nth-of-type(odd){
  background-color: lightgray;
}
.liItem:nth-of-type(even){
  background-color: white;
}

.darkClass {
  background: rgba(0, 0, 0, 0.5);
  z-index: 20;
  height: 100%;
  width: 100%;
  background-repeat:no-repeat;
  background-position:center;
  position:absolute;
  top: 0px;
  left: 0px;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.progressInfo {
  width: 60%;
}
progress {
  width: 100%;
  height: 40px;
  border: 10px;
  border-color: black;
}

#progressDetail {
  font-size: xxx-large;
}

`;

  // Get the first script tag
  var ref = document.querySelector('script');

  // Insert our new styles before the first script tag
  ref.parentNode.insertBefore(style, ref);
}


function obtieneElementos(eleAct) {
  console.log(`obtieneElementos: comienza`);

  const nodeSnap = document.evaluate(
    './/li[starts-with(@id,"module-")]',
    eleAct,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null);

  console.log(`obtieneElementos: Se encontraron ${nodeSnap.snapshotLength} elementos`);
  document.getElementById('numElementos').innerText = `Hay ${nodeSnap.snapshotLength} elementos.`;

  const ulElem = document.getElementById('listaItems');
  ulElem.replaceChildren();

  const arrayACheck = [];
  // Recorremos los nodos encontrados
  for (let i=0 ; i < nodeSnap.snapshotLength; i++ )
  {
    const eleAct = nodeSnap.snapshotItem(i);
    const clase = eleAct.className.split(' ')[1];
    let nombreElem = eleAct.innerText.split('\n')[1];
    if (clase == 'label') {
      nombreElem = eleAct.innerText.split('\n')[0];
    }
    // Ocultar o mostrar
    const aHideShowFO = document.evaluate(
      './/a[contains(@class,"editing_show") or contains(@class,"editing_hide")]',
      eleAct,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null);
    const aHideShow = aHideShowFO.singleNodeValue;
    let hideShow = 'NoTiene';
    if(aHideShow) {
      hideShow = 'Ninguno';
      if (aHideShow.className.includes('editing_show'))
        hideShow = 'oculto';
      if (aHideShow.className.includes('editing_hide'))
        hideShow = 'mostrado';
    }
    const modNumber = eleAct.id.split('-')[1];
    console.log(`obtieneElementos: id = ${modNumber} → ${clase}: "${nombreElem}"`);

    // Añadimos entrada a lista
    const liItem = document.createElement('tr');
    liItem.innerHTML = `
  <td><input type="checkbox" id="cksh-${modNumber}" ${hideShow == 'mostrado' ? "checked": ""}></td>
  <td>${clase}</td>
  <td>${nombreElem}</td>
  <td>${eleAct.id}</td>
    `;
    liItem.classList.add('liItem');
    liItem.setAttribute('id',`sh-${modNumber}`);
    ulElem.appendChild(liItem);

    arrayACheck.push({modNumber, aHideShow, hideShow, liItem})

  }

  document.getElementById('mostrarTodos').onclick = () => {
    console.log(`Marcamos todos como mostrados`);
    for(const ai of arrayACheck) {
      ai.liItem.getElementsByTagName('input')[0].checked = true;
    }
  }

  document.getElementById('mostrarNada').onclick = () => {
    console.log(`Marcamos todos como NO mostrados`);
    for(const ai of arrayACheck) {
      ai.liItem.getElementsByTagName('input')[0].checked = false;
    }
  }

  document.getElementById("btnAplica").onclick = () => {
    fijaHS(arrayACheck);
  }

  console.log(`obtieneElementos: Termina`);
}

async function fijaHS(aAC) {
  console.log(`fijaHS: Comienza con ${aAC.length}`);

  const aCambiar = [];
  for(ia of aAC) {
    const {modNumber, aHideShow, hideShow, liItem} = ia;
    const mostrar = liItem.getElementsByTagName('input')[0].checked;
    let cambiar = (mostrar && (hideShow != 'mostrado')) || (!mostrar && (hideShow != 'oculto'));
     console.log(`fijaHS: ${modNumber} → ${hideShow} ${mostrar} ⇒ ${cambiar} → "${aHideShow.href}"`);
    if (cambiar)
      aCambiar.push(ia)
  }
  if(aCambiar.length <= 0) {
    window.location.reload();
    return;
  }
  const pb = document.getElementById('progressChanged');
  pb.setAttribute('max', aCambiar.length);
  let pbVal = 0;
  pb.setAttribute('value', pbVal);

  document.getElementById('darkLayer').style.display = 'flex';
  const pDet = document.getElementById('progressDetail');
  for(const iaC of aCambiar) {
    console.log(`fijaHS: cambiamos ${iaC.modNumber}`);
    pbVal += 1;
    pb.setAttribute('value', pbVal);
    pDet.innerText = `${pbVal} / ${aCambiar.length}`;

    try {
      const respuesta = await fetch(iaC.aHideShow.href);
      console.log(`fijaHS: Correcto cambio ${iaC.modNumber}`);
    } catch (e) {
      console.log(`fijaHS: Error cambio ${iaC.modNumber}`);
    }
  }
  console.log(`fijaHS: Terminamos y recargamos página`);
  window.location.reload();
}

function ocultaTodo() {
  console.log(`ocultaTodo: Empieza`);
  if (!document.body.className.includes('editing')) {
    console.log('ocultaTodo: No estamos en modo edición. Salimos');
    return;
  }
  const nodeSecciones = document.evaluate(
    '//li[starts-with(@id,"section-")]',
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null);

  console.log(`ocultaTodo: Se encontraron ${nodeSecciones.snapshotLength} secciones`);
  if(nodeSecciones.snapshotLength <= 0) {
    console.log('ocultaTodo: No hay secciones. Salimos');
    return;
  }

  // creamos la modal
  creaEstilos();

  const divModal = document.createElement("div");
  // style="display: block;"
  divModal.innerHTML = `
  <div class="modalGSM-content">
    <span id="btnCloseModal" class="modalGSM-close">&times;</span>
    <p><span id="numElementos">Elementos.</span> Acciones:
      <a id="mostrarTodos" href="#">Mostrar Todos</a>,
      <a id="mostrarNada" href="#">Mostrar Nada</a>
    </p>
    <div class="divListaItems">
      <table>
        <thead><tr><th>vis</th><th>tipo</th><th>titulo</th><th>id</th></tr></thead>
        <tbody id="listaItems"></tbody>
      </table>
    </div>
    <button id="btnAplica" type="button">Aplica cambios</button>
  </div>
  `;
  divModal.classList.add('modalGSM');
  divModal.setAttribute("id","modalAñade");
  document.body.appendChild(divModal);

  const divDarker = document.createElement("div");
  divDarker.innerHTML = `
    <div id="darkLayer" class="darkClass" style="display:none">
      <div class="progressInfo">
        <progress id="progressChanged" max="100" value="0"></progress>
        <p id="progressDetail">0 /100</p>
      </div>
    </div>
  `;
  divModal.appendChild(divDarker);

  // Recorremos las secciones encontradas
  for (let i=0 ; i < nodeSecciones.snapshotLength; i++ ) {
    const secAct = nodeSecciones.snapshotItem(i);
    console.log(`ocultaTodo: estudiando sección ${i} → ${secAct.id}`);
    if (secAct.className.includes('hidden')) {
      console.log(`ocultaTodo: Sección ${secAct.id} oculta. No ponemos boton`);
      continue;
    }

    const btnHS = document.createElement("button");
    btnHS.appendChild(document.createTextNode("Oculta/Muestra"));
    btnHS.setAttribute("id","botonHideShow");
    btnHS.setAttribute("type","button");

    secAct.prepend(btnHS);

    btnHS.onclick = () => {
      divModal.style.display = 'block';
      obtieneElementos(secAct)
    }

    function cierraLimpiaModal() {
      console.log(`cerramos y limpiamos la modal`);
      divModal.style.display = "none";
    }

    document.getElementById("btnCloseModal").onclick = () => {
      cierraLimpiaModal();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == divModal) {
        cierraLimpiaModal();
      }
    }
  }
  console.log(`ocultaTodo: Termina`);
}


//setTimeout(ocultaTodo, 5000);
ocultaTodo();

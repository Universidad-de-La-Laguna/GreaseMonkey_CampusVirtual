// ==UserScript==
// @name     CreaRubrica
// @version  1
// @include  https://campus*.ull.es/*rubric/edit.php*
// @description   Autor: Alberto Hamilton 2022. Licencia: GPLv3.
// @grant    none
// ==/UserScript==

function creaEstilos() {
  // Create our stylesheet
  var style = document.createElement('style');
  style.innerHTML = `
/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 200px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  display: block;
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

/* The Close Button */
.modal-close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.modal-close:hover,
.modal-close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
`;

  // Get the first script tag
  var ref = document.querySelector('script');

  // Insert our new styles before the first script tag
  ref.parentNode.insertBefore(style, ref);
}

function cierraLimpiaModal() {
  console.log(`cerramos y limpiamos la modal`);
  document.getElementById("listaIndicadores").value = "";
  document.getElementById("btnAñade").disabled = false;
  document.getElementById("modalAñade").style.display = "none";
}

function miraExiste(nombreEle) {
  const ele = document.getElementById(nombreEle);
  if (ele === null) {
    console.warn(`Elemento: "${nombreEle}" null`);
  }
  return ele;
}

function sleep(ms) {
  if (ms > 0) return new Promise((resolve) => setTimeout(resolve, ms));
  return Promise.resolve();
}

async function añadeDeLista() {
 // Tabla principal id=rubric-criteria
 // Cada fila
 //   id=rubric-criteria-NEWID1-description-cell
 //     Que contiene rubric-criteria-NEWID1-description
 //   Tabla con
 //     rubric-criteria-NEWID1-levels-NEWID1-definition-container
 //      rubric-criteria-NEWID1-levels-NEWID0-definition
 //      rubric-criteria-NEWID1-levels-NEWID0-score
 //       rubric[criteria][NEWID1][levels][NEWID1][score]
 //       rubric-criteria-NEWID1-levels-addlevel
 //
 //   rubric-criteria-addcriterion

  const arrayIndica = document.getElementById('listaIndicadores').value.split('\n');

  let iCriAct = 0;
  let iScAct = -1;
  let numNiveles = 3;  // Cuantos niveles tendrá nuevo indicador

  for(la of arrayIndica) {
    let ele;
    console.log(`Tratando linea "${la}"`);
    let campos = la.split('\t');
    // borramos strings vacíos o en blanco
    campos = campos.filter(entry => entry.trim() != '');
    if(campos.length < 3) {
      console.warn(`La linea no tiene suficientes campos`);
      continue;
    }
    const inidcador = campos[0];
    console.log(`El indicador ${iCriAct} es "${inidcador}"`);
    if(inidcador.length ==0) {
      console.warn(`El indicador está vacío ⇒ ignoramos línea`);
      continue;
    }
    // columnas de niveles que tienen →
    const niveles = campos.slice(1);
    if(niveles.filter(entry => entry.includes('→')).length < 2) {
      console.warn(`No hay ni 2 niveles útiles ⇒ ignoramos linea`);
      continue;
    }

    iCriAct++;  // amentamos contador de criterio
    // Apuntamos el criterio
    if (iCriAct > 1) {
      console.log(`Añadimos hueco para indicador ${iCriAct}`);
      ele = miraExiste('rubric-criteria-addcriterion');
      if(ele !== null) ele.click();
    }
    ele = miraExiste(`rubric-criteria-NEWID${iCriAct}-description-cell`);
    if (ele !== null) ele.click();
    ele = miraExiste(`rubric-criteria-NEWID${iCriAct}-description`);
    if (ele !== null) ele.innerText = inidcador;

    let iNivel = 0;
    for(nivAct of niveles) {
      if(!nivAct.includes('→')) {
        console.info(`El campo "${nivAct}" no es un nivel`);
        continue;
      }

      iNivel++;
      iScAct++;
      const [descNiv, valNiv] = nivAct.split('→');
      console.log(`Nivel ${iNivel}/${numNiveles}(${iScAct}) "${descNiv}" con valor "${valNiv}"`);

      // Apuntamos el Nivel
      if (iNivel > numNiveles) {
        console.log(`hacemos hueco para nivel ${iNivel}: ${iScAct}`);
        ele = miraExiste(`rubric-criteria-NEWID${iCriAct}-levels-addlevel`);
        if(ele !== null) ele.click();
        numNiveles++;
      }

      ele = miraExiste(
        `rubric-criteria-NEWID${iCriAct}-levels-NEWID${iScAct}-definition-container`);
      if(ele !== null) ele.click();
      ele = miraExiste(
        `rubric-criteria-NEWID${iCriAct}-levels-NEWID${iScAct}-definition`);
      if(ele !== null)  ele.innerText = descNiv;
      ele = miraExiste(
        `rubric[criteria][NEWID${iCriAct}][levels][NEWID${iScAct}][score]`);
      if(ele !== null)  ele.value = valNiv;

    }

    // borramos los niveles sobrantes
    if(iNivel < numNiveles) {
      console.log(`Hay que borrar ${(numNiveles - iNivel)} niveles`);

      let sobra = iScAct + 1;
      let iSobra = iNivel + 1;
      while(iSobra <= numNiveles) {
        console.log(`Vamos a borrar el de posición ${iSobra} → ${sobra}`);
        ele = miraExiste(
          `rubric-criteria-NEWID${iCriAct}-levels-NEWID${sobra}-delete`);
        if(ele !== null) ele.click();
        await sleep(500);
        const elemento = document.evaluate(
          "//div[text()='¿Está seguro que quiere eliminar este nivel?']",
          document, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const botonSi = document.evaluate("//input[@value='Sí']",
          elemento.parentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        botonSi.click();
        sobra++;
        iSobra++;
      }
      numNiveles = Math.max(3, iNivel);
    }

  }
  // Ya no se puede anadir rúbica
  document.getElementById("botonAñadeRubrica").disabled = true;
  cierraLimpiaModal();
}


function creaRubrica() {

  console.log('Empieza creaRubrica()');

  creaEstilos();

  const divPadre = document.getElementById("fitem_id_rubric");
  const btnEle = document.createElement("button");
  btnEle.appendChild(document.createTextNode("Añade Rubrica"));
  btnEle.setAttribute("id","botonAñadeRubrica");
  btnEle.setAttribute("type","button");

  divPadre.insertBefore(btnEle, divPadre.firstChild);

  const divModal = document.createElement("div");
  // style="display: block;"
  divModal.innerHTML = `
  <div id="modalAñade" class="modal-content">
    <span id="btnCloseModal" class="modal-close">&times;</span>
    <label for="listaIndicadores">Pega lista de indicadores
      a añadir a la rúbrica</label>
    <textarea id="listaIndicadores" cols="26" rows="10"
      placeholder="Texto Critero\tTexto Nivel → puntos\tTexto Nivel → puntos\tTexto Nivel → puntos"></textarea>
    <button id="btnAñade" type="button">Crea Rúbrica</button>
  </div>
  `;
  divModal.classList.add('modal');
  divModal.setAttribute("id","modalAñade");
  divPadre.appendChild(divModal);

  btnEle.onclick = () => {
    divModal.style.display = 'block';
    // añadeDeLista();
  }

  const closeModal = document.getElementById("btnCloseModal");
  closeModal.onclick = () => {
    cierraLimpiaModal();
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == divModal) {
      cierraLimpiaModal();
    }
  }

  document.getElementById("btnAñade").onclick = añadeDeLista;

}

creaRubrica();

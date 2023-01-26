// ==UserScript==
// @name     Añade usuarios aula Moodle
// @version  3
// @include  https://campus*.ull.es/*enrol/manual/manage.php*
// @description   Autor: Alberto Hamilton 2022. Licencia: GPLv3.
// @grant    none
// ==/UserScript==


// Cogida idea de https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal

btAplicaTexto = 'Añade alumnado encontrado';

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

#listaemails {
  flex: 1;
  resize: vertical;
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

function cierraLimpiaModal() {
  console.log(`cerramos y limpiamos la modal`);
  document.getElementById("listaemails").value = "";
  document.getElementById("btnAñade").disabled = false;
  const btnAplica = document.getElementById("btnAplica")
  btnAplica.disabled = true;
  btnAplica.textContent = btAplicaTexto;
  document.getElementById("addselect_clearbutton").click();
  document.getElementById("modalAñade").style.display = "none";
}

function añadeDeLista(event) {

  console.log("Se pide añadir de lista");

  const taLista = document.getElementById("listaemails");
  const btnAdd = document.getElementById("add");  // boton de Agregar
  const selAdd = document.getElementById("addselect");  // lista de usuarios
  // text input para buscar
  const addSelSearch = document.getElementById("addselect_searchtext");
  console.log(`Hay ${selAdd.length} alumnos disponible`);

  selAdd.addEventListener('change', (event) => {
    console.log('Se actualizo select');
    console.log(`Hay ${selAdd.options.length} opciones`);
  });

  // copiamos los emails
  const arrayEmails = taLista.value.split("\n").slice();

  const totLineas = arrayEmails.length;
  console.log(`Tenemos ${totLineas} emails`);
  let indAAct = 0;

  let numLineas = 0;
  let numEncontrados = 0;

  const pb = document.getElementById('progressChanged');
  pb.setAttribute('max', totLineas);
  let pbVal = 0;
  pb.setAttribute('value', pbVal);

  const divDarker = document.getElementById('darkLayer');
  divDarker.style.display = 'flex';
  const pDet = document.getElementById('progressDetail');

  function pasaSiguiente() {
    // actualizamos textaera
    taLista.value = arrayEmails.join('\n');
    // pasamos siguiente linea
    indAAct++;
    console.log(`Considerando linea ${indAAct} de ${totLineas}`);
    if (indAAct < totLineas) {
      pb.setAttribute('value', indAAct);
      pDet.innerText = `${indAAct} / ${totLineas}`;
      setTimeout(trataAlumno, 50);
    } else {
      console.log("Ya están todos. Los añadimos");
      selAdd.dispatchEvent(new Event("change"));
      document.getElementById("btnAñade").disabled = true;
      const btAplica = document.getElementById("btnAplica");
      btAplica.disabled = false;
      btAplica.textContent =`${btAplicaTexto} (${numEncontrados} de ${numLineas})`;
      divDarker.style.display = 'none';
      btAplica.onclick = () => {
        console.log('Añadimos los alumnos');
        btnAdd.click();
        cierraLimpiaModal();
      }
    }
  };

  function trataAlumno () {
    // Tratamos la linea
    const linAct = arrayEmails[indAAct];
    console.log(`Tratando linea "${linAct}"`);

    if (linAct === "") {
      pasaSiguiente();
      return;
    }
    numLineas++;
    const arrEmail = /([^@]+)@ull.*\.es/.exec(linAct);
    if (arrEmail === null) {
      console.log('No email en esta linea');
      arrayEmails[indAAct] = arrayEmails[indAAct] + ' NO RECONOCIDO';
      pasaSiguiente();
      return;
    }

    const email = arrEmail[1];
    console.log(`El email es ${email}`);

    addSelSearch.value = `${email}@`;
    console.log(`Modificado valor input`);
    // addSelSearch.dispatchEvent(new Event("change"));
    // addSelSearch.dispatchEvent(new KeyboardEvent('keydown',{'key':'@'}));
    addSelSearch.dispatchEvent(new KeyboardEvent('keyup',{'key':'@'}));

    console.log('Mandado evento de input');

    setTimeout(() => {

      let indice = -1;
      console.log(`Vamos a recorrer la lista de ${selAdd.options.length}`
        + ` elementos en busca de ${email}`);
      for (let i = 0; i < selAdd.options.length; i++) {
        console.log(`→ La linea ${i} contiene '${selAdd.options[i].label}'`);
        if (selAdd.options[i].label.includes(email)) {
          indice = i;
          console.log(`Email ${email} encontrado en posición ${indice}`);
          break;
        }
      }

      if (indice < 0) {
        arrayEmails[indAAct] = arrayEmails[indAAct] + ' NO ENCONTRADO';
        pasaSiguiente();
        return;
      }
      numEncontrados++;
      arrayEmails[indAAct] = selAdd.options[indice].label;

      // NO es necesario lo siguiente, se selecciona automáticamente
      //selAdd.options[indice].selected = true;

      pasaSiguiente();
    }, 1500);

  };

  trataAlumno();
}

function aniadeUsuarios() {

  creaEstilos();

  const botAdd = document.getElementById("addselect_clearbutton");
  const divPadre = botAdd.parentNode;
  const btnEle = document.createElement("button");
  btnEle.appendChild(document.createTextNode("Añadir de lista"));
  btnEle.setAttribute("id","botonAñadeLista");
  btnEle.setAttribute("type","button");

  //Fijamos opciones
  document.getElementById("userselector_preserveselectedid").checked = true;
  document.getElementById("userselector_autoselectuniqueid").checked = true;

  divPadre.appendChild(btnEle);

  const divModal = document.createElement("div");
  // style="display: block;"
  divModal.innerHTML = `
  <div id="modalAñade" class="modalGSM-content">
    <span id="btnCloseModal" class="modalGSM-close">&times;</span>
    <label for="listaemails">Pega lista de e-mails de alumnado
      a añadir al aula</label>
    <textarea id="listaemails" cols="26" rows="10"
      placeholder="aluXXXXXXXXX@ull.edu.es"></textarea>
    <button id="btnAñade" type="button">Selecciona alumnado</button>
    <button id="btnAplica" type="button" disabled="">${btAplicaTexto}</button>
  </div>
  `;
  divModal.classList.add('modalGSM');
  divModal.setAttribute("id","modalAñade");
  divPadre.appendChild(divModal);

  const divDarker = document.createElement("div");
  divDarker.innerHTML = `
    <div id="darkLayer" class="darkClass" style="display:none">
      <div class="progressInfo">
        <progress id="progressChanged" max="100" value="0"></progress>
        <p id="progressDetail">? / ?</p>
      </div>
    </div>
  `;
  divModal.appendChild(divDarker);

  btnEle.onclick = () => {
    divModal.style.display = 'block';
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

aniadeUsuarios();

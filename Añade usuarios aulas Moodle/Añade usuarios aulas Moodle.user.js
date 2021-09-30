// ==UserScript==
// @name     Añade usuarios aulas Moodle
// @version  1
// @include  https://campus*.ull.es/enrol/manual/manage.php*
// @description   Autor: Alberto Hamilton 2021. Licencia: GPLv3.
// @grant    none
// ==/UserScript==


// Cogida idea de https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal

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


function añadeDeLista(event) {

  console.log("Se pide añadir de lista");

  const taLista = document.getElementById("listaemails");
  const btnAdd = document.getElementById("add");  // boton de Agregar
  const selAdd = document.getElementById("addselect");  // lista de usuarios
  const addSelSearch = document.getElementById("addselect_searchtext");  // text imput para buscar
  console.log(`Hay ${selAdd.length} alumnos disponible`);

  selAdd.addEventListener('change', (event) => {
    console.log('Se actulizo select');
    console.log(`Hay ${selAdd.options.length} opciones`);
  });

  // copiamos los emails
  const arrayEmails = taLista.value.split("\n").slice();


  console.log(`Tenemos ${arrayEmails.length} emails`);
  let indAAct = 0;

  let numLineas = 0;
  let numEncontrados = 0;

  function pasaSiguiente() {
    // actualizadmos textaera
    taLista.value = arrayEmails.join('\n');
    // pasamos siguiente linea
    indAAct++;
    console.log(`Considerando linea ${indAAct} de ${arrayEmails.length}`);
    if (indAAct < arrayEmails.length) {
	    setTimeout(trataAlumno, 50);
    } else {
      console.log("Ya están todos. Los añadimos");
      selAdd.dispatchEvent(new Event("change"));
      document.getElementById("btnAñade").disabled = true;
      const btAplica = document.getElementById("btnAplica");
      btAplica.disabled = false;
      btAplica.textContent = btAplica.textContent + ` (${numEncontrados} de ${numLineas})`;
      btAplica.onclick = () => {
        console.log('Añadimos los alumnos');
	      btnAdd.click();
        document.getElementById("modalAñade").style.display = "none";
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
    const arrEmail = /alu[0-9]{10}/.exec(linAct);
    if (arrEmail === null) {
      console.log('No email en esta linea');
      arrayEmails[indAAct] = arrayEmails[indAAct] + ' NO RECONOCIDO';
      pasaSiguiente();
      return;
    }

    const email = arrEmail[0];
    console.log(`El email es ${email}`);

    addSelSearch.value = `${email}@`;
    console.log(`Modificado valor imput`);
    // addSelSearch.dispatchEvent(new Event("change"));
//    addSelSearch.dispatchEvent(new KeyboardEvent('keydown',{'key':'@'}));
    addSelSearch.dispatchEvent(new KeyboardEvent('keyup',{'key':'@'}));

    console.log('Mandado evento de input');

    setTimeout(() => {

      let indice = -1;
    	console.log(`Vamos a recorrer la lista de ${selAdd.options.length} elementos en busca de ${email}`);
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
    }, 2000);

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
  <div class="modal-content">
    <span id="btnCloseModal" class="modal-close">&times;</span>
		<label for="listaemails"> Pega lista de e-mails de alumnos a añadir al grupo</label>
		<textarea id="listaemails" cols="26" rows="10" placeholder="aluXXXXXXXXX@ull.edu.es"></textarea>
		<button id="btnAñade" type="button">Selecciona alumnos</button>
		<button id="btnAplica" type="button" disabled="">Añade alumnos</button>
  </div>
	`;
  divModal.classList.add('modal');
  divModal.setAttribute("id","modalAñade");
	divPadre.appendChild(divModal);

  btnEle.onclick = () => {
    divModal.style.display = 'block';
  }

  const closeModal = document.getElementById("btnCloseModal");
  closeModal.onclick = () => {
    divModal.style.display = "none";
	}

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == divModal) {
      divModal.style.display = "none";
    }
  }

	document.getElementById("btnAñade").onclick = añadeDeLista;

}

aniadeUsuarios();

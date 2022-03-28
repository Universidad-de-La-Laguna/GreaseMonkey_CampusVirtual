// ==UserScript==
// @name     Boton edicion arriba
// @version  1
// @include  https://campus*.ull.es/course/view.php*
// @description   Autor: Alberto Hamilton 2020. Licencia: GPLv3.
// @grant    none
// ==/UserScript==


function colocaBotonEdicion() {
  const buttons = document.getElementsByTagName('button');
  
  console.log('Encontrados ' + buttons.length + ' botones en página');

  for(let i = 0; i < buttons.length; i++) {
    const ba = buttons[i];
		if(ba.innerText.match(/ctivar edición/)) {
    	console.log(`Encontrado boton con texto "${ba.innerText}"`);
      ba.style.cssText += 'position: fixed; top: 4px; right: 370px; z-index: 1000; filter: invert(100%);';
    }
  }
}

//setTimeout(colocaBotonEdicion, 10000);


colocaBotonEdicion();

# GreaseMonkey_CampusVirtual

Serie de scripts de [GreaseMonkey][GM] útiles para mejorar el funcionamiento
del campus virtual de la ULL.
Son funcionales para los campus virtuales de los cursos 2019-2020 al
2021-2022 al menos.

Los scritps están desarrollados para [Firefox][FF],
aunque debería funcionar también para Chrome o Chromium.

[GM]: https://www.greasespot.net/
[FF]: https://www.mozilla.org/es-ES/firefox/

Una vez instalado el [plugin para Firefox][GMFF] bastará con pulsar en
el `.js`  correspondiente al scritp y éste se instalará automáticamente.

[GMFF]:https://addons.mozilla.org/es/firefox/addon/greasemonkey/

## Añade usuarios grupo Moodle

Consiste en añadir estudiantes a un grupo a partir de la lista
de sus direcciones de correo (alus)
sin necesidad de seleccionarlos uno a uno,
lo que puede ahorrar mucho tiempo para grupos grandes.

He creado un video explicativo que puedes visionar
en [esta dirección](https://tuvideo.encanarias.info/videos/watch/8514a3d0-5c69-414f-9453-4a9f8e8303fe).

Enlace para instalación [aquí](https://github.com/Universidad-de-La-Laguna/GreaseMonkey_CampusVirtual/raw/master/A%C3%B1ade%20usuarios%20grupo%20Moodle/A%C3%B1ade%20usuarios%20grupo%20Moodle.user.js).

## Añade usuarios aulas Moodle

Permite matricular
estudiantes en un aula virtual
a partir de la lista
de sus direcciones de correo (alus).

Para que funcione es necesario acceder a la página de
*Matrícula Manual* de estudiantes a través de las opciones:

"*Participantes*" → Rueda dentada →
"*Métodos de matriculación*" →
En la fila de "*Matriculación Manual*" y columna de "*Editar*"
pulsar el icono de una *persona con un signo +*.

Esta secuencia debe llevar a una página con una
URL que contiene `enrol/manual/manage.php`, en la
que se activará el scritp, y donde se podrá usar el botón
de "*Añadir de lista*" de manera análoga al
scritp anterior.

**No funciona** si directamente en "*Participantes*" se le da
al botón de "*Matricular usuarios*"

Enlace para la instalación [aqui](https://github.com/Universidad-de-La-Laguna/GreaseMonkey_CampusVirtual/raw/master/A%C3%B1ade%20usuarios%20aulas%20Moodle/A%C3%B1ade%20usuarios%20aulas%20Moodle.user.js).

## Ocultar/Mostrar varios elementos a la vez

En ocasiones queremos ocultar o mostrar un conjunto grande de elementos de
un módulo del aula virtual.
Por ejemplo, cuando abrimos un nuevo tema pero queremos ocultar la gran
mayoría de los items que tenemos del curso pasado.

Este script, cuando se está en modo edición en un aula virtual,
crea un botón al principio de cada módulo etiquetado *"Oculta/Muestra"*.
Al pulsar se abre una ventana modal en la que figura la lista de
los items del módulo con un casilla *check* que indica si está visible
u oculto, así como información de su tipo y título.
Se puede entonces cambiar el estado de los que se desee.
También aparece en la parte superior las acciones *"Mostrar todos"* y
*"Mostrar Nada*" que sitúan el valor correspondiente en todos los *check*.

En la parte inferior está el botón *"Aplicar cambios"* que comienza el proceso
para aplicar los cambios deseados en la visibilidad.
Este proceso es lento ya que se te tiene que hacer una
llamada a la API por cada elemento modificado.
Se muestra una barra de progreso y los items que se llevan modificados.

Al terminar se recarga la página.

Enlace para la instalación [aqui](https://github.com/Universidad-de-La-Laguna/GreaseMonkey_CampusVirtual/raw/master/Moodle%20oculta%20muestra%20varios/Moodle%20oculta%20muestra%20varios.user.js)

## Crear una rúbrica a partir de hoja de cálculo

Una rúbrica compleja es difícil de gestionar en Moodle ya que, una vez
creada, solo se pueden añadir nuevos indicadores al final.
Si queremos
colocarlo en otra posición es necesario ir pulsando la flecha de subir
numerosas veces, lo que resulta tedioso.

Este script permite crear una nueva rúbrica, desde cero, a partir de información
que tengamos en una hoja de cálculo.
La primer columna debe corresponder a la descripción del indicador y
las siguientes deben contener la descripción del nivel seguido del símbolo `→`
seguido del peso.
Es posible que los indicadores tengan distinto número de niveles.

Una vez se tenga definida la rúbrica en la hoja de cálculo con la estructura
indicada,
basta copiar y pegar en la ventana modal que activa el script al pulsar
el botón *"Añade Rubrica"*.

Al pegar, las columnas deben quedar separadas por el carácter tabulador.
Si no es así, sería necesario exportar la hoja a un CSV, indicando que
use el tabulador como separador de columnas,
y luego copiar y pegar del CSV generado.

## Botón edición arriba

Sitúa el botón de *"Activa edición"*,
y su correspondiente *"Desactiva edición"*,
fijo en la parte superior de la página principal del aula virtual,
en un color destacado y **siempre visible**.

Enlace para la instalación [aqui](https://github.com/Universidad-de-La-Laguna/GreaseMonkey_CampusVirtual/raw/master/Boton%20edicion%20arriba/Boton%20edicion%20arriba.user.js)

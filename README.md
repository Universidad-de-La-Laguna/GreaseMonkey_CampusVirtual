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

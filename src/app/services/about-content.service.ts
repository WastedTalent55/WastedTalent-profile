import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AboutContentService {

  aboutText: string = `
  Wasted Talent es mi espacio para experimentar y crecer como desarrollador.
  Estoy comenzando en el mundo tech, pero ya tengo conocimientos en desarrollo web
  (HTML, CSS, JS, React, Angular, Webflow), bases de datos (MySQL, Python) y manejo
  de datos para inteligencia artificial.

  Recientemente exploré el código creativo con JavaScript y p5.js.

  Actualmente estudio Ingeniería en Software en la Universidad Virtual del Estado
  de Guanajuato, y aunque aún no tengo experiencia laboral, tengo muchísima curiosidad
  y aprendo rapidísimo.

  Cuando no estoy escribiendo código, me convierto en HandyQueer: me ensucio las manos
  arreglando y transformando espacios a través de un proyecto de remodelación que brinda
  servicios seguros y confiables para mujeres y disidencias.
  `;
}

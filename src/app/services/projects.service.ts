import { Injectable } from '@angular/core';

export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projects: Project[] = [
    {
      title: 'Futuros que están siendo',
      description: 'Un libro digital interactivo desarrollado en colaboración con la UNAM y Tierra Adentro. Publicado en Webflow, ofrece una experiencia de lectura dinámica, combinando diseño editorial y recursos digitales.',
      imageUrl: 'assets/img/proyectos/proyecto_libro.png',
      link: 'https://futuros-que-estan-siendo-548080.webflow.io/'
    },
    {
      title: 'Animacion de ojos',
      description: 'Primer experimento con p5.js Un pequeño proyecto visual hecho con código desde cero usando p5.js, una librería de JavaScript para crear gráficos interactivos. Esto es parte de lo que estoy aprendiendo en el camino.',
      imageUrl: 'assets/img/proyectos/proyecto_ojos.png',
      link: 'https://ojos-p5.netlify.app/'
    },
    {
      title: 'Revista Digital | Informa Pádel',
      description: 'Diseño e implementación de una revista digital en Squarespace, con énfasis en estructura editorial, experiencia de lectura y adaptación responsive. Proyecto orientado a la autonomía del cliente y la consistencia visual.',
      imageUrl: 'assets/img/proyectos/proyecto_informaPadel.png',
      link: 'https://www.informapadel.com/'
    }
  ];

  getProjects(): Project[] {
    return this.projects;
  }
}

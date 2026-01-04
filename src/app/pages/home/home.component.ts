import { Component } from '@angular/core';
import { ProjectsService, Project } from '../../services/projects.service';
import { ProjectCardComponent } from '../../components/tarjeta-proyecto/project-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  projects: Project[];

  constructor(private projectsService: ProjectsService) {
    this.projects = this.projectsService.getProjects();
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

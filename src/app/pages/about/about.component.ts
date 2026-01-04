import { Component } from '@angular/core';
import { ImageParticlesComponent } from '../../components/image-particles/image-particles.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ImageParticlesComponent, NavbarComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})

export class AboutComponent {
 imageCompact = false;

  onImageDone() {
    // pequeña pausa para que se disfrute el momento
    setTimeout(() => {
      this.imageCompact = true;
    }, 180);
  }
}

import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import p5 from 'p5';
import { NgFor } from '@angular/common';
import { ProjectCardComponent } from '../../components/tarjeta-proyecto/project-card.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ProjectsService, Project } from '../../services/projects.service';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [NgFor, ProjectCardComponent, NavbarComponent],
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements AfterViewInit, OnDestroy {

  projects: Project[] = [];

  constructor(private projectsService: ProjectsService) {
    this.projects = this.projectsService.getProjects();
  }

  private p5Instance!: p5;

  ngAfterViewInit(): void {
    this.createSketch();
  }

  ngOnDestroy(): void {
    this.p5Instance?.remove();
  }

  private createSketch() {
    const sketch = (p: p5) => {

      let container!: HTMLElement;
      let w = 0;
      let h = 0;

      let font: p5.Font | null = null;
      let maskLayer!: p5.Graphics;
      let textMask!: p5.Graphics;

      const LOW_POWER =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency &&
      navigator.hardwareConcurrency <= 4;

      const TOTAL = LOW_POWER ? 120 : 200;


      // 🧲 mouse
      const MAGNET_RADIUS = 260;
      const SPRING_FORCE = 0.015;
      const SWIRL_FORCE = 0.012;
      const DAMPING = 0.92;

      // 🌊 idle vivo
      const IDLE_CENTER_PULL = 0.0008;
      const IDLE_DAMPING = 0.99;
      const IDLE_NOISE_FORCE = 0.08;
      const IDLE_BASE_DRIFT = 0.03;

      interface Shape {
        x: number;
        y: number;
        w: number;
        h: number;
        vx: number;
        vy: number;
        ax: number;
        ay: number;
        angle: number;
        rotationSpeed: number;
        intenso: boolean;
        noiseOffset: number;
      }

      const shapes: Shape[] = [];

      p.setup = () => {
  container = document.getElementById('p5-banner') as HTMLElement;

  if (!container) {
    console.error('No existe el contenedor #p5-banner en el DOM');
    return;
  }

  w = container.offsetWidth;
  h = container.offsetHeight;

  console.log('container size', w, h);

  const canvas = p.createCanvas(w, h);
  canvas.parent(container);

  maskLayer = p.createGraphics(w, h);
  textMask = p.createGraphics(w, h);
  textMask.clear();
  textMask.fill(255);
  textMask.textAlign(p.CENTER, p.CENTER);

  p.frameRate(40);
  p.rectMode(p.CENTER);
  p.noStroke();
  p.noiseSeed(Math.floor(Math.random() * 10000));

  p.loadFont('assets/BadeenDisplay-Regular.ttf', f => {
    font = f;
    updateTextMask();
  });

  for (let i = 0; i < TOTAL; i++) {
    const square = p.random() > 0.5;
    const rw = square ? p.random(30, 70) : p.random(80, 160);
    const rh = square ? rw : p.random(30, 80);

    shapes.push({
      x: p.random(w),
      y: p.random(h),
      w: rw,
      h: rh,
      vx: p.random(-1, 1),
      vy: p.random(-1, 1),
      ax: 0,
      ay: 0,
      angle: p.random(p.TWO_PI),
      rotationSpeed: p.random(-0.01, 0.01),
      intenso: false,
      noiseOffset: p.random(1000)
    });
  }
};


  function updateTextMask() {
  if (!font) return;

  textMask.clear();                 // <-- deja el fondo transparente
  textMask.noStroke();
  textMask.fill(255);               // blanco = visible (alpha 255)
  textMask.textFont(font);
  textMask.textAlign(p.CENTER, p.CENTER);

  const sideMargin = 80;
  const availableWidth = p.width - sideMargin * 2;
  const baseSize = 300;

  textMask.textSize(baseSize);
  const widest = textMask.textWidth('WASTED TALENT');

  const scaleX = availableWidth / widest;
  const scaleY = (p.height * 0.9) / baseSize;

  textMask.textSize(baseSize * Math.min(scaleX, scaleY));
  textMask.text('WASTED TALENT', p.width / 2, p.height / 2);
}




      p.draw = () => {
        p.background(15, 10, 10);

        const mx = p.mouseX;
        const my = p.mouseY;
        const mouseInside = mx >= 0 && mx <= p.width && my >= 0 && my <= p.height;
        if (mouseInside) {
          p.frameRate(40);
        } else {
          p.frameRate(24); // más lento, pero continuo
        }

        maskLayer.clear();
        maskLayer.rectMode(p.CENTER);
        maskLayer.noStroke();

        const cx = p.width / 2;
        const cy = p.height / 2;

        for (const s of shapes) {

          s.ax = 0;
          s.ay = 0;
          s.intenso = false;

          if (mouseInside) {
            const dx = mx - s.x;
            const dy = my - s.y;
            const dist = Math.hypot(dx, dy);

            if (dist < MAGNET_RADIUS && dist > 0.001) {
              const nx = dx / dist;
              const ny = dy / dist;
              const pull = (MAGNET_RADIUS - dist) * SPRING_FORCE;

              s.ax += nx * pull;
              s.ay += ny * pull;
              s.ax += -ny * SWIRL_FORCE * pull;
              s.ay += nx * SWIRL_FORCE * pull;

              s.intenso = true;
            }

            s.vx *= DAMPING;
            s.vy *= DAMPING;

          } else {
            // 🌊 movimiento orgánico autónomo
            const dx = cx - s.x;
            const dy = cy - s.y;
            const dist = Math.hypot(dx, dy) + 0.001;

            const nx = dx / dist;
            const ny = dy / dist;

            // leve atracción al centro
            s.ax += nx * IDLE_CENTER_PULL;
            s.ay += ny * IDLE_CENTER_PULL;

            // ruido orgánico
            const n = p.noise(s.noiseOffset);
            s.noiseOffset += 0.002;

            const angle = n * p.TWO_PI * 2;

            s.ax += Math.cos(angle) * IDLE_NOISE_FORCE;
            s.ay += Math.sin(angle) * IDLE_NOISE_FORCE;

            // drift constante
            s.ax += p.random(-IDLE_BASE_DRIFT, IDLE_BASE_DRIFT);
            s.ay += p.random(-IDLE_BASE_DRIFT, IDLE_BASE_DRIFT);

            s.vx *= IDLE_DAMPING;
            s.vy *= IDLE_DAMPING;
          }

          s.vx += s.ax;
          s.vy += s.ay;

          s.x += s.vx;
          s.y += s.vy;
          s.angle += s.rotationSpeed;

          // wrap
          if (s.x < -120) s.x = p.width + 120;
          if (s.x > p.width + 120) s.x = -120;
          if (s.y < -120) s.y = p.height + 120;
          if (s.y > p.height + 120) s.y = -120;

          maskLayer.fill(
            s.intenso ? 255 : 190,
            s.intenso ? 200 : 80,
            s.intenso ? 0 : 90,
            s.intenso ? 220 : 140
          );

          maskLayer.push();
          maskLayer.translate(s.x, s.y);
          maskLayer.rotate(s.angle);
          maskLayer.rect(0, 0, s.w, s.h);
          maskLayer.pop();
        }

        const masked = maskLayer.get();
const maskImage = textMask.get(); // convierte Graphics → Image
masked.mask(maskImage);
p.image(masked, 0, 0);

        
      };

      p.windowResized = () => {
        if (!container) return;
        w = container.offsetWidth;
        h = container.offsetHeight;
        p.resizeCanvas(w, h);
        maskLayer.resizeCanvas(w, h);
        textMask.resizeCanvas(w, h);
        updateTextMask();
      };

    };

    this.p5Instance = new p5(sketch);
  }
}

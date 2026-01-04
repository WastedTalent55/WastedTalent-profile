import {Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-image-particles',
  standalone: true,
  imports: [],
  templateUrl: './image-particles.component.html',
  styleUrls: ['./image-particles.component.css']
})

export class ImageParticlesComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Output() animationDone = new EventEmitter<void>();


  image!: HTMLImageElement;
  imageAlpha = 0;
  revealImage = false;

  ctx!: CanvasRenderingContext2D;
  animationId = 0;
  particles: Particle[] = [];

  circleRadius = 140;
  circleX = 150;
  circleY = 150;


  ngAfterViewInit() {
    this.setupCanvas();
    this.loadImage();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }

  setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = 300;
    canvas.height = 300;
    this.ctx = canvas.getContext('2d')!;
  }

  loadImage() {
  const img = new Image();
  img.src = 'assets/img/me.jpg';

  img.onload = () => {
    this.image = img;

    this.ctx.drawImage(img, 0, 0, 300, 300);
    const imageData = this.ctx.getImageData(0, 0, 300, 300);
    this.createParticles(imageData);

    this.ctx.clearRect(0, 0, 300, 300);
    this.animate();
  };
  }

  applyCircleMask() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(
      this.circleX,
      this.circleY,
      this.circleRadius,
      0,
      Math.PI * 2
    );
    this.ctx.closePath();
    this.ctx.clip();
  }

  restoreMask() {
    this.ctx.restore();
  }

  createParticles(imageData: ImageData) {
    const data = imageData.data;

    for (let y = 0; y < imageData.height; y += 6) {
      for (let x = 0; x < imageData.width; x += 6) {
        const index = (y * imageData.width + x) * 4;

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        const brightness = (r + g + b) / 3;

        if (brightness < 200) {
          this.particles.push(new Particle(x, y, r, g, b));
        }
      }
    }
  }

  animate = () => {
    // 👇 si ya terminó todo, NO seguimos animando
    if (this.animationFinished) return;

    this.ctx.fillStyle = "#0c0d11";
    this.ctx.fillRect(0, 0, 300, 300);

    // 👇 aplica máscara circular
    this.applyCircleMask();

    let completed = 0;

    for (const p of this.particles) {
      p.update();
      p.draw(this.ctx);
      if (p.progress >= 1) completed++;
    }

    // cuando casi todas llegaron
    if (completed > this.particles.length * 0.95) {
      this.revealImage = true;
    }

    // revelado suave de la imagen real
    if (this.revealImage) {
      this.imageAlpha += 0.01;

      this.ctx.globalAlpha = Math.min(this.imageAlpha, 1);
      this.ctx.drawImage(this.image, 0, 0, 300, 300);
      this.ctx.globalAlpha = 1;

      // 👇 aquí se fija el estado final
      if (this.imageAlpha >= 1) {
        this.animationFinished = true;

        // dibuja una última vez la imagen limpia
        this.ctx.clearRect(0, 0, 300, 300);
        this.ctx.drawImage(this.image, 0, 0, 300, 300);
        
        this.animationDone.emit();
        cancelAnimationFrame(this.animationId);
        return;
      }
    }

    this.animationId = requestAnimationFrame(this.animate);
  };


  animationFinished = false;

}

class Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;

  size: number;
  color: string;
  alpha = 0;

  // animación
  progress = 0;
  speed: number;

  constructor(x: number, y: number, r: number, g: number, b: number) {
    this.baseX = x;
    this.baseY = y;

    // 👇 nacen dispersas
    this.x = Math.random() * 300;
    this.y = Math.random() * 300;

    const brightness = (r + g + b) / 3;
    this.size = brightness < 100 ? 1.6 : 1.0;
    this.color = `rgb(${r}, ${g}, ${b})`;

    this.speed = 0.01 + Math.random() * 0.02;
  }

  update() {
    if (this.progress < 1) {
      this.progress += this.speed;

      // easing real, más humano
      const ease = this.progress < 1
      ? 1 - Math.pow(1 - this.progress, 3)
      : 1;

      this.x = this.x + (this.baseX - this.x) * 0.08;
      this.y = this.y + (this.baseY - this.y) * 0.08;

      this.alpha = ease;
    }
  }


  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}



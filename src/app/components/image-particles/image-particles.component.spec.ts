import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageParticlesComponent } from './image-particles.component';

describe('ImageParticlesComponent', () => {
  let component: ImageParticlesComponent;
  let fixture: ComponentFixture<ImageParticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageParticlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageParticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

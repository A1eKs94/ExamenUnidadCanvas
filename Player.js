import { Rectangulo } from './Rectangulo.js';

export class Player extends Rectangulo {
  constructor(alto, ancho, x, y, color, speed) {
    super(alto, ancho, x, y, color, speed);

    // Inicializar imágenes
    this.imageRight = new Image();
    this.imageRight.src = './resources/frog_green_right.png';
    this.imageLeft = new Image();
    this.imageLeft.src = './resources/frog_green_left.png';

    this.imageRedRight = new Image();
    this.imageRedRight.src = './resources/frog_red_right.png';
    this.imageRedLeft = new Image();
    this.imageRedLeft.src = './resources/frog_red_left.png';

    this.imageBlueRight = new Image();
    this.imageBlueRight.src = './resources/frog_blue_right.png';
    this.imageBlueLeft = new Image();
    this.imageBlueLeft.src = './resources/frog_blue_left.png';

    // Imagen inicial y estado de carga
    this.currentImage = this.imageRight;
    this.imageLoaded = false;

    [this.imageRight, this.imageLeft, this.imageRedRight, this.imageRedLeft, this.imageBlueRight, this.imageBlueLeft].forEach(image => {
      image.onload = () => {
        this.imageLoaded = true;
      };
    });
  }

  render(ctx) {
    if (this.imageLoaded) {
      ctx.drawImage(this.currentImage, this.x, this.y, this.ancho, this.alto);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    }
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;

    // Actualizar imagen según dirección del movimiento
    // Movimiento hacia la derecha
    if (dx > 0) { 
      if (this.currentImage === this.imageRedLeft || this.currentImage === this.imageBlueLeft) {
        this.currentImage = this.currentImage === this.imageRedLeft ? this.imageRedRight : this.imageBlueRight;
      } else if (this.currentImage === this.imageLeft) {
        this.currentImage = this.imageRight;
      }
    // Movimiento hacia la izquierda
    } else if (dx < 0) { 
      if (this.currentImage === this.imageRedRight || this.currentImage === this.imageBlueRight) {
        this.currentImage = this.currentImage === this.imageRedRight ? this.imageRedLeft : this.imageBlueLeft;
      } else if (this.currentImage === this.imageRight) {
        this.currentImage = this.imageLeft;
      }
    }
  }

  // En caso de que el player y muros tengan el mismo color, se podra atravesar
  handleCollisionWithWalls(walls, prevX, prevY) {
    walls.forEach((wall) => {
      if (this.colision(wall)) {
        if (this.color !== wall.color) {
          this.x = prevX;
          this.y = prevY;
        }
      }
    });
  }

  // Cambiar el sprite dependienco del color
  changeAppearance(color) {
    switch (color) {
      case 'red':
        this.currentImage = this.imageRedRight;
        this.color = 'red';
        break;
      case 'blue':
        this.currentImage = this.imageBlueRight;
        this.color = 'blue';
        break;
      default:
        this.currentImage = this.imageRight;
        this.color = 'green';
        break;
    }
  }
}

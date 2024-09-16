export class Rectangulo {
    constructor(alto, ancho, x, y, color, speed, imageSrc = null) {
      this.alto = alto;
      this.ancho = ancho;
      this.x = x;
      this.y = y;
      this.color = color;
      this.speed = speed;
      this.imageSrc = imageSrc;
  
      // Cargar imagen si se proporciona
      if (this.imageSrc) {
        this.image = new Image();
        this.image.src = this.imageSrc;
        this.imageLoaded = false;
        this.image.onload = () => {
          this.imageLoaded = true;
        };
      } else {
        this.image = null;
      }
    }
  
    render(ctx) {
      if (this.image && this.imageLoaded) {
        ctx.drawImage(this.image, this.x, this.y, this.ancho, this.alto);
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.ancho, this.alto);
      }
    }
  
    colision(otro) {
      return (
        this.x < otro.x + otro.ancho &&
        this.x + this.ancho > otro.x &&
        this.y < otro.y + otro.alto &&
        this.y + this.alto > otro.y
      );
    }
  }
  
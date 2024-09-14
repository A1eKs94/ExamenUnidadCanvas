import { Player } from './Player.js';
import { Rectangulo } from './Rectangulo.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.pause = false;
        this.points = 0;
        this.initObjects();
        this.setupEventListeners();
        this.paint();
    }

    initObjects() {
        this.player = new Player(50, 50, 100, 100, "red", 5);
        this.target = new Rectangulo(10, 10, 150, 150, "black", 0);
        this.blueOrb = new Rectangulo(50, 50, 200, 200, null, 0, './resources/blueOrb.png');
        this.redOrb = new Rectangulo(50, 50, 280, 280, null, 0, './resources/redOrb.png');

        this.walls = [
            new Rectangulo(100, 30, 0, 200, "blue", 0),
            new Rectangulo(100, 30, 250, 200, "blue", 0),
            new Rectangulo(30, 300, 100, 20, "blue", 0),
            new Rectangulo(30, 300, 100, 450, "blue", 0),
            new Rectangulo(100, 30, 470, 200, "red", 0)
        ];
    }

    setupEventListeners() {
        document.addEventListener("keydown", (e) => {
            if (!this.pause) {
                const speed = this.player.speed;
                switch (e.keyCode) {
                    case 87: // 'W' key
                        this.movePlayer(0, -speed);
                        break;
                    case 83: // 'S' key
                        this.movePlayer(0, speed);
                        break;
                    case 65: // 'A' key
                        this.movePlayer(-speed, 0);
                        break;
                    case 68: // 'D' key
                        this.movePlayer(speed, 0);
                        break;
                    case 32: // Space key
                        this.pause = !this.pause;
                        break;
                }
            }
        });
    }

    movePlayer(dx, dy) {
        let prevX = this.player.x;
        let prevY = this.player.y;

        this.player.move(dx, dy);

        // En caso de que sobrepase los límites
        if (this.player.x < 0) {
            this.player.x = 1399;
        }
        if (this.player.x > 1400) {
            this.player.x = 0;
        }
        if (this.player.y < 0) {
            this.player.y = 899;
        }
        if (this.player.y > 900) {
            this.player.y = 0;
        }

        // Verificar colisión con muros
        this.player.handleCollisionWithWalls(this.walls, prevX, prevY);

        // Verificar colisión con el target y orbes
        if (this.player.colision(this.target)) {
            this.target.x = Math.floor(Math.random() * 490);
            this.target.y = Math.floor(Math.random() * 490);
            this.points += 1;
        }
        this.getOrb();

        this.paint();
    }

    getOrb() {
        if (this.player.colision(this.blueOrb)) {
          this.player.changeAppearance('blue');
          this.blueOrb.x = Math.floor(Math.random() * 490);
          this.blueOrb.y = Math.floor(Math.random() * 490);
        }
      
        if (this.player.colision(this.redOrb)) {
          this.player.changeAppearance('red');
          this.redOrb.x = Math.floor(Math.random() * 490);
          this.redOrb.y = Math.floor(Math.random() * 490);
        }
      }
      
    paint() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Points: " + this.points, 20, 20);

        // Dibujar el jugador
        this.player.render(this.ctx);

        // Dibujar el objetivo
        this.target.render(this.ctx);

        // Dibujar los orbes
        this.blueOrb.render(this.ctx);
        this.redOrb.render(this.ctx);

        // Dibujar las paredes
        this.walls.forEach((wall) => {
            wall.render(this.ctx);
        });

        if (this.pause) {
            this.ctx.font = "50px Arial";
            this.ctx.fillStyle = "black";
            this.ctx.fillText("P A U S A", 150, 200);
            this.ctx.fillStyle = "rgba(32, 45, 21, 0.3)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            requestAnimationFrame(() => this.paint());
        }
    }
}

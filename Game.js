import { Player } from './Player.js';
import { Rectangulo } from './Rectangulo.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.pause = false;
        this.points = 0;

        // Cargar imágenes para paredes y suelo
        this.wallImage = new Image();
        this.wallImage.src = './resources/maze_wall.png';

        this.floorImage = new Image();
        this.floorImage.src = './resources/floor.png';

        this.initObjects();
        this.setupEventListeners();
        this.paint();
    }



    initObjects() {
        // Contador de tiempo
        var minutesLabel = document.getElementById("minutes");
        var secondsLabel = document.getElementById("seconds");
        var totalSeconds = 0;
        setInterval(setTime, 1000);

        function setTime() {
            ++totalSeconds;
            secondsLabel.innerHTML = pad(totalSeconds % 60);
            minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
        }

        function pad(val) {
            var valString = val + "";
            if (valString.length < 2) {
                return "0" + valString;
            } else {
                return valString;
            }
        }

        this.player = new Player(50, 50, 50, 50, "white", 50);
        this.target = new Rectangulo(50, 50, 150, 150, "black", 0, './resources/target.png');
        this.blueOrb = new Rectangulo(50, 50, 200, 200, null, 0, './resources/blueOrb.png');
        this.redOrb = new Rectangulo(50, 50, 350, 250, null, 0, './resources/redOrb.png');

        this.maze = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        this.walls = [
            this.wall = new Rectangulo(50, 50, 300, 250, "red")
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

        // Obtener la posición actual en el laberinto
        const tileSize = 50;
        const tileX = Math.floor(this.player.x / tileSize);
        const tileY = Math.floor(this.player.y / tileSize);

        // Verificar colisión con muros
        if (this.maze[tileY] && this.maze[tileY][tileX] === 1) {
            this.player.x = prevX;
            this.player.y = prevY;
        }

        this.player.handleCollisionWithWalls(this.walls, prevX, prevY);

        // Verificar colisión con el target y orbes
        if (this.player.colision(this.target)) {
            this.target.x = Math.floor(Math.random() * (this.canvas.width - this.target.width));
            this.target.y = Math.floor(Math.random() * (this.canvas.height - this.target.height));
            this.points += 1;
        }
        this.getOrb();

        this.paint();
    }

    getOrb() {
        if (this.player.colision(this.blueOrb)) {
            this.player.changeAppearance('blue');
        }

        if (this.player.colision(this.redOrb)) {
            this.player.changeAppearance('red');
        }
    }

    paint() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Points: " + this.points, 20, 20);

        // Dibujar el laberinto
        const tileSize = 50;
        for (let y = 0; y < this.maze.length; y++) {
            for (let x = 0; x < this.maze[y].length; x++) {
                if (this.maze[y][x] === 1) {
                    // Dibujar pared
                    this.ctx.drawImage(this.wallImage, x * tileSize, y * tileSize, tileSize, tileSize);
                } else if (this.maze[y][x] === 0) {
                    // Dibujar suelo
                    this.ctx.drawImage(this.floorImage, x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }

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
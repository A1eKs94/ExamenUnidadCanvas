import { Player } from './Player.js';
import { Rectangulo } from './Rectangulo.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.pause = false;
        this.points = 0;

        // Variables para el temporizador
        this.totalSeconds = 0;
        this.startTime = Date.now();
        this.updateTime();

        // Cargar imágenes para paredes y suelo
        this.wallImage = new Image();
        this.wallImage.src = './resources/maze_wall.png';
        this.floorImage = new Image();
        this.floorImage.src = './resources/floor.png';

        // Cargar sonidos
        this.themeSound = new Audio('./resources/theme.mp3');
        this.pointSound = new Audio('./resources/point.mp3');

        this.initObjects();
        this.setupEventListeners();
        this.paint();
    }

    // Funcion para timer
    updateTime() {
        setInterval(() => {
            this.totalSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        }, 1000);
    }

    formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = seconds % 60;
        return `${this.pad(minutes)}:${this.pad(secs)}`;
    }

    pad(val) {
        return val < 10 ? '0' + val : val;
    }

    initObjects() {
        // Player
        this.player = new Player(50, 50, 50, 50, "white", 50);
        // Targets
        this.targets = [
            this.target = new Rectangulo(50, 50, 50, 250, null, 0, './resources/target.png'),
            this.target = new Rectangulo(50, 50, 950, 950, null, 0, './resources/target.png'),
            this.target = new Rectangulo(50, 50, 1700, 50, null, 0, './resources/target.png'),
            this.target = new Rectangulo(50, 50, 750, 550, null, 0, './resources/target.png'),
            this.target = new Rectangulo(50, 50, 250, 750, null, 0, './resources/target.png'),
            this.target = new Rectangulo(50, 50, 1150, 150, null, 0, './resources/target.png'),
            this.target = new Rectangulo(50, 50, 1250, 950, null, 0, './resources/target.png'),
        ];
        // Orb blue
        this.blueOrb = new Rectangulo(50, 50, 1550, 250, null, 0, './resources/blueOrb.png');
        // Orb red
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
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        // Arreglo de obstaculos de colores
        this.walls = [
            this.wall = new Rectangulo(50, 50, 300, 250, "red", 0, './resources/redWood.png'),
            this.wall = new Rectangulo(50, 50, 600, 450, "red", 0, './resources/redWood.png'),
            this.wall = new Rectangulo(50, 50, 1300, 950, "red", 0, './resources/redWood.png'),
            this.wall = new Rectangulo(50, 50, 50, 200, "blue", 0, './resources/blueWood.png'),
            this.wall = new Rectangulo(50, 50, 1750, 50, "blue", 0, './resources/blueWood.png'),
            this.wall = new Rectangulo(50, 50, 1150, 200, "blue", 0, './resources/blueWood.png'),
        ];
    }

    // Movimiento
    setupEventListeners() {
        document.addEventListener("keydown", (e) => {
            if (e.keyCode === 32) { // Space key
                this.pause = !this.pause;
                if (!this.pause) {
                    requestAnimationFrame(() => this.paint());
                }
            } else if (!this.pause) {
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
                }
            }
        });
    }

    movePlayer(dx, dy) {
        // Reproducir sonido
        this.themeSound.play();
        this.themeSound.loop = true
        // Obtener posicion anterior del jugador temporal
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
            this.points += 1;
        }

        this.getOrb();
        this.paint();

        // Al recoger target
        this.targets.forEach((target, index) => {
            if (this.player.colision(target)) {
                this.targets.splice(index, 1);
                this.pointSound.play();
                this.points += 1;
            }
            if (this.points >= 7) {
                alert("¡Felicidades! Has ganado el juego :) https://www.youtube.com/watch?v=cbQ4llmZZio");
                this.restartGame();
            }
        });
    }

    // Al tocar orbes cambiar apariencia
    getOrb() {
        if (this.player.colision(this.blueOrb)) {
            this.player.changeAppearance('blue');
        }

        if (this.player.colision(this.redOrb)) {
            this.player.changeAppearance('red');
        }
    }

    restartGame() {
        // Restablecer los puntos y el temporizador
        this.points = 0;
        this.totalSeconds = 0;
        this.startTime = Date.now();

        // Reiniciar la posición del jugador
        this.player.x = 50;
        this.player.y = 50;

        // Reposicionar los objetivos
        this.targets.forEach((target) => {
            this.targets = [
                this.target = new Rectangulo(50, 50, 50, 250, null, 0, './resources/target.png'),
                this.target = new Rectangulo(50, 50, 950, 950, null, 0, './resources/target.png'),
                this.target = new Rectangulo(50, 50, 1700, 50, null, 0, './resources/target.png'),
                this.target = new Rectangulo(50, 50, 750, 550, null, 0, './resources/target.png'),
                this.target = new Rectangulo(50, 50, 250, 750, null, 0, './resources/target.png'),
                this.target = new Rectangulo(50, 50, 1150, 150, null, 0, './resources/target.png'),
                this.target = new Rectangulo(50, 50, 1250, 950, null, 0, './resources/target.png'),
            ];
        });

        // Reiniciar el sonido de fondo
        this.themeSound.currentTime = 0;
        this.playThemeSound();
    }

    paint() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Puntos
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Puntos: " + this.points, 1950, 50);

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
        this.targets.forEach(target => target.render(this.ctx));

        // Dibujar los orbes
        this.blueOrb.render(this.ctx);
        this.redOrb.render(this.ctx);

        // Dibujar las paredes
        this.walls.forEach((wall) => {
            wall.render(this.ctx);
        });

        // Timer
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(this.formatTime(this.totalSeconds), 2300, 50);

        // Movimiento
        this.ctx.font = "20px Arial";
        this.ctx.fillText("Movimiento -> W - A - S - D", 1950, 120);

        // Info
        this.ctx.fillText("Consumir", 1950, 190);
        this.ctx.fillText("Transforma en", 2080, 190);
        this.ctx.fillText("Atraviesa", 2270, 190);

        // Info azul
        const orbeazul = new Image();
        orbeazul.src = "./resources/blueOrb.png";
        this.ctx.drawImage(orbeazul, 1950, 200, 80, 80);
        const ranaazul = new Image();
        ranaazul.src = "./resources/frog_blue_left.png";
        this.ctx.drawImage(ranaazul, 2090, 190, 80, 80);
        const bluewood = new Image();
        bluewood.src = "./resources/bluewood.png";
        this.ctx.drawImage(bluewood, 2280, 210, 60, 60);

        // Info rojo
        const orberojo = new Image();
        orberojo.src = "./resources/redOrb.png";
        this.ctx.drawImage(orberojo, 1950, 270, 80, 80);
        const ranaroja = new Image();
        ranaroja.src = "./resources/frog_red_left.png";
        this.ctx.drawImage(ranaroja, 2090, 270, 80, 80);
        const redwood = new Image();
        redwood.src = "./resources/redwood.png";
        this.ctx.drawImage(redwood, 2280, 290, 60, 60);

        // Objetivo
        this.ctx.fillText("El objetivo del juego es conseguir todos los", 1950, 400);
        this.ctx.fillText("puntos", 1950, 430);
        const coca = new Image();
        coca.src = "./resources/si.png";
        this.ctx.drawImage(coca, 2010, 450, 300, 300);

        // Pausa
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
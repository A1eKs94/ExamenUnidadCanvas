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

        requestAnimationFrame(() => this.paint());
    }

    // Funcion para timer
    updateTime() {
        this.totalSeconds = Math.floor((Date.now() - this.startTime) / 1000);
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

        // Target
        this.targetPositions = [
            // Reposicionar los objetivos
            { x: 50, y: 250 },
            { x: 950, y: 950 },
            { x: 1700, y: 50 },
            { x: 750, y: 550 },
            { x: 250, y: 750 },
            { x: 1150, y: 150 },
            { x: 1250, y: 950 }
        ];

        this.targets = this.targetPositions.map(pos => new Rectangulo(50, 50, pos.x, pos.y, null, 0, './resources/target.png'));

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
            new Rectangulo(50, 50, 300, 250, "red", 0, './resources/redWood.png'),
            new Rectangulo(50, 50, 600, 450, "red", 0, './resources/redWood.png'),
            new Rectangulo(50, 50, 1300, 950, "red", 0, './resources/redWood.png'),
            new Rectangulo(50, 50, 50, 200, "blue", 0, './resources/blueWood.png'),
            new Rectangulo(50, 50, 1750, 50, "blue", 0, './resources/blueWood.png'),
            new Rectangulo(50, 50, 1150, 200, "blue", 0, './resources/blueWood.png'),
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
        this.themeSound.loop = true;
        // Obtener posicion anterior del jugador temporal
        const prevX = this.player.x;
        const prevY = this.player.y;
        this.player.move(dx, dy);

        // Tamaño de cada espacio en el arreglo
        const tileSize = 50;
        // Obtener la posición actual en el laberinto
        const tileX = Math.floor(this.player.x / tileSize);
        const tileY = Math.floor(this.player.y / tileSize);

        // Verificar colisión con muros
        if (this.maze[tileY] && this.maze[tileY][tileX] === 1) {
            this.player.x = prevX;
            this.player.y = prevY;
        }

        this.player.handleCollisionWithWalls(this.walls, prevX, prevY);

        this.getOrb();

        this.targets.forEach((target, index) => {
            if (this.player.colision(target)) {
                this.targets.splice(index, 1);
                this.pointSound.play();
                // Verificar colisión con el target
                this.points += 1;
            }
            if (this.points >= 7) {
                alert("¡Felicidades! Has ganado el juego :) https://www.youtube.com/watch?v=cbQ4llmZZio");
                this.restartGame();
            }
        });

        this.paint();
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
        this.initObjects();
        // Reiniciar el sonido de fondo
        this.themeSound.currentTime = 0;
    }

    paint() {
        if (this.pause) return;

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
                } else {
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
        this.walls.forEach(wall => wall.render(this.ctx));

        // Timer
        this.ctx.fillText(this.formatTime(this.totalSeconds), 2300, 50);
        // Movimiento
        this.ctx.fillText("Movimiento -> W - A - S - D", 1950, 120);
        // Info
        this.ctx.fillText("Consumir", 1950, 190);
        this.ctx.fillText("Transforma en", 2080, 190);
        this.ctx.fillText("Atraviesa", 2270, 190);

        // Info rojo
        const redOrb = new Image();
        redOrb.src = './resources/redOrb.png';
        this.ctx.drawImage(redOrb, 1950, 230, 70, 70);
        const redFrog = new Image();
        redFrog.src = './resources/frog_red_left.png';
        this.ctx.drawImage(redFrog, 2100, 230, 70, 70);
        const redWoodImg = new Image();
        redWoodImg.src = './resources/redWood.png';
        this.ctx.drawImage(redWoodImg, 2290, 240, 50, 50);

        // Infor azul
        const blueOrb = new Image();
        blueOrb.src = './resources/blueOrb.png';
        this.ctx.drawImage(blueOrb, 1950, 310, 70, 70);
        const blueFrog = new Image();
        blueFrog.src = './resources/frog_blue_left.png';
        this.ctx.drawImage(blueFrog, 2100, 310, 70, 70);
        const blueWoodImg = new Image();
        blueWoodImg.src = './resources/blueWood.png';
        this.ctx.drawImage(blueWoodImg, 2290, 310, 50, 50);


        // Objetivo
        this.ctx.fillText("El objetivo del juego es conseguir todos los", 1950, 400);
        this.ctx.fillText("puntos", 1950, 430);
        const coca = new Image();
        coca.src = "./resources/si.png";
        this.ctx.drawImage(coca, 2010, 450, 300, 300);

        this.updateTime();

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

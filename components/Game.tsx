import { useEffect, useRef } from "react";
import Phaser from "phaser";

class MainScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Rectangle;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private walls?: Phaser.GameObjects.Rectangle[];

  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    // Create a simple grid-based map
    this.createMap();

    // Create player
    this.player = this.add.rectangle(400, 300, 32, 32, 0x00ff00);
    this.physics.add.existing(this.player);

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setCollideWorldBounds(true);
    playerBody.setBounce(0);

    // Get cursor keys
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Add collision between player and walls
    if (this.walls) {
      this.walls.forEach(wall => {
        this.physics.add.collider(this.player!, wall);
      });
    }
  }

  createMap() {
    // Define room layout (0 = empty, 1 = wall)
    const mapLayout = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    // Create floor (background)
    const graphics = this.add.graphics();
    graphics.fillStyle(0x222222);  // Dark gray for floor
    graphics.fillRect(0, 0, 800, 600);

    const tileSize = 64;  // Size of each tile
    this.walls = [];

    // Create walls based on the layout
    mapLayout.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === 1) {
          const wall = this.add.rectangle(
            x * tileSize + tileSize/2, 
            y * tileSize + tileSize/2, 
            tileSize, 
            tileSize, 
            0x666666  // Light gray for walls
          );
          this.physics.add.existing(wall, true);  // true makes it static
          this.walls?.push(wall);
        } else {
          // Add floor tile decoration (optional)
          this.add.rectangle(
            x * tileSize + tileSize/2,
            y * tileSize + tileSize/2,
            tileSize - 1,  // Slightly smaller to create grid effect
            tileSize - 1,
            0x333333  // Slightly lighter than background for floor tiles
          );
        }
      });
    });

    // Add some furniture (decorative elements)
    this.addFurniture();
  }

  addFurniture() {
    // Add a "desk" (yellow rectangle)
    const desk = this.add.rectangle(400, 200, 128, 64, 0x8B4513);
    this.physics.add.existing(desk, true);
    this.walls?.push(desk);

    // Add some "chairs" (brown squares)
    const chair1 = this.add.rectangle(400, 150, 32, 32, 0xA0522D);
    const chair2 = this.add.rectangle(400, 250, 32, 32, 0xA0522D);
    this.physics.add.existing(chair1, true);
    this.physics.add.existing(chair2, true);
    this.walls?.push(chair1, chair2);

    // Add a "plant" (green circle)
    const plant = this.add.circle(600, 400, 20, 0x228B22);
    this.physics.add.existing(plant, true);
    this.walls?.push(plant as unknown as Phaser.GameObjects.Rectangle);
  }

  update() {
    if (!this.player || !this.cursors) return;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    const speed = 160;

    // Reset velocity
    body.setVelocity(0);

    // Movement logic
    if (this.cursors.left.isDown) {
      body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(speed);
    }

    // Normalize diagonal movement
    if (body.velocity.x !== 0 && body.velocity.y !== 0) {
      body.setVelocity(
        body.velocity.x * 0.707,
        body.velocity.y * 0.707
      );
    }
  }
}

export default function Game() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
          },
        },
        scene: MainScene,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      };

      const game = new Phaser.Game(config);

      return () => {
        game.destroy(true);
      };
    }
  }, []);

  return <div ref={gameRef} />;
}
import { useEffect, useRef } from "react";
import Phaser from "phaser";

class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private borders!: Phaser.GameObjects.Rectangle[];

  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    this.createBorders();
    // Create a simple rectangle as the player
    this.player = this.add.rectangle(400, 300, 32, 32, 0x00ff00);

    // Enable physics on the player
    this.physics.add.existing(this.player);

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setCollideWorldBounds(true);

    playerBody.setBounce(0.2);

    // Get cursor keys
    if (this.input.keyboard)
      this.cursors = this.input.keyboard.createCursorKeys();
  }

  createBorders() {
    const borderWidth = 4;
    const gameWidth = this.sys.game.config.width as number;
    const gameHeight = this.sys.game.config.height as number;

    // Create visible borders
    this.borders = [
      // Top border
      this.add.rectangle(
        gameWidth / 2,
        borderWidth / 2,
        gameWidth,
        borderWidth,
        0xff0000
      ),
      // Bottom border
      this.add.rectangle(
        gameWidth / 2,
        gameHeight - borderWidth / 2,
        gameWidth,
        borderWidth,
        0xff0000
      ),
      // Left border
      this.add.rectangle(
        borderWidth / 2,
        gameHeight / 2,
        borderWidth,
        gameHeight,
        0xff0000
      ),
      // Right border
      this.add.rectangle(
        gameWidth - borderWidth / 2,
        gameHeight / 2,
        borderWidth,
        gameHeight,
        0xff0000
      ),
    ];

    // Add physics to borders
    this.borders.forEach((border) => {
      this.physics.add.existing(border, true); // true makes it static
    });

    // Add collision between player and borders
    // this.physics.add.collider(this.player, this.borders);
  }

  update() {
    // Cast player to Physics.Arcade.Body to access velocity
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    // Reset velocity
    body.setVelocity(0);

    // Movement logic
    if (this.cursors.left.isDown) {
      body.setVelocityX(-200);
    }
    if (this.cursors.right.isDown) {
      body.setVelocityX(200);
    }
    if (this.cursors.up.isDown) {
      body.setVelocityY(-200);
    }
    if (this.cursors.down.isDown) {
      body.setVelocityY(200);
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
            gravity: { x: 300, y: 0 },
            debug: false,
          },
        },
        scene: MainScene,
      };

      const game = new Phaser.Game(config);

      return () => {
        game.destroy(true);
      };
    }
  }, []);

  return <div ref={gameRef} />;
}

import { useEffect, useRef } from "react";
import Phaser from "phaser";

class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    // Create a simple rectangle as the player
    this.player = this.add.rectangle(400, 300, 32, 32, 0x00ff00);

    // Enable physics on the player
    this.physics.add.existing(this.player);

    // Get cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();
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
            gravity: { y: 0 },
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

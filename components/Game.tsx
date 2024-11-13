import { useEffect, useRef } from "react";
import Phaser from "phaser";

class MainScene extends Phaser.Scene {
  // private player?: Phaser.GameObjects.Rectangle;
  private player?: Phaser.GameObjects.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    // Load images
    this.load.image("officeBackground", "./assets/bg.jpg");
    this.load.image("desk", "./assets/desk.png");
    this.load.image("chair", "./assets/chair1.png");
    this.load.image("computer", "./assets/computer.png");
    this.load.image("mario", "./assets/mario.jpg");
  }

  create() {
    // Add background image
    this.add.image(400, 300, "officeBackground").setDisplaySize(800, 600);

    // Create player
    this.player = this.add.sprite(400, 300, "mario");
    this.player.setDisplaySize(32, 32); // Adjust size as needed
    this.physics.add.existing(this.player);
    
    // this.player = this.add.rectangle(400, 300, 8, 8, 0x000000);
    // this.physics.add.existing(this.player);
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setCollideWorldBounds(true);
    playerBody.setBounce(0);

    // Create some office furniture
    const desk = this.add.image(500, 200, "desk").setDisplaySize(128, 64);
    this.physics.add.existing(desk, true);

    const chair = this.add.image(450, 250, "chair").setDisplaySize(32, 32);
    this.physics.add.existing(chair, true);

    const computer = this.add.image(500, 180, "computer").setDisplaySize(64, 32);
    this.physics.add.existing(computer, true);

    // Set up collisions with player
    this.physics.add.collider(this.player!, desk);
    this.physics.add.collider(this.player!, chair);
    this.physics.add.collider(this.player!, computer);

    // Get cursor keys
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
  }

  update() {
    if (!this.player || !this.cursors) return;
  
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const speed = 160;
    body.setVelocity(0);
  
    // Move left or right and flip Mario's image accordingly
    if (this.cursors.left.isDown) {
      body.setVelocityX(-speed);
      this.player.setFlipX(false);  // Flip Mario to face left
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(speed);
      this.player.setFlipX(true);  // Keep Mario facing right
    }
  
    // Move up or down
    if (this.cursors.up.isDown) {
      body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(speed);
    }
  
    // Normalize diagonal movement
    if (body.velocity.x !== 0 && body.velocity.y !== 0) {
      body.setVelocity(body.velocity.x * 0.707, body.velocity.y * 0.707);
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
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      const game = new Phaser.Game(config);

      return () => {
        game.destroy(true);
      };
    }
  }, []);

  return <div ref={gameRef} />;
}

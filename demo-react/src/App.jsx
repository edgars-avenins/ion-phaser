import React, { useState, useEffect } from 'react'
import Phaser from 'phaser'
import logo from './assets/logo.png'

import './App.css'
import Game from './Game'


class MainScene extends Phaser.Scene {
  constructor(){
    super('main')
  }

  preload(){
    this.load.image('covid', 'assets/covid.png')
    this.load.image('spark0', 'assets/blue.png')
    this.load.image('spark1', 'assets/red.png')
  }
  
  init () {
    this.cameras.main.setBackgroundColor('#77252A')
    this.clicked = 0
    this.lifes = 3
    this.victory = true
  }

  
  create () {
    if(this.victory === 'win'){
      var p0 = new Phaser.Math.Vector2(gameConfig.width / 2 - 200, 500);
      var p1 = new Phaser.Math.Vector2(gameConfig.width / 2 - 200, 200);
      var p2 = new Phaser.Math.Vector2(gameConfig.width / 2 + 200, 200);
      var p3 = new Phaser.Math.Vector2(gameConfig.width / 2 + 200, 500);
  
      var curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);
  
      var max = 28;
      var points = [];
      var tangents = [];
  
      for (var c = 0; c <= max; c++)
      {
          var t = curve.getUtoTmapping(c / max);
  
          points.push(curve.getPoint(t));
          tangents.push(curve.getTangent(t));
      }
  
      var tempVec = new Phaser.Math.Vector2();
  
      var spark0 = this.add.particles('spark0');
      var spark1 = this.add.particles('spark1');
  
      for (var i = 0; i < points.length; i++)
      {
          var p = points[i];
  
          tempVec.copy(tangents[i]).normalizeRightHand().scale(-32).add(p);
  
          var angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(p, tempVec));
  
          var particles = (i % 2 === 0) ? spark0 : spark1;
  
          particles.createEmitter({
              x: tempVec.x,
              y: tempVec.y,
              angle: angle,
              speed: { min: -100, max: 500 },
              gravityY: 200,
              scale: { start: 0.4, end: 0.1 },
              lifespan: 800,
              blendMode: 'SCREEN'
          });
      }
      this.gratz = this.add.text(
        this.cameras.main.centerX,
        gameConfig.height-100,
       "Good job!", { 
        font: "40px Arial", 
        fill: "#ffffff" 
      })
      this.gratz.setOrigin(0.5)

    }else if(this.victory === 'lose'){
      this.cameras.main.fadeOut(3000, 0, 0, 0)
      this.end = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
      "Better Luck Next Time", { 
        font: "60px Arial", 
        fill: "#ff0000" 
      }
      )
      this.end.setOrigin(0.5)

      this.input.on('pointerdown', () => {
        this.cameras.main.fadeIn(250, 128, 30, 36)
        this.end.destroy()
        this.input.removeAllListeners('pointerdown')
        this.init()
        this.create()
      })

    }else{
      this.counter = 0
      
      this.covid = this.add.image(Phaser.Math.Between(100, gameConfig.width-100),Phaser.Math.Between(100, gameConfig.height-100), 'covid')
      this.covid.setScale(0.2)
      this.covid.setInteractive()
      this.input.on('gameobjectdown', () => {
        this.covid.destroy()
        this.goodJob()
      })
      
      this.score = this.add.text(
        this.cameras.main.centerX,
        50,
      `Your score is: ${this.clicked}`, { 
        font: "40px Arial", 
        fill: "#ffffff" 
      }
      )
      this.remainingLifes = this.add.text(
        this.cameras.main.centerX,
        100,
      `${this.lifes} lifes remaining`, { 
        font: "40px Arial", 
        fill: "#ffffff" 
      }
      )
      this.remainingLifes.setOrigin(0.5)
      this.score.setOrigin(0.5)
    }
  }

  
  update (time, delta) {
    if(this.victory !== 'win' && this.victory !== 'lose'){
      this.counter += delta

      if(this.counter > 1000){
        this.counter = 0

        if(this.covid.scene !== undefined){
          this.covid.destroy()
          this.lifes--
          this.tooSlow()
        }

        this.score.destroy()
        this.remainingLifes.destroy()
        this.input.removeAllListeners('gameobjectdown')
        if(this.clicked === 5) this.victory = 'win'
        this.create()
      }
    }
  }

  tooSlow = () => {
    this.cameras.main.flash(250, 255, 0, 0)
    if(this.lifes === 0) this.victory = 'lose'
  }

  goodJob = () => {
    this.clicked++
    this.cameras.main.flash(250, 0, 255, 0)
  }
}



const gameConfig = {
  width: window.innerWidth,
  height: window.innerHeight / 2,
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: '100%',
    height: '50%'
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: true
    }
  },
  scene: MainScene
};



export default function App () {
  const [game, setGame] = useState()
  const [initialize, setInitialize] = useState(false)
  // const destroy = () => {
  //   console.log('Instance', game?.instance)
  //   setInitialize(false)
  //   setGame(undefined)
  // }
  


  useEffect(() => {
    if (initialize) {
      setGame(Object.assign({}, gameConfig))
    }
  }, [initialize])

  return (
    <div className="App">
      <header className="App-header">
        { initialize ? (
          <>
            <Game game={game} initialize={initialize} />
          </>
        ) : (
          <>
            <img src={logo} className="App-logo" alt="logo" />
            <div onClick={() => setInitialize(true)} className="flex">
              <a href="#1" className="bttn">Ready</a>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

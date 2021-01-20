'use strict';

// スコアを作ろう

(() => {
  function rand(min,max) {
    // Math.random() * (max - min) + min; 初期値をminにしたいのでminを足す、ただそれだと最大値がminの数だけ大きくなってしまうのでランダムの数にminをひいておく
    return Math.random() * (max - min) + min;
  }
  // ボールの動き
  class Ball {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this.x = rand(30, 250);
      this.y = 30;
      this.r =10;
      this.vx = rand(3, 5) * (Math.random() < 0.5 ? 1 : -1);
      this.vy = rand(3, 5);
      this.isMissed = false;
    }

    getMissedStatus() {
      return this.isMissed;
    }

    bounce() {
      this.vy *= -1;
    }

    reposition(paddleTop) {
      this.y = paddleTop - this.r;
    }

    getX() {
      return this.x;
    }

    getY() {
      return this.y;
    }

    getR() {
      return this.r;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if(this.y - this.r > this.canvas.height){
        this.isMissed = true;

      }
      // this.x < 0 左の壁に当たったらボールを跳ね返るようにする
      // this.x > this.canvas.width 右の壁に当たったらボールを跳ね返るようにする
      if(this.x - this.r < 0 || this.x + this.r> this.canvas.width) {
        this.vx *= -1;
      }

      // this.y < 0 上の壁に当たったらボールを跳ね返るようにする
      // this.y > this.canvas.width 下の壁に当たったらボールを跳ね返るようにする
      if(this.y - this.r < 0) {
        this.vy *= -1
      }
      //  ボールが跳ね返る前に壁に食い込んでしまうので半径文(this.r)を加減してボールがちゃんと跳ね返って見えるようにする
    }

    draw() {
      this.ctx.beginPath();
      this.ctx.fillStyle = "#fdfdfd";
      this.ctx.arc(this.x,this.y,this.r,0,2 * Math.PI);
      this.ctx.fill();

    }
  }
// 板の動きについて
  class Paddle {
    constructor(canvas,game) {
      this.canvas = canvas;
      this.game = game;
      this.ctx = this.canvas.getContext("2d");
      this.w = 60;
      this.h = 16;
      this.x = this.canvas.width /2 - (this.w /2);
      this.y = this.canvas.height - 32;
      this.mouseX = this.x;
      this.addHandler() 

    }
    // マウスの動きに合わせて板を移動させるコード
    addHandler () {
      document.addEventListener("mousemove", e =>{
          this.mouseX = e.clientX;
      });
    }
    // 始点を枠の端に設定してマウスと板のずれをなくすコード
    update(ball) {
      const ballBottom = ball.getY() + ball.getR();
      const paddleTop = this.y;
      const ballTop = ball.getY() - ball.getR();
      const paddleBottom = this.y + this.h;
      const ballCenter = ball.getX();
      const paddleLeft = this.x;
      const paddleRight = this.x + this.w;
      if(
        ballBottom > paddleTop &&// ボールのそこが板の上に当たった時
        ballTop < paddleBottom &&// ボールが板の下にない時
        ballCenter > paddleLeft && ballCenter < paddleRight// ボールが板の左右の長を超えないとき
        ) {
          ball.bounce();
          ball.reposition(paddleTop);
          this.game.addScore();
        }


      const rect = this.canvas.getBoundingClientRect();
      this.x = this.mouseX - rect.left - (this.w /2);
      
      // 板が枠の外に行かないようにするコード
      if(this.x < 0) {
        this.x = 0;
      }
      if(this.x + this.w > this.canvas.width){
        this.x = this.canvas.width -this.w;
      }
    }

    draw() {
      this.ctx.fillStyle = "#fdfdfd";
      this.ctx.fillRect(this.x,this.y, this.w, this.h);
    }
  }

  

// スコアやゲームオバーなど
  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this.ball = new Ball(this.canvas);
      this.paddle = new Paddle(this.canvas,this);
      this.loop();
      this.isGameOver = false;
      this.score = 0;
    }

    addScore() {
      this.score++;
    }

    loop(){
      // ゲームオーバーになったらループを止める
      if(this.isGameOver) {
        return;
      }

      this.update();
      this.draw();
    //requestAnimationFrameの中でthisを使うとundefindになってしまうのでアロー関数を使う 
      requestAnimationFrame(() => {
        this.loop()
      });
    }

    update() {
      this.ball.update();
      this.paddle.update(this.ball);

      if(this.ball.getMissedStatus()) {
        this.isGameOver = true;
      }
    }

    draw() {
      if(this.isGameOver) {
        this.drawGameOver();
        return;
      }
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.ball.draw();
      this.paddle.draw();
      this.drawScore();
    }

    Title() {
      this.ctx.font = "28px Arial Black";
      this.ctx.fillStyle = "tomato";
      this.ctx.fillText("Click Start", 50, 150);
    }

    drawGameOver() {
      this.ctx.font = "28px Arial Black";
      this.ctx.fillStyle = "tomato";
      this.ctx.fillText("GAME OVER", 50, 150);
    }

    drawScore() {
      this.ctx.font = "20px Arial";
      this.ctx.fillStyle = "#fdfdfd;"
      this.ctx.fillText(this.score, 10,25);
    }
  }
  const canvas = document.querySelector("canvas");
  if(typeof canvas.getContext === "undefined") {
    return;
  }


  new Game(canvas);
})();
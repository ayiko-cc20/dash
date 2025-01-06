class Ground {
        constructor(x, y) {
            this.width = 300;
            this.height = 100;
            this.x = x;
            this.y = y;
            
            this.velocity = {
                x: 0,
                y: 0
            }
        }

        draw(context) {
            context.fillStyle = 'rgba(0,255,0,0.5)';
            context.fillRect(this.x, this.y, this.width, this.height);
        }

        update(speed){
             // if (this.x > -this.width ){
             //    this.x -= this.speed;
             //    }else this.x = canvas.width;
             this.x -= speed;
        }
    }
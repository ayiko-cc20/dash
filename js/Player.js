    class Player {
        constructor(){
            this.x = 100;
            this.y = canvas.height-250;
            
            this.velocity = {
                x: 0,
                y: 0
            }

            this.width = 100;
            this.height = 100;
            this.sides = {
                bottom: this.y + this.height,
                left: this.x + this.width
            }
            this.gravity = 1;
        }
        draw(context){
            context.fillStyle = 'rgba(255,0,0,1)';
            context.fillRect(this.x, this.y, this.width, this.height);

        }
        update(){
            this.y += this.velocity.y;
            this.sides.bottom = this.y + this.height;
            
            //Above bottom of canvas
            if(this.sides.bottom + this.velocity.y < canvas.height){
                this.velocity.y += this.gravity;
            } else this.velocity.y = 0;
        }
    }
     
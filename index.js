window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions
    let cavwidth;
    let cavheight;
    window.addEventListener('Resize', e =>{
        // cavwidth = e.currentTarget.innerWidth;
        // cavheight = e.currentTarget.innerHeight;
        console.log(e)
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // canvas.width = cavwidth;
    // canvas.height = cavheight;

    let groundArray = [];
    let score = 0; // Initialize score
    let gameRunning = true; // Track game state
    let gamePaused = false; // Track paused state
    let bottomY = canvas.height - 8; //collision for gameOver
    let gameSpeed = 4; // Initial game speed
    let randomY; //random y position for ground objects
    let gameStarted = false;
    let ollisionBox = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    //debug mode
    let debug = false;
    
    document.addEventListener('keydown', e =>{
        if(e.key === 'd'|| e.key === 'D')
        debug = true;
    });
    
    // Start the game after a 5-second delay, 5,000 milliseconds = 5 seconds.
    setTimeout(() => {
        gameStarted = true; // Mark the game as started
    }, 7000); 


    // Ensure Player and Ground classes are defined
    if (typeof Player === 'undefined' || typeof Ground === 'undefined') {
        console.error("Player or Ground class is not defined.");
        return;
    }

    
    //let playerY = ground.y;//setting player to start on to of ground. Didn't work :(
    const player = new Player();


    // Collision detection function
    function detectCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
    
    // Function to get a random Y position for the ground (obstacles)
    function getRandomY() {
        const minY = canvas.height - 200;
        const maxY = canvas.height - 50;
        return Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    }

    // Add the initial ground object
    groundArray.push(Ground.getRandomGround(canvas.width, getRandomY()));

    // Function to spawn obstacles
    function spawnGroundObject() {
        const lastObject = groundArray[groundArray.length - 1];
        const minSpacing = 400;

        if (gameRunning && !gamePaused) {
            if (!lastObject || lastObject.x < canvas.width - minSpacing) {
                groundArray.push(Ground.getRandomGround(canvas.width, getRandomY()));
            }
        }

        // Adjust obstacle spawn rate based on the game speed
        if (gameRunning) {
            setTimeout(spawnGroundObject, Math.random() * (1000 / gameSpeed) + 800);
        }
    }

    // Handle ground objects' movement, drawing, and collision detection
    function handleGroundObjects() {
        for (let i = groundArray.length - 1; i >= 0; i--) {
            const ground = groundArray[i];
            ground.update(gameSpeed); // Pass gameSpeed to the update function of the ground

            if(gameStarted){//ground is drawn after 6 seconds *****
                ground.draw(context);
            }

            // Remove objects that go off-screen
            if (gameRunning && !gamePaused) {
                if (ground.x + ground.width < 0) {
                    groundArray.splice(i, 1);
                    if (gameStarted) {
                        score += 1; // Increase score when an obstacle goes off-screen
                    }
                    updateGameSpeed(); // Check and update the game speed
                }
            }

            // Use the ground object's updated collision box for detection
            collisionBox = {
                x: ground.collisionBox.collisionX,
                y: ground.collisionBox.collisionY,
                width: ground.collisionBox.collisionWidth,
                height: ground.collisionBox.collisionHeight,
            };
          
            // Check for collisions with the player
            if (detectCollision(player, collisionBox)) {
                player.velocity.y = 0;
                player.y = collisionBox.y - player.height;
                // if(player.sides.bottom + player.velocity.y < ground.height){
                //     player.velocity.y += player.gravity;
                //     player.sides.bottom = player.y + player.height;
                // } else{
                //     player.velocity.y = 0;
                //     player.gravity = 0;    
                // }
                // player.y = ground.y - player.height; 
                // player.sides.bottom = ground.y - player.height + player.y;
                // player.velocity.y = 0;

                checkGameOver(player);
            }
        }
    }

    // Update the game speed based on the score
    function updateGameSpeed() {
        // Increase game speed every 5 points
        const newSpeed = Math.floor(score / 10) + 4; // Minimum speed is 4, increases by 1 every 10 points
        if (newSpeed > gameSpeed) {
            gameSpeed = newSpeed;
            console.log("Game speed increased to: ", gameSpeed);
        }
    }

    // Check for game over conditions
    function checkGameOver(player) {
        if (player.y + player.height > bottomY) {
            gameRunning = false;
            context.fillStyle = "black";
            context.textAlign = 'center';
            context.fillText(`Game Over! Your final score is: ${score}`, canvas.width / 2, canvas.height / 2);
            return;
        }
    }

    // Toggle pause state
    function togglePause() {
        gamePaused = !gamePaused; // Toggle the paused state
        if (!gamePaused) {
            animate(); // Restart animation loop when the game is resumed
        }
    }
    
    // Draw the score on the canvas
    function drawScore() {
        context.textAlign = 'left';
        context.font = "24px Arial";
        context.fillStyle = "black";
        context.fillText(`Score: ${score}`, 20, 40);
    }

    // Draw pause message
    function drawPauseMessage(context) {
        if (gamePaused) {
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillRect(0, 0, canvas.width, canvas.height); // Darken background
            context.fillStyle = "white";
            context.font = "48px Arial";
            context.textAlign = 'center';
            context.fillText("Game Paused", canvas.width / 2, canvas.height / 2);
            context.font = "24px Arial";
            context.fillText("Press 'P' to Resume", canvas.width / 2, canvas.height / 2 + 40);
        }
    }

    //draws loading screen
    function drawLoading(){
        if(!gameStarted){
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "white";
            context.font = "48px Arial";
            context.textAlign = "center";
            context.fillText("Loading...", canvas.width / 2, canvas.height / 2);
        }

    }

    // Animation loop
    function animate() {
       
        // game state checks
        // console.log(`Game running: ${gameRunning}`);
        // console.log(`Game paused: ${gamePaused}`);
        // console.log(groundArray);
        // console.log("Ground position: ", ground.x, ground.y);
    
     // Stop animation if the game is over
        if (!gameRunning) return;
        drawPauseMessage(context);
        if (gamePaused) return; // Stop animation if the game is paused

        randomY = getRandomY();// Random ground y position

        requestAnimationFrame(animate);
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw the player
        if (gameStarted){
            player.update();
            player.draw(context);
        }
        //collision box for ground objects
        if (debug) {
            context.fillRect(collisionBox.x, collisionBox.y, collisionBox.width,
             collisionBox.height);
        }

        // Handle ground objects
        handleGroundObjects();
        checkGameOver(player);
        // Draw the score
        drawScore();
        //Draw loading screen :)
        drawLoading();
    }

    // Start animation and obstacle spawning
    animate();
    spawnGroundObject();

    // Handle key press events
    window.addEventListener('keydown', (event) => {
        if (!gameRunning) return; // Ignore input if the game is over

        switch (event.key) {
            case ' ': // Move the player upward
                if (!gamePaused) {
                    player.velocity.y = -20;
                }
                break;
            case 'p': // Pause or resume the game when 'P' is pressed
            if (gameStarted) {
                togglePause();
            }
                break;
            default:
                break;
        }
    });
});

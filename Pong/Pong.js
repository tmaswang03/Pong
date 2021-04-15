// init : grab canvas height
var canvas = document.querySelector('Canvas'); 
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight; 
var c = canvas.getContext('2d'); 
c.fillStyle = 'black'; 
c.textAlign = "center"; 
c.font = "30px Arial"; 
// interactive grab key pressed down :  
var key = {
	val : 1
}; 
// event listener, use W to move rectangle up S to move rectangle down
// W sets increment value as 1, S sets increment value as -1
// No button = keyup = 0; 
window.addEventListener('keydown', function(event){
	event = event || window.event; 
	if(event.keyCode == '87'){
		// up w
		key.val = -1; 
		console.log(key.val); 
	} 
	else if (event.keyCode == '83'){
		// down s
		key.val= 1; 
		console.log(key.val); 
	}
})
window.addEventListener('keyup', function(event){
	// no key is being pressed
	key.val = 0; 
})

// initialized function 
// this holds all the necessary objects IE: ball, rectangle etc... 
// 
function init(){
	// restart button, disabled until the player dies. 
	var resButton = document.getElementById("restartButton"); 
	resButton.disabled = true; 
	// array of colours: (to efficiently generate colours for objects)
	var colorArray = [
		'#E74C3C', 
		'#ECF0F1', 
		'#3498DB', 
		'#2980B9', 
	];
	// score keeping :
	// use this object to keep track of the player's score + display player score;
	function Score(val, x, y, sz){
		this.val = val;
		this.x = x; this.y = y; 
		this.sz = sz; 
		this.color = colorArray[0]; 
		this.draw = function(){
			// c.style.fontSize = 150%;  
			c.fillStyle = this.color; 
			c.fillText('Score :' + this.val, this.x, this.y); 
		}
	}
	// circle class oop : 
	// houses x coord, y coord, radius, color
	// includes draw function to draw circle (360 deg arc)
	// update function : makes balls bounce off of walls, updated the velocity of circle 
	function Circle(x, y, dx, dy, radius){
		this.x = x; this.y = y; 
		this.dx = dx; this.dy = dy; 
		this.radius = radius; this.minRadius = radius; 
		this.color =  colorArray[1]
		// draw the circle 
		this.draw = function(){
			c.beginPath();
			c.fillStyle = this.color;  
			c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
			c.strokeStyle = 'black'; 
			c.stroke();
			c.fill(); 
		}
		this.update = function(){
			if(this.x+this.radius>innerWidth){
				// ball touches right wall, game over clear rectangle
				this.dx = 0; this.dy = 0; 
				c.clearRect(0, 0, window.innerWidth, window.innerHeight); 
				c.fillStyle = "#00060D"; 
				c.fillRect(0, 0, window.innerWidth, window.innerHeight); 
			}
			// if the ball hits the left vertical wall, invert the x velocity
			if(this.x-this.radius<0) this.dx = -this.dx;   
			// if the ball hits the bottom wall or upper wall invert they velocity
			if(this.y+this.radius>innerHeight||this.y-this.radius<0) this.dy = -this.dy;   
			this.x+=this.dx;
			this.y+=this.dy; 
			// update + draw the new ball 
			this.draw();
		}
	}

	// rectangle drawing : 
	// includes : x coord, y coord, x speed, y speed, length, width color, maximum velocity, minimum velocity
	// draw function to draw rectangle
	// update function to change the vertical speed of the rectangle 
	function Rect(x, y, dx, dy, len, width){
		this.x = x; this.y = y; 
		this.dx = dx; this.dy = dy; 
		this.len = len; this.width = width; 
		this.color = colorArray[2]; 
		this.maxdy = 10; this.mindy = -10;
		// draw function, fills rectangle;  
		this.draw = function(){
			c.beginPath(); 
			c.fillStyle = this.color; 
			c.strokeStyle = 'black'; 
			c.fillRect(this.x, this.y, this.len, this.width); 
			c.fill(); 
		}
		// update function changes the y velocity
		this.update = function(){
			// if a key is pressed down (-1 for down aka s, +1 for up aka w, add the key value to the velocity (mimics acceleration))
			if(this.dy+key.val>this.mindy&&this.dy+key.val<this.maxdy) this.dy+=key.val; 
			// no key is being pressed down, reduce the speed of the rectangle until it reaches 0 (deceleration)
			if(key.val==0){
				if(this.dy<0) this.dy+=0.1; 
				else this.dy -= 0.1; 
			}
			// if the rectangle is not at the edge of the canvas then increase/decrease the rectangle's position on the y axis 
			if(this.y+this.dy>0&&this.y+this.width+this.dy<window.innerHeight) this.y+=this.dy;
			else this.dy = 0; 
			this.draw();  
		}
	}
	// animations : 
	var tmp = new Circle(200, 200, 8, 8, 20); 
	var rect = new Rect(innerWidth-100, 200, 0, 10, 30, 100); 
	var score = new Score(0, innerWidth/2, 100, 18); 
	// tmp is the ball 
	// rect is the rectangle 
	// score keeps track of score
	animate(); 
	// call animate function to animate the game 
	function animate(){
		// clear rectangle each time 
		c.clearRect(0, 0, window.innerWidth, window.innerHeight); 
		// fill rectangle with a dark blue colour
		c.fillStyle = "#00060D"; 
		c.fillRect(0, 0, window.innerWidth, window.innerHeight); 
		// draws the dotted line in the middle of the screen
		c.strokeStyle = "White"; 
		c.beginPath();
		c.setLineDash([5, 15]);
		c.moveTo(window.innerWidth/2, 0);
		c.lineTo(window.innerWidth/2, window.innerHeight);
		c.stroke();
		// request animation frame 
		requestAnimationFrame(animate);
		// update rectangle 
		rect.update();
		// the circle hits the rectangle then bounce away to the left 
		if( (tmp.x+tmp.radius==rect.x ) && tmp.y<=rect.y+rect.width && tmp.y>=rect.y-rect.width ){
			tmp.dx = -tmp.dx; ++score.val; 
		}
		if(tmp.x+tmp.radius>=innerWidth){
			// ball touches right wall, game over 
			c.clearRect(0, 0, window.innerWidth, window.innerHeight); 
			c.fillStyle = "#00060D"; 
			c.fillRect(0, 0, window.innerWidth, window.innerHeight); 
			c.fillStyle = colorArray[1]; 
			// sincee game is over activate restart button and display final score 
			resButton.disabled = false; 
			c.fillText('Final Score: \n' + score.val, innerWidth/2, innerHeight/2); 
			c.fillText('Click Anywhere to Restart', innerWidth/2, innerHeight/2+100); 

		}
		if(tmp.x+tmp.radius<innerWidth){
			// if the ball is still in the game then draw the score and update the ball's position 
			score.draw(); 
			tmp.update(); 
		}
	}
}
init(); 
// run init and initialize game 


	
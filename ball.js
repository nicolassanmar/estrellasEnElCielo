class ball{
    constructor(x,y,colorr){
      this.x = x;
      this.y = y;
      this.color = colorr;
    }
    draw(){
      fill(this.color);
      circle (this.x,this.y, 2)
    }
    move(x,y){
      let fx = -this.x + x;
      let fy = -this.y + y;
      fx *= strength;
      fy *= strength;
      
      velx *= drag;
      velx += fx;
      vely *= drag;
      vely += fy;
      
      
      this.x += velx;
      this.y += vely;
    }
  
    getx(){return this.x}
    gety(){return this.y}
    getColor(){return this.color}
  
  }
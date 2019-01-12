class ClockComponent {
  constructor(canvas) {
    this.canvas = canvas;
  }
  
  render(minus = 0) {
    let parentWidth = this.canvas.parentElement.clientWidth;
    this.canvasWidth = parentWidth;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasWidth;
    let ctx = this.canvas.getContext("2d");
    let padding = 20;
    let radius = (this.canvasWidth - padding * 2)/ 2;
    let centerX = radius + padding;
    let centerY = radius + padding;
    let stepAngle = 30 * Math.PI/180;;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasWidth);
    ctx.beginPath();
    
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    
    if(minus > 0){
      let theFifth = (minus - (minus % 5)) / 5;
      let angleNFile = stepAngle * theFifth - 0.5 * Math.PI;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, -0.5 * Math.PI, angleNFile, false);
      ctx.fillStyle = 'yellow'; 
      ctx.fill();
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
    
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    
    for(let i = 12; i > 0; i--){
      let angle = i * stepAngle;
      ctx.save();
      ctx.beginPath();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.translate(0, -radius);
      
      ctx.save();
      ctx.translate(0, -10);
      ctx.rotate(-angle);
      ctx.fillText(i * 5, -i, 3);
      ctx.restore();
      
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 10);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
  }
}
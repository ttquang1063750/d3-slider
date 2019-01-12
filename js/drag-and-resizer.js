class DragAndResizer {
  static showError(message) {
    alert(message);
    throw Error(message);
  }
  
  static get ACTION_TYPE() {
    return {
      NONE: 0,
      RESIZE_LEFT: -1,
      RESIZE_RIGHT: 1,
      MOVE: 2
    };
  }
  
  static get DIRECTION() {
    return {
      LEFT: -1,
      RIGHT: 1,
      NONE: 0
    };
  }
  
  constructor(selector, props) {
    this.selector = selector;
    this.props = props;
    this.chart = null;
    this.timerId = null;
    this.dragable = false;
    this.actionType = DragAndResizer.ACTION_TYPE.NONE;
    this.direction = DragAndResizer.DIRECTION.NONE;
  }
  
  getActionArea() {
    let dragger = this.getDragger();
    let w = dragger.endValue - dragger.startValue;
    let piece = w / 3;
    if(piece > 5){
      return piece;
    }
    return w / 2;
  }
  
  setCanvasCursor(canvas, x) {
    let dragger = this.getDragger();
    let resizeArea = this.getActionArea();
    
    if(x >= dragger.startValue && x <= dragger.endValue){
      if(x >= dragger.endValue - resizeArea){
        canvas.style.cursor = "e-resize";
      }else if(x <= dragger.startValue + resizeArea) {
        canvas.style.cursor = "w-resize";
      }else{
        canvas.style.cursor = "move";
      }
    }else{
      canvas.style.cursor = "default";
    }
  }
  
  getActionType(x) {
    let dragger = this.getDragger();
    let resizeArea = this.getActionArea();
    
    if(x >= dragger.startValue && x <= dragger.endValue){
      if(x > dragger.endValue - resizeArea){
        return DragAndResizer.ACTION_TYPE.RESIZE_RIGHT;
      }else if(x < dragger.startValue + resizeArea) {
        return DragAndResizer.ACTION_TYPE.RESIZE_LEFT;
      }else{
        return DragAndResizer.ACTION_TYPE.MOVE;
      }
    }else{
      return DragAndResizer.ACTION_TYPE.NONE;
    }
  }

  convertPixelToValue(pixel) {
    return Math.floor(this.chart.axisX[0].convertPixelToValue(pixel));
  }

  convertValueToPixel(value) {
    return Math.floor(this.chart.axisX[0].convertValueToPixel(value));
  }
  
  getCurrentX(container, e) {
    let parentOffset = container.offset();          	
    let relX = e.pageX - parentOffset.left;
    let x = this.convertPixelToValue(relX);
    return x;
  }
  
  getCurrentRangeSize() {
    let dragger = this.getDragger();
    let currentRange = dragger.endValue - dragger.startValue;
    return currentRange;
  }
  
  resizeRangeLeft(dx) {
    let dragger = this.getDragger();
    let stander = this.getStander();
    
    dragger.startValue += dx;
    
    let currentRange = this.getCurrentRangeSize();
    
    if(this.direction === DragAndResizer.DIRECTION.RIGHT && currentRange <= this.props.minRange){
      dragger.endValue = dragger.startValue + this.props.minRange;
      this.actionType = DragAndResizer.ACTION_TYPE.MOVE;
    }
    
    if(this.direction === DragAndResizer.DIRECTION.LEFT){
      if(dragger.startValue <= stander.endValue){
        dragger.startValue = stander.endValue;
        this.actionType = DragAndResizer.ACTION_TYPE.MOVE;
      }else if(currentRange >= this.props.maxRange){
        dragger.endValue = dragger.startValue + this.props.maxRange;
        this.actionType = DragAndResizer.ACTION_TYPE.MOVE;
      }
    }
  }
  
  resizeRangeRight(dx) {
    let dragger = this.getDragger();
    
    dragger.endValue += dx;
    
    let currentRange = this.getCurrentRangeSize();
    let chartWidth = this.getWidth();
    
    if(this.direction === DragAndResizer.DIRECTION.RIGHT){
      if(dragger.endValue >= chartWidth){
        dragger.endValue = chartWidth;
        this.actionType = DragAndResizer.ACTION_TYPE.MOVE;
      }else if(currentRange >= this.props.maxRange){
        dragger.startValue = dragger.endValue - this.props.maxRange;
        this.actionType = DragAndResizer.ACTION_TYPE.MOVE;
      }
    }
    
    if(this.direction === DragAndResizer.DIRECTION.LEFT && currentRange <= this.props.minRange){
      dragger.startValue = dragger.endValue - this.props.minRange;
      this.actionType = DragAndResizer.ACTION_TYPE.MOVE;
    }
  }
  
  moveRange(dx) {
    let dragger = this.getDragger();
    let stander = this.getStander();
    
    dragger.startValue += dx;
    dragger.endValue += dx;
    
    let currentRange = this.getCurrentRangeSize();
    let chartWidth = this.getWidth();
    
    if(this.direction === DragAndResizer.DIRECTION.RIGHT && dragger.endValue >= chartWidth){
      dragger.endValue = chartWidth;
      dragger.startValue = dragger.endValue - currentRange;
    }
    
    if(this.direction === DragAndResizer.DIRECTION.LEFT && stander.endValue >= dragger.startValue){
      dragger.startValue = stander.endValue;
      dragger.endValue = dragger.startValue + currentRange;
    }
  }
  
  moveByStep(step, d) {
    let dx = d;
    let modStep = dx % step;
    let i = modStep > 0 ? 1 : modStep === 0 ? 0 : -1 ;
    dx -= modStep;
    dx += (step * i);
    return dx;
  }
  
  lazyRender(dx) {
    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => {
      switch(this.actionType){
        case DragAndResizer.ACTION_TYPE.RESIZE_LEFT:
        this.resizeRangeLeft(dx);
        break;
        case DragAndResizer.ACTION_TYPE.RESIZE_RIGHT:
        this.resizeRangeRight(dx);
        break;
        case DragAndResizer.ACTION_TYPE.MOVE:
        this.moveRange(dx);
        break;
      }
      this.chart.render(); 
    }, 0);
  }
  
  getWidth() {
    return this.chart.axisX[0].maximum;
  }
  
  getDragger() {
    return this.chart.options.axisX.stripLines[1];
  }
  
  getStander() {
    return this.chart.options.axisX.stripLines[0];
  }
  
  render() {
    let { chartOptions, step } = this.props;
  
    if(step < 1){
      DragAndResizer.showError("the step must grater than 0");
    }
    if(!chartOptions){
      DragAndResizer.showError("chart options was required");
    }
    
    if(!chartOptions.axisX || !chartOptions.axisX.stripLines || chartOptions.axisX.stripLines.length < 2){
      DragAndResizer.showError("stripLines was required with min item 2");
    }
    
    this.chart = new CanvasJS.Chart(this.selector, chartOptions);
    this.chart.render();
    let stander = this.getStander();
    let startX = 0;
    let container = $(this.selector).children('.canvasjs-chart-container').last(); 
    let canvas = container.find("canvas").last()[0];
    
    container.off().on({
      mousedown: (e) => { 
        this.dragable = true;
        startX = this.getCurrentX(container, e);  
        this.actionType = this.getActionType(startX);
      },
      mousemove: (e) => { 
        let x = this.getCurrentX(container, e);
        this.setCanvasCursor(canvas, x);   
        if(this.dragable && this.actionType !== DragAndResizer.ACTION_TYPE.NONE) {
          let dx = this.moveByStep(step, x - startX);
          startX = x;
          if(dx === 0){
            return false;
          }
          this.direction = dx > 0 ? DragAndResizer.DIRECTION.RIGHT : DragAndResizer.DIRECTION.LEFT;
          this.lazyRender(dx);
        }
      },
      mouseup: () => this.onChange(),
      mouseout: () => this.onChange()
    });

    // Trying to update the minimum value of stander
    stander.startValue = this.chart.axisX[0].minimum;
    this.chart.render();
  }
  
  onChange() {
    if(this.dragable){
      this.dragable = false;
      let dragger = this.getDragger();
      this.props.onChange(dragger.startValue, dragger.endValue);
    }
  }
}
class Slider{
    constructor(selector, props) {
        this.selector = selector;
        this.props = props;
        $(window).off('resize.d3-slider').on('resize.d3-slider', () => this.render());
        this.render();
    }
    
    destroy() {
        $(window).off('resize.d3-slider');
    }
    
    render() {
        const { start, end, currentPoint, rangeBarWidth, onChange, formatTime , margin } = this.props;
        const container = d3.select(this.selector);
        const draggerHeight = 22;
        const labelHeight = 20;
        const panelHeight = 15;
        const trackerHeight = 8;
        const spaceInsideTracker = 0;
        const spaceWithTracker = 0;
        
        let sliderWidth = container.node().clientWidth;
        let sliderHeight = draggerHeight + panelHeight + labelHeight + trackerHeight + margin.top + margin.bottom;
        
        let svg = container.selectAll('svg').data([null]).enter().append('svg');
        svg.attr('width', sliderWidth).attr('height', sliderHeight);
        
        /* 
        WRAPPER
        */
        let wrapper = svg.selectAll('.svg-wrapper').data([null]).enter().append("g");
        wrapper
        .attr("class", "svg-wrapper")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        sliderWidth = sliderWidth - margin.left - margin.right;
        sliderHeight = sliderHeight - margin.top - margin.bottom;
        
        const xScale = d3.scale.linear().domain([start, end]).range([0, sliderWidth]);
        
        /* 
        GROUP TOP
        */
        let groupTop = wrapper.selectAll('.svg-group-top').data([null]).enter().append("g");
        
        groupTop.attr("class", "svg-group-top")
        .attr("transform", "translate(0,0)");
        
        let drager = groupTop.selectAll('.drager').data([null]).enter().append("circle");
        
        drager.attr("class", "drager")
        .attr("fill", '#14679e')
        .style("cursor", 'pointer')
        .attr("cy", draggerHeight / 2)
        .attr("r", draggerHeight / 2)
        .call(d3.behavior.drag()
        .on("drag", () => {
            const halfWidth = xScale(rangeBarWidth) / 2;
            let x = d3.event.x;
            if(x + halfWidth  > sliderWidth){
                x = sliderWidth - halfWidth;
            }else if(x - halfWidth < 0){
                x = halfWidth;
            }
            let dx = xScale.invert(x);
            wrapper.select(".drager").attr("cx", x);
            wrapper.select(".range-bar").attr("x", x - xScale(rangeBarWidth) / 2);
            onChange(dx, dx + rangeBarWidth);
        }))
        .attr("cx", xScale(rangeBarWidth) / 2);
        
        
        // Tracker
        let tracker = groupTop.selectAll('.tracker').data([null]).enter().append("rect");
        
        tracker.attr("class", "tracker")
        .attr("fill", '#ccc')
        .attr("x", 0)
        .attr("y", draggerHeight)
        .attr("height", trackerHeight)
        .attr("width", sliderWidth);
        
        
        // Range bar
        let rangeBar = groupTop.selectAll('.range-bar').data([null]).enter().append("rect");
        rangeBar.attr("class", "range-bar")
        .attr("fill", '#14679e')
        .attr("y", draggerHeight + spaceInsideTracker)
        .attr("height", trackerHeight - spaceInsideTracker * 2)
        .attr("width", xScale(rangeBarWidth))
        .attr("x", xScale(currentPoint));
        
        let panel = groupTop.selectAll('.panel').data([null]).enter().append("rect");
        
        panel.attr("class", "panel")
        .attr("fill", 'none')
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("x", 1)
        .attr("y", draggerHeight + trackerHeight + spaceWithTracker)
        .attr("height", panelHeight)
        .attr("width", sliderWidth - 2);
        
        let panelTick = groupTop.selectAll('.panel-tick').data([null]).enter().append("rect");
        
        panelTick.attr("class", "panel-tick")
        .attr("fill", "#000")
        .attr("y", draggerHeight + trackerHeight + spaceWithTracker + 1)
        .attr("height", panelHeight - 1)
        .attr("x", sliderWidth / 2)
        .attr("width", 1);
        
        /* 
        GROUP MIDDLE
        */
        let groupBottom= wrapper.selectAll('.svg-group-bottom').data([null]).enter().append("g");
        
        groupBottom.attr("class", "svg-group-bottom")
        .attr("transform", "translate(0, " + (sliderHeight) + ")");
        
        
        let tickLabel = groupBottom.selectAll('.tick-label')
        .data([
            {
                text: start,
                anchor: 'start',
                x: 0
            },
            {
                text: xScale.invert(sliderWidth / 2),
                anchor: 'middle',
                x: sliderWidth / 2
            },
            {
                text: end,
                anchor: 'end',
                x: sliderWidth
            }
        ]).enter().append("text");
        
        tickLabel.attr("class", "tick-label")
        .attr("y", 0)
        .attr("dy", "0")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .attr("x", d => d.x)
        .style("text-anchor", d => d.anchor)
        .text(d => formatTime(d.text));
    }
}
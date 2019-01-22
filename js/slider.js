class Slider{
    constructor(selector, props) {
        this.selector = selector;
        this.props = props;
        $(window).off('resize.d3-range-slider').on('resize.d3-range-slider', () => this.render());
    }
    
    destroy() {
        $(window).off('resize.d3-range-slider');
    }
    
    render() {
        const { start, end, currentPoint, period, onChange, formatTime , margin } = this.props;
        const container = d3.select(this.selector);
        const draggerHeight = 22;
        const labelHeight = 20;
        const panelHeight = 15;
        const trackerHeight = 8;
        const spaceInsideTracker = 0;
        const spaceWithTracker = 0;
        const rangeBarWidth = period + start;
        let computedStyle = window.getComputedStyle(container.node(), null);
        let containerPaddingLeft = parseInt(computedStyle.getPropertyValue('padding-left'));
        let containerPaddingRight= parseInt(computedStyle.getPropertyValue('padding-right'));
        let containerWidth = parseInt(computedStyle.getPropertyValue('width')) - containerPaddingLeft - containerPaddingRight;
        let containerHeight = draggerHeight + panelHeight + labelHeight + trackerHeight + margin.top + margin.bottom;
        
        let svg = container.selectAll('svg').data([null]);
        // Update pattern
        svg.attr('width', containerWidth).attr('height', containerHeight);
        
        // Enter pattern
        svg.enter().append('svg')
        .attr('width', containerWidth).attr('height', containerHeight);
        
        /* 
        WRAPPER
        */
        let wrapper = svg.selectAll('.svg-wrapper').data([null]);
        wrapper.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        wrapper.enter().append("g")
        .attr("class", "svg-wrapper")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        let _width = containerWidth - margin.left - margin.right;
        let _height = containerHeight - margin.top - margin.bottom;
        
        const xScale = d3.scale.linear().domain([start, end]).range([0, _width]);
        
        /* 
        GROUP TOP
        */
        let groupTop = wrapper.selectAll('.svg-group-top').data([null]);    
        groupTop.attr("transform", "translate(0,0)");
        groupTop.enter().append("g")
        .attr("class", "svg-group-top")
        .attr("transform", "translate(0,0)");
        
        // Rect tracker
        groupTop.selectAll('.rect-tracker')
        .data([null])
        .attr("width", _width)
        .enter().append("rect")
        .attr("class", "rect-tracker")
        .attr("fill", '#ccc')
        .attr("x", 0)
        .attr("y", draggerHeight)
        .attr("height", trackerHeight)
        .attr("width", _width);
        
        // Rect panel
        groupTop.selectAll('.rect-panel')
        .data([null])
        .attr("width", _width - 2)
        .enter().append("rect")
        .attr("class", "rect-panel")
        .attr("fill", 'none')
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("x", 1)
        .attr("y", draggerHeight + trackerHeight + spaceWithTracker)
        .attr("height", panelHeight)
        .attr("width", _width - 2);
        
        let dx = 0;
        let dragger = groupTop.selectAll('.dragger').data([null]);
        dragger.attr("transform", "translate(" + xScale(currentPoint) + ",0)")
        .call(d3.behavior.drag()
        .on("dragstart", () => {
            let x = d3.event.sourceEvent.x;
            let draggerBoundRect = dragger.node().getBoundingClientRect();
            dx = x - draggerBoundRect.x;
        })
        .on("drag", () => {
            const barWidth = xScale(rangeBarWidth);
            let x = d3.event.x - dx;
            if(x + barWidth  > _width){
                x = _width - barWidth;
            }

            if(x < 0){
                x = 0;
            }
           
            dragger.attr("transform", "translate(" + x + ",0)");
            this.props.currentPoint = xScale.invert(x);
            onChange(this.props.currentPoint);
        }));
        
        
        dragger.enter().append("g")
        .attr("class", "dragger")
        .style("cursor", 'pointer')
        .attr("transform", "translate(" + xScale(currentPoint) + ",0)")
        .call(d3.behavior.drag()
        .on("dragstart", () => {
            let x = d3.event.sourceEvent.x;
            let draggerBoundRect = dragger.node().getBoundingClientRect();
            dx = x - draggerBoundRect.x;
        })
        .on("drag", () => {
            const barWidth = xScale(rangeBarWidth);
            let x = d3.event.x - dx;

            if(x + barWidth  > _width){
                x = _width - barWidth;
            }

            if(x < 0){
                x = 0;
            }
           
            dragger.attr("transform", "translate(" + x + ",0)");
            this.props.currentPoint = xScale.invert(x);
            onChange(this.props.currentPoint);
        }));
        
        dragger.selectAll('circle')
        .data([null])
        .attr("cy", draggerHeight / 2)
        .attr("r", draggerHeight / 2)
        .attr("cx", xScale(rangeBarWidth) / 2)
        .enter().append("circle")
        .attr("fill", '#14679e')
        .attr("cy", draggerHeight / 2)
        .attr("r", draggerHeight / 2)
        .attr("cx", xScale(rangeBarWidth) / 2);
        
        // Rect range bar
        dragger.selectAll('.rect-range-bar')
        .data([null])
        .attr("width", xScale(rangeBarWidth))
        .enter().append("rect")
        .attr("class", "rect-range-bar")
        .attr("fill", '#14679e')
        .attr("y", draggerHeight + spaceInsideTracker)
        .attr("height", trackerHeight - spaceInsideTracker * 2)
        .attr("width", xScale(rangeBarWidth))
        .attr("x", 0);
        
        //Vertical-line
        groupTop.selectAll('.vertical-line')
        .data([null])
        .attr("x", _width / 2)
        .enter().append("rect")
        .attr("class", "vertical-line")
        .attr("fill", "#000")
        .attr("width", 1)
        .attr("y", draggerHeight + trackerHeight + spaceWithTracker + 1)
        .attr("height", panelHeight - 1)
        .attr("x", _width / 2);
        
        /* 
        GROUP MIDDLE
        */
        let groupBottom= wrapper.selectAll('.svg-group-bottom').data([null]);
        groupBottom.attr("transform", "translate(0, " + _height + ")");
        groupBottom.enter().append("g")
        .attr("class", "svg-group-bottom")
        .attr("transform", "translate(0, " + _height + ")");
        
        groupBottom.selectAll('text')
        .data([
            {
                text: start,
                anchor: 'start',
                x: 0
            },
            {
                text: xScale.invert(_width / 2),
                anchor: 'middle',
                x: _width / 2
            },
            {
                text: end,
                anchor: 'end',
                x: _width
            }
        ])
        .style("text-anchor", d => d.anchor)
        .attr("x", d => d.x)
        .text(d => formatTime(d.text))
        .enter().append("text")
        .attr("y", 0)
        .attr("dy", "0")
        .style("font-size", "14px")
        .style("pointer-events", "none")
        .style("text-anchor", d => d.anchor)
        .attr("x", d => d.x)
        .text(d => formatTime(d.text));
    }
}
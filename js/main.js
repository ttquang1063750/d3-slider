let start = 1545358816000;
let end = 1545363016000;
let slider = new Slider('body', {
    start: start,
    end: end,
    currentPoint: start,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    onChange: (current) => {
        return `Current: ${current}}`;
    },
    formatTime: formatTime,
    rangeBarWidth: start + 60 * 60 * 1000
});
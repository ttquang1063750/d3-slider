let start = 1545358816000;
let end = 1545363016000;
const formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S");
const onChange = (from, to) => {
    return `From: ${formatTime(from)} to: ${formatTime(to)}`;
}
let slider = new Slider('body', {
    start: start,
    end: end,
    currentPoint: start,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    onChange: onChange,
    formatTime: formatTime,
    rangeBarWidth: start + 60 * 60 * 1000
});
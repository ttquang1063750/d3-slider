window.onload = () => {
    let currentDate = document.getElementById('currentDate');
    let startDom = document.getElementById('start');
    let endDom = document.getElementById('end');
    let currentPoint = document.getElementById('current');
    startDom.value = "2013-03-18T13:00";
    currentPoint.value = "2013-03-18T15:00";
    endDom.value = "2013-03-19T13:00";
    currentDate.innerHTML = new Date(currentPoint.value).toGMTString();
    let toTimestamp = (dom) => {
        return new Date(dom.value).getTime();
    }
    let slider = () => {
        ( new Slider('#slider', {
            start: toTimestamp(startDom),
            end: toTimestamp(endDom),
            currentPoint: toTimestamp(currentPoint),
            margin: { top: 10, right: 10, bottom: 10, left: 10 },
            period: 60 * 60 * 1000,
            onChange: (current) => {
                currentDate.innerHTML = new Date(current).toGMTString();
            },
            formatTime: d => {return new Date(d).toGMTString()}
        })
        ).render();
    };
    let setDatetime = document.getElementById('setDatetime');
    setDatetime.addEventListener("click", () => {
        slider();
    });

    slider();
}
# CanvasJS Drag And Resize Stripline
## Usage
```
<style>
    #chartContainer{
        height: 300px; 
        width: 90%;
        margin: 0 auto;
    }
</style>
<div id="chartContainer"></div>    
<script src="js/drag-and-resizer.js"></script>
<script>
    let drager = new DragAndResizer('chartContainer', {
        startAt: 10,
        endAt: 20,
        minWidth: 5,
        maxWidth: 20,
        onChange: (start, end) => {
            console.log(start, end);
        }
    });
    drager.render();
</script>

```

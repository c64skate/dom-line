## Getting started

### Usage

#### File include

Link `dom-line.js` in your HTML :

```html
<script src="dom-line.js"></script>
```

### Example usage

Simple usage:
```javascript
// create line manager
const domLine = new DomLine();

// add line using object
domLine.addLine({
	x1: 200,
	y1: 100,
	x2: 600,
	y2: 300,
	color: '#c33',
	movable: true,
	showVertices: false
});

// add line using arguments
domLine1.addLine(120, 550, 200, 700);
domLine1.addLine(250, 50, 500, 120, '#ccc');
domLine1.addLine(450, 350, 600, 400, '#62e86a', false);
domLine1.addLine(50, 50, 70, 175, 'black', false, false);
```

Alternative usages:
```javascript
// create line manager inside of HTML element with id "container"
const containedDomLine = new DomLine(document.getElementById("container"));

// add container div to each line
containedDomLine.lineContainerDiv = true;

// add lines to container
containedDomLine.addLine({
	x1: 25,
	y1: 25,
	x2: 275,
	y2: 175
});

containedDomLine.addLine({
	x1: 275,
	y1: 25,
	x2: 25,
	y2: 175
});
```

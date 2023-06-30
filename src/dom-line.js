/*
 * Dom Line Library
 * Draws lines using only DIV HTML elements in DOM tree
 *
 * Author: Emir Akaydın
 * (C)2023
 * 
 * This library is public domain. You can use it without permission.
 */
var DomLine = (function () {
	// line class
	class Line {
		// line class variables
		manager;
		x1;
		y1;
		x2;
		y2;
		length;
		x;
		y;
		angle;
		color;
		lineBody;
		vertex1;
		vertex2;
		vertexSize = 10;
		vertexMiddle = this.vertexSize * 0.5;
		movable = true;
		showVertices = true;

		// line constructor
		constructor(manager, oLine, y1, x2, y2, color, movable, showVertices) {
			this.manager = manager;

			// set default values if parameters are not passed
			this.color = (arguments.length < 6) ? '#000' : color;
			this.movable = (arguments.length < 7) ? true : movable;
			this.showVertices = (arguments.length < 8) ? true : showVertices;

			// if there is only two arguments, take second object as line parameters object
			if(arguments.length <= 2) {
				this.x1 = oLine.x1;
				this.y1 = oLine.y1;
				this.x2 = oLine.x2;
				this.y2 = oLine.y2;
				if(oLine.hasOwnProperty("color"))
					this.color = oLine.color;
				if(oLine.hasOwnProperty("movable"))
					this.movable = oLine.movable;
				if(oLine.hasOwnProperty("showVertices"))
					this.showVertices = oLine.showVertices;
			} else {
				this.x1 = oLine; // if more parameters exists, oLine holds x1 coordinate
				this.y1 = y1;
				this.x2 = x2;
				this.y2 = y2;
			}

			// if movable, vertices need to be visible
			if(this.movable)
				this.showVertices = true;
		}

		// render line
		render() {
			this.calculateLineParameters();
			this.createLineElements();
		}

		// create line elements
		createLineElements() {
			// prepare line
			var lineContainer;

			// if line should be contained in a blank div, create one
			if(this.manager.lineContainerDiv) {
				lineContainer = document.createElement("div");
			} else {
				lineContainer = this.manager.container;
			}
			this.lineBody = document.createElement("div");
			const lineStyles = 'position:absolute;'
					   + 'border-top:1px solid ' + this.color + ';'
					   + 'width:' + this.length + 'px;'
					   + 'height:0;'
					   + 'transform:rotate(' + this.angle + 'rad);'
					   + 'left:' + this.x + 'px;'
					   + 'top:' + this.y + 'px;'
					   + 'backface-visibility:hidden;';
			this.lineBody.setAttribute('style', lineStyles);
			lineContainer.appendChild(this.lineBody);

			// prepare first vertex
			if(this.showVertices) {
				var vertexStyles = 'position:absolute;'
						   + 'width:' + this.vertexSize + 'px;'
						   + 'height:' + this.vertexSize + 'px;'
						   + 'z-index:1;'
						   + 'background:' + this.color + ';'
						   + 'border-radius:50%;';
				if(this.movable) {
					vertexStyles += ' cursor: pointer;';	
				}		
				const v1Styles = vertexStyles
				   + 'left:' + (this.x1 - this.vertexMiddle) + 'px;'
				   + 'top:' + (this.y1 - this.vertexMiddle) + 'px;'
				this.vertex1 = document.createElement("div");
				this.vertex1.setAttribute('style', v1Styles);
				lineContainer.appendChild(this.vertex1);

				// prepare second vertex
				const v2Styles = vertexStyles
				   + 'left:' + (this.x2 - this.vertexMiddle) + 'px;'
				   + 'top:' + (this.y2 - this.vertexMiddle) + 'px;'
				this.vertex2 = document.createElement("div");
				this.vertex2.setAttribute('style', v2Styles);
				lineContainer.appendChild(this.vertex2);
			}

			// if line should be contained in a blank div
			// add div to main container
			if(this.manager.lineContainerDiv) {
				this.manager.container.appendChild(lineContainer);
			}

			// make vertices movable
			if(this.movable) {
				this.makeMovableVertex(this.vertex1, 0);
				this.makeMovableVertex(this.vertex2, 1);
			}
		}

		// calculate line parameters
		calculateLineParameters() {
			const dX = this.x1 - this.x2;
			const dY = this.y1 - this.y2;

			this.length = Math.sqrt(dX * dX + dY * dY);
			this.x = (this.x1 + this.x2 - this.length) * 0.5;
			this.y = (this.y1 + this.y2) * 0.5;
			this.angle = Math.PI - Math.atan2(-dY, dX);
		}

		// add event listeners for movement to vertices
		makeMovableVertex(vertex, vertexIndex) {
			const self = this;

			// add on mouse down event of a vertex
			vertex.addEventListener("mousedown", e => {
				const mouseMoveHandler = function(e) {
					var x, y;

					// get container bounding box
					const containerRect = self.manager.container.getBoundingClientRect();

					// if container size is zero, make it infinate
					if(containerRect.width == 0)
						containerRect.width = Number.MAX_SAFE_INTEGER;
					if(containerRect.height == 0)
						containerRect.height = Number.MAX_SAFE_INTEGER;

					// calculate vertex x and y coordinates relative to mouse coordinates
					x = Math.min(containerRect.width,  Math.max(0, e.clientX - containerRect.left));
					y = Math.min(containerRect.height, Math.max(0, e.clientY - containerRect.top));

					// apply coordinates to vertex by vertex index
					if(vertexIndex == 0) {
						self.x1 = x;
						self.y1 = y; 
					} else {
						self.x2 = x;
						self.y2 = y; 
					}

					// calculate line parameters
					self.calculateLineParameters();

					// set vertex x and y coordinates by CSS styles
					vertex.style.left = (x - self.vertexMiddle) + 'px';
					vertex.style.top = (y - self.vertexMiddle) + 'px';

					// set line body CSS styles
					self.lineBody.style.left = self.x + 'px';
					self.lineBody.style.top = self.y + 'px';
					self.lineBody.style.width = self.length + 'px';
					self.lineBody.style.transform = 'rotate(' + self.angle + 'rad)';
				}

				const removeMouseMoveListeners = function() {
					// remove on mouse move event of a vertex
					removeEventListener('mousemove', mouseMoveHandler);

					// remove on mouse up event of a vertex
					removeEventListener('mouseup', removeMouseMoveListeners);
				}

				// add on mouse move event of a vertex
				addEventListener('mousemove', mouseMoveHandler);

				// add on mouse up event of a vertex
				addEventListener('mouseup', removeMouseMoveListeners);
			});
		}
	}

	// return line manager class
	return class LineManager {
		// line manager variables
		lines = [];
		container = document.body;
		lineContainerDiv = false;

		// line manager constructor
		constructor(container) {
			if(arguments.length >= 1)
				this.container = container;
		}

		// add line by given coordinates
		addLine(oLine, y1, x2, y2, color, movable, showVertices) {
			var line;
			if(arguments.length == 1) {
				line = new Line(this, oLine);
			} else {
				if(arguments.length == 4) {
					line = new Line(this, oLine, y1, x2, y2);	
				} else if(arguments.length == 5) {
					line = new Line(this, oLine, y1, x2, y2, color);
				} else if(arguments.length == 6) {
					line = new Line(this, oLine, y1, x2, y2, color, movable);
				} else if(arguments.length == 7) {
					line = new Line(this, oLine, y1, x2, y2, color, movable, showVertices);
				}				
			}
			this.lines.push(line);
			line.render();
		}
	}
})();
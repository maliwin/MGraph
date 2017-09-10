class ezGraph {
    constructor(canvas) {
        this.canvas = canvas;

        this.config = {
            width: window.innerWidth, //Width of canvas
            height: window.innerHeight * 0.95, //Height of canvas
            unit: 20, //Width of a single unit in pixels
            bgcolor: '#fffef9', //Background color
            gridlineColor: '#bababa', //Color of graph paper lines
            gridlineWidth: 1,
            font: '17px Courier',
            fontColor: 'black'
        };

        this.ctx = this.canvas.getContext('2d');
        this.canvas.height = this.config.height;
        this.canvas.width = this.config.width;

        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.clear();
    }

    //Sets the background color
    setBackground() {
        this.ctx.fillStyle = this.config.bgcolor;
        this.ctx.fillRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
    }

    //Draws points at (x,y)
    point(x, y, color = 'black', radius = 3) {
        let p = this.coordinateToPixel(x, y);
        x = p.x;
        y = p.y;

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    getBoundingCoordinates() {

        let startingX = -this.canvas.width / 2 + (this.canvas.width / 2 % this.config.unit);
        let startingY = -this.canvas.height / 2 + (this.canvas.height / 2 % this.config.unit);

        let x = -2 * startingX / this.config.unit / 2;
        let y = -2 * startingY / this.config.unit / 2;

        return { x: x, y: y };
    }

    //Draws line form (x1, y1) to (x2, y2)
    line(x1, y1, x2, y2, color = 'black', width = 1) {

        let p = this.coordinateToPixel(x1, y1);
        x1 = p.x;
        y1 = p.y;

        p = this.coordinateToPixel(x2, y2);
        x2 = p.x;
        y2 = p.y;

        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineWidth = width;
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    //Draws a rectangle at (x,y) with a width of w and a height of h
    rect(x, y, w, h, color = 'black') {

        let p = this.coordinateToPixel(x, y);
        x = p.x;
        y = p.y;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    }

    drawAxes() {
        this.line(-this.canvas.width / 2, 0, this.canvas.width, 0, 'black', this.config.gridlineWidth);
        this.line(0, -this.canvas.height / 2, 0, this.canvas.height / 2, 'black', this.config.gridlineWidth);
    }

    drawGrid() {

        let numXLines = Math.floor(this.canvas.width / this.config.unit) + 1;
        let numYLines = Math.floor(this.canvas.height / this.config.unit) + 1;

        let bounding = this.getBoundingCoordinates();
        let startingX = -bounding.x;
        let startingY = -bounding.y;

        //Dashed graph lines
        this.ctx.setLineDash([4, 4]);

        for (let i = 0; i < numXLines; i++) {

            let x1 = startingX + i;
            let x2 = x1;
            let y1 = -this.canvas.height / 2;
            let y2 = this.canvas.height / 2;
            this.line(x1, y1, x2, y2, this.config.gridlineColor, this.config.gridlineWidth);

        }

        for (let i = 0; i < numYLines; i++) {

            let x1 = -this.canvas.width / 2;
            let x2 = this.canvas.width / 2;
            let y1 = startingY + i;
            let y2 = y1;
            this.line(x1, y1, x2, y2, this.config.gridlineColor, this.config.gridlineWidth);
        }

        this.ctx.setLineDash([]);
    }

    drawGraphNumbers() {
        let bc = this.getBoundingCoordinates();
        let startX = bc.x;
        let startY = bc.y;

        let intermission = this.config.unit <= 20 ? 3 : 1;

        //For the love of god, fix the magic numbers
        for (let i = -startX; i < 2 * startX; i += intermission) {

            if (i === 0)
                continue;
            if (i < 0)
                this.drawText(i, i, 0, -5, 15)
            else
                this.drawText(i, i, 0, 0, 15);
        }

        for (let i = -startY; i < 2 * startY; i += intermission) {
            if (i === 0)
                continue;
            if (i < 0)
                this.drawText(i, 0, i, 8, 3);
            else
                this.drawText(i, 0, i, 10, 3);
        }

    }

    drawText(text, x, y, xPixelOffset, yPixelOffset) {

        let p = this.coordinateToPixel(x, y);
        x = p.x + xPixelOffset;
        y = p.y + yPixelOffset;

        this.ctx.fillStyle = this.config.fontColor;
        this.ctx.font = this.config.font;
        this.ctx.fillText(text, x, y);
    }


    coordinateToPixel(x, y) {
        let px = x * this.config.unit;
        let py = - y * this.config.unit;
        return { x: px, y: py };
    }

    clear() {
        this.ctx.clearRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
        this.setBackground();
        this.drawGrid();
        this.drawAxes();
        this.drawGraphNumbers();
    }

}
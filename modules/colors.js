class ColorRGB {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.code = `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}

const colorsRGB = {
    yellow: new ColorRGB(255, 255, 0),
    grey: new ColorRGB(239, 239, 239),
    blue: new ColorRGB(0, 0, 255)
}

export { colorsRGB };

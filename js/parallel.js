class ParallelChart {
    constructor() {
        this.margin = { top: 30, right: 30, bottom: 30, left: 30 };
        this.svg = d3.select("#parallel");
        this.svgWidth = parseInt(this.svg.attr("width"));
        this.svgHeight = parseInt(this.svg.attr("height"));        
    }

    drawChart(data) {
        console.log(data);
    }
}
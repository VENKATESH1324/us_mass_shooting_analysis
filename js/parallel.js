class ParallelChart {
    constructor() {
        this.margin = { top: 30, right: 10, bottom: 10, left: 10 },
        this.width = 960 - this.margin.left - this.margin.right,
        this.height = 500 - this.margin.top - this.margin.bottom;
        //this.svg = d3.select("#parallel");        
    }

    drawChart(data) {
        var dimensions = ["lawTotal", "totalDeaths", "shooting"]
        var x = d3.scaleOrdinal()
                  .domain(dimensions)
                  .range([0, this.width]);

        var line = d3.line(),
            axis = d3.axisLeft(),
            background,
            foreground;
        var svg = d3.select("body").append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        
        let temp_shooting = [];
        let temp_totalDeaths = [];
        let temp_lawTotal = [];
        data.forEach((d) => {
            temp_shooting.push(d.value.shooting);
            temp_totalDeaths.push(d.value.totalDeaths);
            if (d.value.lawTotal === undefined) {
                temp_lawTotal.push(0);    
            }
            else 
                temp_lawTotal.push(d.value.lawTotal);
        });

        var y_lawTotal = d3.scaleLinear().domain(d3.extent(temp_lawTotal)).range([this.height,0]),
            y_totalDeaths = d3.scaleLinear().domain(d3.extent(temp_totalDeaths)).range([this.height, 0]),
            y_shooting = d3.scaleLinear().domain(d3.extent(temp_shooting)).range([this.height, 0]);
        
        
        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path);

        // Add blue foreground lines for focus.
        foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path);

        function path(d) {
            return line(dimensions.map((p) => { return [x(p), ]; }));
        }

    }
}

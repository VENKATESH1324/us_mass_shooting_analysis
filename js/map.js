class Map {
    constructor() {
        this.margin = { top: 30, right: 30, bottom: 30, left: 30 };
        this.margin = { top: 30, right: 10, bottom: 10, left: 10 },
        this.width = 960 - this.margin.left - this.margin.right,
        this.height = 500 - this.margin.top - this.margin.bottom;
    }

    drawChart() {
        // append tooltip div to body
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        
        var svg = d3.select("#viz_content").append("svg")
            .attr("id","us-map")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        //create geoAlbersUsa projection for US map
        var projection = d3.geo.albersUsa()
            .translate([this.width / 2, this.height / 2])
            .scale([1000]);

        var path = d3.geo.path()
            .projection(projection);

        d3.json("data/us-map.json", (error, us) => {
            if (error) throw error;
            var g = d3.select("#us-map")
                .selectAll("g")
                .data(us.features)
                .enter()
                .append("g");
            //markout all cordinates from csv file
            g.append("path")
                .attr("d", path)
                .on("mouseover", (d) => {
                    //append name of the state to tooltip div and setting it's cordinates and opacity
                    div.html(d.properties.name)
                        .style("left", (d3.event.pageX - 20) + "px")
                        .style("opacity", 0.7)
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", () => {
                    div.style("opacity", 0);
                });
            let parallelChart = new ParallelChart();
            parallelChart.drawChart();
        });
    }
}
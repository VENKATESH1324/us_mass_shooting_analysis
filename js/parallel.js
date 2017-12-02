class ParallelChart {
    constructor() {
        this.margin = { top: 30, right: 0, bottom: 10, left: 0 },
        this.width = 800 - this.margin.left - this.margin.right,
        this.height = 500 - this.margin.top - this.margin.bottom;
    }
    //REF: https://bl.ocks.org/mbostock/1341021
    drawChart() {
        var x = d3.scale.ordinal().rangePoints([0, this.width], 1),
            y = {};

        var line = d3.svg.line(),
            axis = d3.svg.axis().orient("left"),
            background,
            foreground;

        var svg = d3.select("#parallelChart").append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        d3.csv("data/cumulative_data.csv", (error, data) => {
            if (error) throw error;
            var height = this.height;
            var dimensions = [];
            // Extract the list of dimensions and create a scale for each.
            x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
                return d != "state" && (y[d] = d3.scale.linear()
                    .domain(d3.extent(data, function (p) { return +p[d]; }))
                    .range([height, 0]));
            }));

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

            // Add a group element for each dimension.
            var g = svg.selectAll(".dimension")
                .data(dimensions)
                .enter().append("g")
                .attr("class", "dimension")
                .attr("transform", function (d) { return "translate(" + x(d) + ")"; });

            // Add an axis and title.
            g.append("g")
                .attr("class", "axis")
                .each(function (d) { d3.select(this).call(axis.scale(y[d])); })
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function (d) { return d; });

            // Add and store a brush for each axis.
            g.append("g")
                .attr("class", "brush")
                .each(function (d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
                .selectAll("rect")
                .attr("x", -8)
                .attr("width", 16);
            // Returns the path for a given data point.
            function path(d) {
                return line(dimensions.map(function (p) { return [x(p), y[p](d[p])]; }));
            }

            // Handles a brush event, toggling the display of foreground lines.
            function brush() {
                var actives = dimensions.filter(function (p) { return !y[p].brush.empty(); }),
                    extents = actives.map(function (p) { return y[p].brush.extent(); });
                var states = [];
                foreground.style("display", function (d) {
                    //displayTable(states);
                    if (actives.every(function (p, i) {return extents[i][0] <= d[p] && d[p] <= extents[i][1];})){
                        states.push(d);
                        
                    }
                        
                    return actives.every(function (p, i) {
                        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                    }) ? null : "none";
                });
                console.log(states);
            }

            function displayTable(states) {
                var body = d3.select("#tableRow").selectAll("tr")
                             .data(states)
                             .enter();
                var tr = body.append("tr")
                tr.append("td").classed("text-center", true).append("text").text((d)=>{ return d.state})
                tr.append("td").classed("text-center", true).append("text").text((d) => { return d.lawtotal})
                tr.append("td").classed("text-center",true).append("text").text((d) => { return d.shootings})
                tr.append("td").classed("text-center", true).append("text").text((d) => { return d.deaths})
            }
                        
        });
    }
}

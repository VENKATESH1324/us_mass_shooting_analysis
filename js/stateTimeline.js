class StateTimeline {
    constructor() {
        this.margin = { top: 30, right: 30, bottom: 30, left: 30 };
        this.margin = { top: 30, right: 10, bottom: 10, left: 10 },
            this.width = 960 - this.margin.left - this.margin.right,
            this.height = 500 - this.margin.top - this.margin.bottom;

    }

    update(stateSelected){
        d3.select("#state-timeline").remove();
        var margin = {top: 50, right: 20, bottom: 30, left: 150},
            width = 500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        var x = d3.scale.ordinal().rangePoints([0, width])
        //var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        var valueline = d3.svg.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.sum); });


        var svg = d3.select("#stateline").append("svg").attr("id","state-timeline")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom+50)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        d3.csv(stateSelected, function(error, data) {
            if (error) throw error;
            // format the data
            data.forEach(function(d) {
                d.year = +parseInt(d.year);
                d.sum = +d.sum;
            });
            // Scale the range of the data
            //x.domain(d3.extent(data, function(d) { return d.year; }));
            x.domain(data.map(function (d) { return d.year; }));
            y.domain([0, d3.max(data, function(d) { return d.sum; })]);

            // Add the valueline path.
            svg.append("path")
                .data([data]).transition().duration(2000)
                .attr("class", "line")
                .attr("d", valueline).style({"stroke":"steelblue", "stroke-width":"1.5px", "fill":"none"});
            // Add the X Axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.svg.axis().scale(x).orient("bottom")).selectAll('text').attr("transform", "rotate(-90)").attr("x",-16).attr("y",-5);

            // Add the Y Axis
            svg.append("g").transition().duration(3000)
                .attr("class", "y axis")
                .call(d3.svg.axis().scale(y).orient("left"));

                svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Death Count").attr("x",20).attr("y",10);
        });


    }

}
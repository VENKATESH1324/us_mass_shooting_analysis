d3.csv("data/shooting_data.csv", (error, data) => {
	if (error) throw error;
	var segregatedData = d3.nest()
		.key((d) => {
			return d.State
		})
		.rollup((v) => {
			return {
				shooting: v.length,
				totalDeaths: d3.sum(v, (d) => {
					return d["Total Number of Fatalities"]
				})
			}
		})
		.entries(data);
		
	d3.csv("data/state_law.csv",(error, lawData) => {
		if(error) throw error;
		segregatedData.forEach((element) => {
			lawData.filter((d) => { 
				if(d.state == element.key) {
					element.value["lawTotal"] = parseInt(d.lawtotal);
				}
			})
		});
		let parallelChart = new ParallelChart;
		parallelChart.drawChart(segregatedData);
	})	
});

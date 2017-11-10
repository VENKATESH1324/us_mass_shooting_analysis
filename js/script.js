d3.csv("data/cumulative_data.csv",(error, lawData) => {
	if(error) throw error;
	let parallelChart = new ParallelChart;
	parallelChart.drawChart(lawData);
})	

d3.json("data/us-counties.json", (error, us) => {
	if (error) 
		throw error;
	let map = new Map();
	/* d3.csv("data/PatientFlow.csv", (error, data) => {
		if (error) throw error
		let nestedData = d3.nest()
			.key((t) =>{ return t.ToState})
			.key((f) => { return f.FromState })
			.rollup((c) => { return c.length })
			.entries(data);
		map.drawChart(us, nestedData);
	}); */
	console.log(us.objects.states.geometries);
	us.objects.states.geometries.filter((d) => { console.log(d); })
	map.drawChart(us);
});

#python script to create cumulative data
import csv
def main():
	data = []
	#open mass shooting data and groupby and count deaths and no of shootings
	with open("shooting_data.csv","rU") as f:
		reader = csv.DictReader(f)
		for row in reader:
			select = [d for d in data if d['state'] == row["State"]]
			try:
				if not select :
					data.append({
						"state" : row["State"],
						"deaths" : row["Total Number of Fatalities"],
						"shootings" : 1
						})
				else :
					select[0]["deaths"] = select[0]["deaths"] + row["Total Number of Fatalities"],
					select[0]["shootings"] = select[0]["shootings"] + 1
			except Exception as e:
				print (e)
	f.close()
	#open state law magnitude data and merge it with shoting data
	with open("state_law.csv","rU") as f2:
		reader = csv.DictReader(f2)
		for row in reader:
			for d in data:
				if(d['state'] == row["state"]):
					d["lawTotal"] = row["lawtotal"]
	f2.close()
	#write final data to a csv file
	keys = data[0].keys()
	with open('cumulative_data.csv', 'w') as output_file:
	    dict_writer = csv.DictWriter(output_file, keys)
	    dict_writer.writeheader()
	    dict_writer.writerows(data)

if __name__ == "__main__":
	main()
library('lubridate')
library('dplyr')
setwd("D:/visualization-project/Vis_project")
dataset <- read.csv("codebeautify.csv")
head(dataset)
dataset$date <- as.Date(dataset$date)

summary_data <- as.data.frame(dataset %>% group_by(lubridate::year(date)) %>% summarise(count = sum(deaths)) %>% order_by(year(date)),asc())
write.csv(summary_data, "summary1_data.csv")

library(httr)
library(jsonlite)
library(quantmod)

# Function to fetch stock data from Python API
fetch_data <- function(ticker) {
  url <- paste0("http://localhost:5000/api/metrics?ticker=", ticker)
  response <- GET(url)
  data <- fromJSON(content(response, "text"))
  return(data)
}

# Function to perform additional risk analysis
risk_analysis <- function(ticker) {
  data <- fetch_data(ticker)
  
  if ("error" %in% names(data)) {
    print("Error fetching data.")
    return(NULL)
  }

  beta_values <- unlist(data$beta)
  var_values <- unlist(data$var)

  print(paste("Beta Values:", paste(beta_values, collapse = ", ")))
  print(paste("VaR Values:", paste(var_values, collapse = ", ")))

  plot(beta_values, type = "o", col = "blue", main = paste("Beta for", ticker),
       xlab = "Days", ylab = "Beta")
  
  plot(var_values, type = "o", col = "red", main = paste("VaR for", ticker),
       xlab = "Days", ylab = "VaR")
}

# Example usage
risk_analysis("AAPL")

library(plumber)
library(quantmod)
library(ggplot2)
library(jsonlite)

#* @apiTitle Market Risk API
#* @param symbol Stock ticker
#* @get /analyze
function(symbol) {
  stock_data <- getSymbols(symbol, src="yahoo", auto.assign=FALSE)
  stock_prices <- Cl(stock_data)
  
  returns <- dailyReturn(stock_prices)
  volatility <- sd(returns) * sqrt(252) * 100
  
  beta_values <- seq(1, 1.2, length.out=5)
  var_values <- 1.65 * beta_values * volatility

  dates <- index(stock_prices)[(length(stock_prices) - 4):length(stock_prices)]
  
  df <- data.frame(Date=dates, Beta=beta_values, VaR=var_values)
  
  p <- ggplot(df, aes(x=Date)) +
    geom_line(aes(y=Beta, color="Beta")) +
    geom_line(aes(y=VaR, color="VaR")) +
    labs(title=paste("Market Risk for", symbol), x="Date", y="Value")
  
  ggsave("plot.png", p)

  list(
    symbol = symbol,
    volatility = round(volatility, 2),
    beta_values = beta_values,
    var_values = var_values
  )
}

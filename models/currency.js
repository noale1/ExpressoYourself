const fallbackRates = {
    'USD': 1,       // US Dollar
    'EUR': 0.85,    // Euro
    'NIS': 3.75,    // New Israeli Shekel
    'JPY': 110.57   // Japanese Yen
  };
  
  class CurrencyModel {
    constructor(apiKey) {
      this.apiKey = apiKey;  // API key for the currency API
    }
  
    async fetchExchangeRate(fromCurrency, toCurrency) {
      let apiUrl = `http://api.currencylayer.com/convert?access_key=${this.apiKey}&from=${fromCurrency}&to=${toCurrency}&amount=1`;
  
      try {
        let response = await fetch(apiUrl);
        let data = await response.json();
  
        // If API call is successful, return the rate
        if (data.success) {
          return data.result;
        } else {
          throw new Error(data.error.info);
        }
      } catch (error) {
        console.warn('API call failed, using fallback rates:', error.message);
        return fallbackRates[toCurrency]; // Use fallback rate if API call fails
      }
    }
  }
  
  module.exports = CurrencyModel;
  
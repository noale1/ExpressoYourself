const fallbackRates = {
    'USD': 1,
    'EUR': 0.85,
    'NIS': 3.75,
    'JPY': 110.57,
  };
  
  class CurrencyModel {
    constructor(apiKey) {
      this.apiKey = apiKey;
    }

    currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'NIS': '₪',
      'JPY': '¥',
    };
  
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
        return fallbackRates[toCurrency];
      }
    }
  }
  
  export default CurrencyModel;
  
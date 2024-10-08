import CurrencyModel from "../models/currency.js";

export default class CurrencyController {
  constructor(apiKey) {
    this.currencyModel = new CurrencyModel(apiKey);
  }

  // Convert currency using the model and return the result
  async convertCurrency(total, fromCurrency, toCurrency) {
    let exchangeRate = await this.currencyModel.fetchExchangeRate(fromCurrency, toCurrency);
    return total * exchangeRate;
  }
};

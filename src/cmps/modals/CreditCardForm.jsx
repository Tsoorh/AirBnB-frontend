import { useState } from "react";
import { CountrySelect } from "../CountrySelect";

export default function CreditCardForm({ saveOrder }) {
  const [cardDetails, setCardDetails] =useState({cardNumber: '', expiration:'', cvv: ''})
  const [address, setAddress] =useState({country: {code: 'IL', name: 'Israel'}, zipCode: ''})


  function onCountryChange(country){
    setAddress(prev => ({...prev, country}))
  }

  function handleChangeCardDetails({ target }) {
        const { name: field, value } = target
        setCardDetails(prevCreds => ({ ...prevCreds, [field]: value }))
  }

  function handleChangeAddress({ target }) {
        const { name: field, value } = target
        setAddress(prevCreds => ({ ...prevCreds, [field]: value }))
  }

  return (
    <section className="credit-card-form">
          <form >
            <div>
              <input 
                type="text" 
                className="card-number"
                placeholder="Card number"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleChangeCardDetails}
                required
              />
            </div>

            <div className="exp-cvv">
              <input 
              type="text"
              className="expiration"
              placeholder="Expiration"
              name="expiration"
              value={cardDetails.expiration}
              onChange={handleChangeCardDetails}
              required
            />
            <input 
              type="text"
              className="cvv"
              placeholder="CVV"
              name="cvv"
              value={cardDetails.cvv}
              onChange={handleChangeCardDetails}
              required
            />
            </div>
          <div>
            <input 
              type="text"
              className="zip-code"
              placeholder="ZIP code"
              name="zipCode"
              value={address.zipCode}
              onChange={handleChangeAddress}
              required
            />
          </div>
          <div>
          <CountrySelect selectedCountry={address.country.code} onCountryChange={onCountryChange}/>
          </div>

        </form>

    </section>


  );
}

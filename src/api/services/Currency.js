const API_URL = 'https://free.currconv.com/api/v7/convert?q=';
const API_KEY = '&compact=ultra&apiKey=dabd58367602770336e5';

const Currency = {

    /**
     * Asyncronous function that uses a Currency Converter API and returns the currency converter rate
     * 
     * @async
     * @function convert
     * @param {number} v - The value to convert.
     * @param {string} i - Origin currency. It is a string of three letters and is not case sensitive. Ex.: "usd", "BRL", "JpY"
     * @param {string} o - Target currency. It is a string of three letters and is not case sensitive. Ex.: "usd", "BRL", "JpY"
     * @param {boolean} round - [Optional] Specifies if the result will be rounded or not, the default is true;
     * @returns {number} The currency conversion rate. Multiply it by the origin currency value.
    */
    convert: async (v, i, o, round = true)=>{
        i = i.toUpperCase();
        o = o.toUpperCase();
        let r = await fetch(API_URL+i+'_'+o+API_KEY);
        r = await r.json();
        r = r[i+'_'+o];
        let res = round ? Math.round((v * r)*100)/100 : v * r;
        return res;
    }
}

export default Currency;
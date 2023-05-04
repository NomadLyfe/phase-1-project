document.addEventListener('DOMContentLoaded', () => {
    let date = new Date();
    let fullDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    console.log(fullDate);
    function fetchStocks(stockName) {
        fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${stockName}`)
        .then(resp => resp.json())
        .then(data => displayStockInfo(data));
    }
    function displayStockInfo(stock) {
        const h1 = document.querySelector('h1');
        h1.querySelector('span').textContent = stock[0].id[0].toUpperCase() + stock[0].id.slice(1);
        const h2 = document.querySelector('h2');
        h2.textContent = `$${(Math.round(stock[0].current_price * 100) / 100).toFixed(4)}`;
        const mcap = document.querySelector('#mcap');
        const hi = document.querySelector('#hi');
        const lo = document.querySelector('#lo');
        const cmcap = document.querySelector('#cmcap');
        const pmcap = document.querySelector('#pmcap');
        mcap.textContent = stock[0].market_cap;
        hi.textContent = stock[0].high_24h;
        lo.textContent = stock[0].low_24h;
        cmcap.textContent = stock[0].market_cap_change_24h;
        pmcap.textContent = stock[0].market_cap_change_percentage_24h;
    }
});

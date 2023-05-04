document.addEventListener('DOMContentLoaded', () => {
    let currentStock = 'bitcoin';
    //setInterval(fetchStocks(currentStock), 60*5*1000);
    //setInterval(fetchStockAction(currentStock), 60*5*1000);
    //fetchDescription(currentStock)
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
    function fetchStockAction(stockName) {
        fetch(`https://api.coingecko.com/api/v3/coins/${stockName}/market_chart?vs_currency=usd&days=1&interval=hourly`)
        .then(resp => resp.json())
        .then(data => displayChart(data.prices));
    }
    function displayChart(stockAction) {
        const h3 = document.querySelector('h3');
        const change = stockAction[24][1] - stockAction[0][1];
        const percChange = change/stockAction[24][1];
        let changeVal = change.toFixed(4).toString();
        let changeSign = '';
        let lineColor = 'rgb(60, 255, 60)';
        if (change < 0) {
            changeVal = changeVal.slice(1);
            changeSign = '-';
            lineColor = 'red';
        }
        h3.textContent = `24 hour change: ${changeSign}$${changeVal} (${percChange.toFixed(4)}%)`
        const prices = [];
        stockAction.forEach(elWithPrice => {
            prices.push(elWithPrice[1]);
        })
        const max = Math.max(...prices);
        const min = Math.min(...prices);
        let i = 0;
        let oldrise = 0;
        const ul = document.querySelector('ul');
        ul.innerHTML = '';
        stockAction.forEach(price => {
            const li = document.createElement('li');
            let newrise = ((price[1] - min)/(max-min))*400;
            li.style = `--y: ${newrise}px; --x: ${40*i}px;`;
            const hyp = Math.sqrt(((newrise-oldrise)**2)+(40**2));
            let ang = 0;
            if (newrise > oldrise) {
                ang = Math.asin(40/hyp) + Math.PI/2;
            } else {
                ang = Math.asin((oldrise-newrise)/hyp) + Math.PI;
            }
            li.innerHTML = `<div class="dataPoint" value="${price[1]}" style="border: 2px solid ${lineColor}; cursor: pointer;";></div>
            <div class="lineSegment" style="--hypotenuse: ${hyp}; --angle: ${ang}; background-color: ${lineColor};"></div>`;
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltiptext';
            tooltip.textContent = `$${price[1].toFixed(4)}`;
            ul.append(li);
            const datapoint = li.querySelector('div');
            datapoint.addEventListener('mouseover', () => {
                datapoint.appendChild(tooltip);
            });
            datapoint.addEventListener('mouseout', () => {
                document.querySelector('.tooltiptext').remove();
            });            
            oldrise = newrise;
            i ++;
        })
        document.getElementsByClassName('lineSegment')[0].remove();
    }
    function fetchDescription(stockName) {
        fetch(`https://api.coingecko.com/api/v3/coins/${stockName}`)
            .then(resp => resp.json())
            .then(data => displayDecription(data.description.en))
    }
    function displayDecription(stockDesc) {
        const sentences = stockDesc.split('\n');
        const p = document.querySelector('#description');
        p.innerHTML = '';
        sentences.forEach((el) => {
            p.innerHTML += el + '<br>';
        })
    }
    const form = document.querySelector('#searchForm')
    form.addEventListener('mouseover', () => {
        form.style = 'box-shadow: 0px 1px 5px 3px rgba(0,0,0,0.12)';
    })
    form.addEventListener('mouseout', () => {
        form.style = 'box-shadow: none';
    })
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(form.querySelector('input').value.toLowerCase())
        const searchedStock = form.querySelector('input').value.toLowerCase();
        currentStock = searchedStock;
        fetchStocks(searchedStock);
        fetchStockAction(searchedStock);
        fetchDescription(searchedStock);
        form.reset();
    })
    const x = document.querySelector('#xAxis');
    let currHour = date.getHours();
    function hours() {
        let hour = currHour;
        for (let i = 0; i < 25; i++) {
            const span = document.createElement('span');
            if (hour === 24) {
                hour = 0;
                span.textContent = hour;
                span.style = 'margin-right: 32px;';
                x.append(span);
                hour += 1;
            } else {
                span.textContent = hour;
                if (hour <9) {
                    span.style = 'margin-right: 32px;';
                } else if (hour > 9 && hour < 23) {
                    span.style = 'margin-right: 24px;';
                } else if (hour === 23 || hour === 9) {
                    span.style = 'margin-right: 28px;';
                }
                x.append(span);
                hour += 1;
            }
        }
    }
    hours();
});

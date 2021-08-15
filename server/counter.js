'use strict'
const db = require("./database/viewModel");
const rp = require('request-promise');

async function ScheduleJob() {
    const interval = await db.GetInterval();
    const time = await GetMilliseconds(interval[0].hours, interval[0].minutes);

    return setInterval(async () => {
        const price = await GetPrice();
        const date = new Date();

        console.log("price => " + price);
        console.log("date => " + date);

        await db.AddQuotation({
            price: price,
            date: date.toString()
        });
    }, time);

}

async function GetMilliseconds(hours, minutes) {
    const interval = await db.GetInterval();
    if (interval[0].minutes != "*")
        minutes = interval[0].minutes * 60 * 1000;
    else
        minutes = 0;
    if (interval[0].hours != "*")
        hours = interval[0].hours * 60 * 60 * 1000;
    else
        hours = 0;

    return minutes + hours;
}

async function RecurrenceJob(interval, job) {
    const time = await GetMilliseconds(interval[0].hours, interval[0].minutes);

    clearInterval(job);

    return setInterval(async () => {
        this.GetQuotes();
    }, time);
}

function GetPrice() {
    const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
            'start': '1',
            'limit': '1',
            'convert': 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': '219395a2-d73d-4f11-aa40-e84359fc2e32'
        },
        json: true,
        gzip: true
    };

    return rp(requestOptions)
        .then(response => response.data[0].quote.USD.price)
        .catch((err) => { err.message });
}

module.exports = {
    ScheduleJob,
    RecurrenceJob
}
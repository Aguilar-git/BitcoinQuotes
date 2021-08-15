const knex = require("./knex");


async function SetInterval(body) {
    const interval = await GetInterval();

    console.log("viewModel.js: body");
    console.log(body);

    if (interval.length > 0) {
        return knex('scan_intervals').where({
            minutes: interval[0].minutes,
            hours: interval[0].hours
        })
            .update({
                minutes: body[0].minutes,
                hours: body[0].hours
            });
    }
    else {
        return knex('scan_intervals').insert({
            minutes: body.minutes,
            hours: body.hours
        });
    }


}

function GetInterval() {
    return knex('scan_intervals').select('minutes', 'hours');
}

function GetQuotes() {
    return knex('quotes').select('date', 'price');
}

function AddQuotation(body) {
    console.log("viewModel.js: AddQuotation запущена");
    console.log(body);

    return knex('quotes')
        .insert({
            date: body.date,
            price: body.price
        });
}

module.exports = {
    SetInterval,
    GetInterval,
    GetQuotes,
    AddQuotation
}
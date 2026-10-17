function readStation(id, callback) {
    const responseTime = 200 + Math.random() * 600; // від 200 до 800 мс

    setTimeout(() => {
        // Приблизно в кожному третьому виклику станція не відповідає
        if (Math.random() < 0.3) {

            const errors = [
                new Error(`Станція ${id}: немає зв'язку`),
                new Error(`Станція ${id}: помилка датчика`),
                new Error(`Станція ${id}: перевищено час очікування`),
            ]

            callback(errors[Math.floor(Math.random() * errors.length)]);
            return;
        }

        // Температура в °F від −80 до +160.
        // Частина значень виходить за межі −50…+60 °C,
        // щоб зустрічався сценарій «Несправний датчик».
        const tempF = Math.round(-80 + Math.random() * 240);

        callback(null, { id, tempF });
    }, responseTime);
}

function readStationAsync(id){
    return new Promise((resolve, reject) => {
        readStation(id, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const IDS = [1, 2, 3];

const fToC = f => (f - 32) * 5 / 9;

function render(id, html) {
    document.getElementById("s" + id).innerHTML = html;
}

function pollStation(id) {
    render(id, `Станція ${id}: опитування...`);

    return readStationAsync(id)
        .then(({ tempF }) => {
            const c = fToC(tempF);
            if (c < -50 || c > 60) {
                render(id, `Станція ${id}: Несправний датчик (${c.toFixed(1)} °C)`);
            } else {
                render(id, `Станція ${id}: успішно, ${c.toFixed(1)} °C`);
            }
        })
        .catch(err => {
            render(id, `Станція ${id}: помилка — ${err.message}`);
        });
}

function pollAll() {
    IDS.forEach(pollStation);
}

pollAll();
setInterval(pollAll, 5000);
const fs = require("fs")
const http = require("http")
const requests = require("requests")

const homeFile = fs.readFileSync("home.html", "utf-8")

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature
}

const server = http.createServer((req, res) => {
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Anand&units=metric&appid=ed8712101a275be914e62dd090271022")
        .on("data", (chunk) => {
            const objData = JSON.parse(chunk) 
            const arrData = [objData]
            console.log(arrData[0])
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join('')
            console.log(realTimeData)
            res.write(realTimeData)
        })
        .on("end", (err) => {
            if(err) return console.log("connection closed due to error")
            res.end("")
            console.log("end")
        })
    }
})

server.listen(8000, "127.0.0.1")
const axios = require("axios");
const nodeSchedule = require("node-schedule");
const express = require("express");

require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();

if (process.env.ENABLED === "true") {
  nodeSchedule.scheduleJob("* * * * *", (fireDate) => {
    bookSlot(fireDate);
  });
  const bookSlot = (fireDate) => {
    const time = process.env.TIME;
    const day = process.env.DAY;
    const month = process.env.MONTH;
    const year = process.env.YEAR;
    const facilityId = process.env.FACILTY_ID;
    const cookie = process.env.COOKIE
    console.log("Executed job at " + fireDate);
    let data =
      `facility_id=${facilityId}&notes=&` + 
      `time_from=${year}-${month}-${day}+${time}%3A00%3A00&` +
      `time_to=${year}-${month}-${day}+${parseInt(time) + 1}%3A00%3A00&` +
      "payment_method=borica&r_type=normal&invoice=F&reservation_create=1";
    console.log(data);
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie":
        cookie,
    };
    axios
      .post("https://www.sport4all.bg/reservations/createReservation", data, {
        headers: headers,
      })
      .then((resp) => {
        console.log(resp.data);
      });
  };
}

app.get('/ping', (req, res) => {
    console.log('Pinged');
    return res.send('Hello');
});

app.listen(port, () => {
    console.log(`Started server on port ${port}`);
});

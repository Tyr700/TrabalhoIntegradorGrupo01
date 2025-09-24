import express from "express";

const app = express();


app.listen(3000, () => {
    console.log("ta rodabdo")
})

import { Board, Led } from "johnny-five";
const board = new Board();





app.get("/piscar", (req, res) => {
    board.on("ready", () => {
        console.log("Placa conectada!");


        const led = new Led(13);
        led.blink(500);
    });
    res.status(200);
});

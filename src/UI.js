import Core from './core';

let domElement = document.createElement("div");
domElement.style.position = "fixed";
domElement.style.left = "50%";
domElement.style.bottom = 0;
domElement.style.transform = "translateX(-50%)";

let canvas = document.createElement('canvas');
let overlayCanvas = document.createElement('canvas');
canvas.style.opacity = 0.8;
overlayCanvas.style.position = 'absolute';
overlayCanvas.style.left = overlayCanvas.style.top = 0;
overlayCanvas.width = canvas.width = 410;
overlayCanvas.height = canvas.height = 100;
let ctx = canvas.getContext('2d');
ctx.fillStyle = "#CCCCCC";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#000000";
ctx.font = "20px Verdana";
ctx.fillText("AMMO", 10, 25);
// ctx.lineWidth = 2;
// ctx.beginPath();
// ctx.moveTo(72, 45);
// ctx.lineTo(12, 75);
// ctx.stroke();

let boxX = 90;
let boxW = 70;
for (var i = 0; i < 4; i++) {
    ctx.strokeRect(boxX + (boxW + 10) * i, 15, boxW, 70);
    ctx.font = "18px Verdana";
    ctx.fillText(i+1, boxX + (boxW + 10) * i + 3, 82);
}
domElement.append(canvas);

ctx = overlayCanvas.getContext('2d');
domElement.append(overlayCanvas);

export default {
    domElement,
    update() {
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        let player = Core.playerId? Core.entities[Core.playerId] : null;
        if (!player) return;
        
        ctx.font = "40px Verdana";
        ctx.fillText(player.inventory[player.selected] !== null? player.inventory[player.selected].ammo : "", 12, 70);
        //ctx.fillText("10", 40, 80);

        for (var i = 0; i < 4; i++) {
            if (player.selected === i) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#CCFFCC";
                ctx.strokeRect(boxX + (boxW + 10) * i, 15, boxW, 70);
            }

            if (player.inventory[i] !== null) {
                ctx.fillText(player.inventory[i].type, boxX + (boxW + 10) * i + 20, 60);
            }
        }
    }
}
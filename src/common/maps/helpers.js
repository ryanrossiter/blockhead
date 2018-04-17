export default {
    GenerateWall: (map, x, y, w, h) => {
        map.objQueue.push({
            name: "wall",
            x, y, w, h, zHeight: 7,
            color: 0x222222
        });
    },

    GeneratePlayerWall: (map, x, y, w, h) => {
        map.objQueue.push({
            name: "player-wall",
            x, y, w, h, zHeight: 7,
            color: 0x222222
        });
    }
}
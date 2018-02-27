export default {
    GenerateWall: (map, x, y, w, h) => {
        map.objQueue.push({
            name: "rectangle",
            x, y, w, h, zHeight: 7,
            color: 0x222222
        });
    }
}
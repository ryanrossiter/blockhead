var Test = {
    indicesWalkTest: function() {
        console.log("Testing indices walk function");

        // *** Single body test ***
        var a = Matter.Bodies.rectangle(0, 0, 100, 100, {isStatic: true});
        var body = Matter.Body.create({ parts: [a] });

        console.assert(walk_indices(body, a, 0, 1).index === 1);
        console.assert(walk_indices(body, a, 0, -1).index === 3);
        console.assert(walk_indices(body, a, 2, 1).index === 3);
        console.assert(walk_indices(body, a, 2, -1).index === 1);
        console.assert(walk_indices(body, a, 3, 1).index === 0);

        var result = null;

        // *** Adjacent + aligned composite body test ***
        var b = Matter.Bodies.rectangle(100, 0, 100, 100, {isStatic: true});
        body = Matter.Body.create({ parts: [b, a] });

        result = walk_indices(body, a, 1, 1);
        console.assert(result.part.id === b.id && result.index === 0, "a1 1 part id: " + result.part.id + " index: " + result.index);

        result = walk_indices(body, b, 0, -1);
        console.assert(result.part.id === a.id && result.index === 1, "b0 -1 part id: " + result.part.id + " index: " + result.index);

        result = walk_indices(body, a, 1, -1);
        console.assert(result.part.id === a.id && result.index === 0, "a1 -1 part id: " + result.part.id + " index: " + result.index);

        result = walk_indices(body, a, 2, -1);
        console.assert(result.part.id === b.id && result.index === 3, "a2 -1 part id: " + result.part.id + " index: " + result.index);

        result = walk_indices(body, b, 3, 1);
        console.assert(result.part.id === a.id && result.index === 2, "b3 1 part id: " + result.part.id + " index: " + result.index);

        // *** Adjacent + offset composite body test ***
        var c = Matter.Bodies.rectangle(100, 50, 100, 100, {isStatic: true});
        body = Matter.Body.create({ parts: [c, a] });
        // Matter.World.add(Core.engine.world, body);
        
        result = walk_indices(body, a, 1, 1);
        console.assert(result.part.id === a.id && result.index === 2, "a1 1 part id: " + result.part.id + " index: " + result.index);

        result = walk_indices(body, a, 2, 1);
        console.assert(result.part.id === a.id && result.index === 3, "a2 1 part id: " + result.part.id + " index: " + result.index);

        result = walk_indices(body, a, 2, -1);
        console.assert(result.part.id === c.id && result.index === 3, "a2 -1 part id: " + result.part.id + " index: " + result.index);

        result = walk_indices(body, c, 0, -1);
        console.assert(result.part.id === a.id && result.index === 1, "c0 -1 part id: " + result.part.id + " index: " + result.index);

        result = walk_indices(body, c, 0, 1);
        console.assert(result.part.id === c.id && result.index === 1, "c0 1 part id: " + result.part.id + " index: " + result.index);

        result = walk_indices(body, c, 3, 1);
        console.assert(result.part.id === c.id && result.index === 0, "c3 1 part id: " + result.part.id + " index: " + result.index);

        // *** Angled adjacent composite body test ***
        var d_verts = [ // in clockwise sorted order
            {x: 0,  y: 0 },
            {x: 22, y: 20},
            {x: 20, y: 50},
            {x:-20, y: 50},
        ];

        var e_verts = [ // in clockwise sorted order
            {x: 0,  y:-30},
            {x: 20, y:-30},
            {x: 22, y: 20},
            {x: 0,  y: 0 },
        ];

        var d = Matter.Bodies.fromVertices(0, 0, d_verts, {isStatic: true});
        Matter.Vertices.translate(d.vertices, Matter.Vertices.centre(d_verts), 1);

        var e = Matter.Bodies.fromVertices(0, 0, e_verts, {isStatic: true});
        Matter.Vertices.translate(e.vertices, Matter.Vertices.centre(e_verts), 1);
        body = Matter.Body.create({ parts: [d, e] });
        //Matter.World.add(Core.engine.world, body);

        console.assert(d.vertices[0].x == d_verts[0].x
            && d.vertices[0].y == d_verts[0].y, "Indices don't match on body 'd'.");

        console.assert(e.vertices[0].x == e_verts[0].x
            && e.vertices[0].y == e_verts[0].y, "Indices don't match on body 'e'.");

        result = walk_indices(body, d, 0, 1);
        console.assert(result.part.id === e.id
                    && result.index === 3,
            "d0 1 part id: " + result.part.id + "(=>" + e.id + ") index: " + result.index + "(=>" + 3 + ")"
        );

        result = walk_indices(body, e, 3, -1);
        console.assert(result.part.id === d.id
                    && result.index === 0,
            "e3 -1 part id: " + result.part.id + "(=>" + d.id + ") index: " + result.index + "(=>" + 0 + ")"
        );

        result = walk_indices(body, d, 1, -1);
        console.assert(result.part.id === e.id
                    && result.index === 2,
            "d1 -1 part id: " + result.part.id + "(=>" + e.id + ") index: " + result.index + "(=>" + 2 + ")"
        );

        result = walk_indices(body, e, 2, 1);
        console.assert(result.part.id === d.id
                    && result.index === 1,
            "e2 1 part id: " + result.part.id + "(=>" + d.id + ") index: " + result.index + "(=>" + 1 + ")"
        );
    },

    bodyWalkTest: function() {
        console.log("Testing body walk function");

        // *** Single body walk test ***
        var a = Matter.Bodies.rectangle(0, 0, 100, 100, {isStatic: true});
        var body = Matter.Body.create({ parts: [a] });
        var result = null;

        result = Matter.Body.walk(body, a, {x:0, y:-50}, 100);
        console.assert(result.distance === 100 && result.walk.length === 3, result);
        
        result = Matter.Body.walk(body, a, {x:50, y:-50}, 100);
        console.assert(result.distance === 100
                    && result.walk[result.walk.length - 1].x === 50
                    && result.walk[result.walk.length - 1].y === 50,
            result
        );

        result = Matter.Body.walk(body, a, {x:-50, y: 50}, -100);
        console.assert(result.distance === 100
                    && result.walk[result.walk.length - 1].x === 50
                    && result.walk[result.walk.length - 1].y === 50,
            result
        );

        // *** Adjacent + aligned composite body walk test ***
        var b = Matter.Bodies.rectangle(100, 0, 100, 100, {isStatic: true});
        body = Matter.Body.create({ parts: [b, a] });
        //Matter.World.add(Core.engine.world, body);

        result = Matter.Body.walk(body, a, {x:-50, y:-50}, 200);
        console.assert(result.distance === 200
                    && result.walk[result.walk.length - 1].body.id === b.id
                    && result.walk[result.walk.length - 1].x === 150
                    && result.walk[result.walk.length - 1].y === -50,
            result
        );

        result = Matter.Body.walk(body, b, {x:150, y:-50}, -200);
        console.assert(result.distance === 200
                    && result.walk[result.walk.length - 1].x === -50
                    && result.walk[result.walk.length - 1].y === -50,
            result
        );

        result = Matter.Body.walk(body, b, {x:150, y:50}, 200);
        console.assert(result.distance === 200
                    && result.walk[result.walk.length - 1].x === -50
                    && result.walk[result.walk.length - 1].y === 50,
            result
        );

        result = Matter.Body.walk(body, a, {x:-50, y:50}, -200);
        console.assert(result.distance === 200
                    && result.walk[result.walk.length - 1].x === 150
                    && result.walk[result.walk.length - 1].y === 50,
            result
        );

        result = Matter.Body.walk(body, a, {x:-50, y:0}, -200);
        console.assert(result.distance === 200
                    && result.walk[result.walk.length - 1].x === 100
                    && result.walk[result.walk.length - 1].y === 50,
            result
        );

        // *** Adjacent + offset composite body test ***
        var c = Matter.Bodies.rectangle(100, 50, 100, 100, {isStatic: true});
        body = Matter.Body.create({ parts: [c, a] });
        //Matter.World.add(Core.engine.world, body);

        result = Matter.Body.walk(body, a, {x:50, y:-50}, 200);
        console.assert(result.distance === 200
                    && result.walk[result.walk.length - 1].x === 150
                    && result.walk[result.walk.length - 1].y === 50,
            result
        );
        
        result = Matter.Body.walk(body, a, {x:0, y:50}, -200);
        console.assert(result.distance === 200
                    && result.walk[result.walk.length - 1].x === 150
                    && result.walk[result.walk.length - 1].y === 100,
            result
        );
    }
}
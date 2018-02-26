import * as THREE from 'three';
import Physics from './common/physics';
import EntityFactory from './EntityFactory';
import io from 'socket.io-client';
import Test1 from './common/maps/Test1';
import WorldBuilder from './common/maps/WorldBuilder';
import SceneBuilder from './SceneBuilder';

import Matter from 'matter-js';
import Stats from 'stats.js';

const UPDATE_INTERVAL = 1000 / 15;

const Core = {
    isClient: true,

    scene: null,
    camera: null,
    renderer: null,
    frameTime: 0,

    keys: [],
    mousePosition: { x: -1, y: -1 },
    mouseButtons: [undefined, false, false, false],

    socket: null,
    timeDiff: 0,

    frameRate: 60,
    zoom: 1,
    targetZoom: 1,
    translateX: 0,
    translateY: 0,

    playerId: null,
    playerNames: {},
    entities: {},
    
    boundsTargetOffset: { x: 0, y: 0 },

    // Empty functions from server Core
    entity: {
        create: function() {},
    },

    init: function(canvasId) {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x777777, 1);
        document.body.appendChild(this.renderer.domElement);

        this.stats = new Stats();
        this.stats.showPanel(0); // fps counter
        document.body.appendChild(this.stats.dom);

        this.camera.position.y = -10;
        this.camera.position.z = 20;
        this.camera.rotation.x = 0.5;

        Physics.CreateEngine(this);

        this.scene.add( new THREE.AmbientLight( 0x222222 ) );

        var pointLight = new THREE.PointLight( 0xffffff, 5 );
        pointLight.position.set(0, 0, 12);
        this.scene.add( pointLight );

        var planeGeometry = new THREE.BoxGeometry( 100, 100 );
        var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
        var plane = new THREE.Mesh( planeGeometry, planeMaterial );
        plane.position.z = -0.5;
        this.scene.add( plane );

        SceneBuilder.Build(this.scene, Test1);
        WorldBuilder.Build(Physics.engine.world, Test1);

        this.runFrame();

        /*
        $(window).resize((function() {
            this.render.context.canvas.width = this.render.options.width = $('#world').width();
            this.render.context.canvas.height = this.render.options.height = $('#world').height();fddddddd
        }).bind(this));
        */

        // $(document).keydown((function(evt) { this.keys[evt.which] = true; }).bind(this));
        // $(document).keyup((function(evt) { this.keys[evt.which] = false; }).bind(this));
        document.addEventListener("keydown", ({ which }) => { this.keys[which] = true; });
        document.addEventListener("keyup", ({ which }) => { this.keys[which] = false; });
        document.addEventListener("mousemove", ({ pageX, pageY }) => { this.mousePosition = { x: pageX, y: pageY } });
        document.addEventListener("mousedown", ({ which }) => { this.mouseButtons[which] = true; });
        document.addEventListener("mouseup", ({ which }) => { this.mouseButtons[which] = false; });

        setInterval(this.update.bind(this), UPDATE_INTERVAL);

        this.socket = io.connect("http://" + window.location.hostname + ":8000", {port: 8000, transports: ["websocket"]});
        this._setSocketEventHandlers(this.socket);
    },

    setCameraAt: function(x, y) {
        this.camera.position.x = x;
        this.camera.position.y = y - 10;
    },

    getTime: function() {
        return Date.now() - this.timeDiff;
    },

    runFrame: function() {
        // this.stats.begin();
        // let en = Object.values(this.entities)[0];
        // if (en) console.log(en.body.position, en.body.velocity);
        Matter.Engine.update(Physics.engine, this.frameTime);
        //if (en) console.log(en.body.position);
        // update positions of drawn geometry
        for (var e in this.entities) {
            if (this.entities.hasOwnProperty(e)) {
                this.entities[e].geometryUpdate();
            }
        }
        this.renderer.render(this.scene, this.camera);
        this.frameTime = this.stats.end();

        requestAnimationFrame(this.runFrame.bind(this));
    },

    update: function() {
        // update the entities
        for (var e in this.entities) {
            if (this.entities.hasOwnProperty(e)) {
                this.entities[e].clientUpdate();
            }
        }
    },

    _setInputEventHandlers: function(canvas) {
        
    },

    _setSocketEventHandlers: function(socket) {
        if (socket) {
            var scope = this;

            socket.on("connect", function() {
                scope.onSocketConnected();
            });

            socket.on("init", function(data) {
                if (data.playerId) {
                    scope.playerId = data.playerId;
                }

                // if (data.bounds) {
                //     scope.bounds = data.bounds;
                //     scope.createMinimap();
                // }

                // if (data.playerNames) {
                //     scope.playerNames = data.playerNames;
                // }
            });

            socket.on("game.update", function(data) {
                if (data.time) {
                    scope.timeDiff = (scope.timeDiff + Date.now() - data.time) / 2; // 2 step rolling average
                }

                // if (data.leaderboard) {
                //     Leaderboard.update(data.leaderboard);
                // }
            });

            socket.on("player.join", function(data) {
                if (data.id && data.name) {
                    scope.playerNames[data.id] = data.name;
                }
            });

            socket.on("player.leave", function(id) {
                delete scope.playerNames[id];
            });

            socket.on("disconnect", function() {
                console.log("Socket disconnected.");

                // remove all entities
                for (var e in scope.entities) {
                    if (scope.entities.hasOwnProperty(e)) {
                        delete scope.entities[e];
                    }
                }
            });

            socket.on("entity.update", function(data) {
                scope.onEntityUpdate(data);
            });

            socket.on("entity.delete", function(ids) {
                for (var i = 0; i < ids.length; i++) {
                    scope.entities[ids[i]].onDelete();
                    delete scope.entities[ids[i]];
                }
            });

            socket.emit("join", { name: "Migos" });

            // $('#join-button').click(function() {
            //     $('#name-overlay').hide();
            //     scope.socket.emit("join", { name: $('#name-input').val() }); //, { name: "Migos" });
            // });

            // $('#name-input').keypress(function(e) {
            //     if (e.keyCode == 13) $('#join-button').click();
            // })
        }
    },

    onSocketConnected: function() {
        console.log("Socket connected.");
    },

    onEntityUpdate: function(data) {
        for (var i = 0; i < data.length; i++) {
            var ent = data[i];
            if (this.entities.hasOwnProperty(ent.id) && this.entities[ent.id].type === ent.type) {
                this.entities[ent.id].dataUpdate(ent, this.getTime());
            } else {
                var e = EntityFactory.initFromData(ent);
                e.dataUpdate(ent, this.getTime());
                this.entities[ent.id] = e;

                if (e.player === this.playerId) {
                    // dis us
                }
            }
        }
    },
};

export default Core;
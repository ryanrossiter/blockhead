import THREE from 'expose-loader?THREE!three/build/three.min.js';
import Core from './core';

document.addEventListener('DOMContentLoaded', function() {
    Core.init();
});
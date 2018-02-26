import COMMON from './common/common';
let { ENTITIES } = COMMON;

import ClientPlayer from './client_entities/ClientPlayer';
import ClientProjectile from './client_entities/ClientProjectile';
import ClientZombie from './client_entities/ClientZombie';

// Associates entity classes with their type
const EntityFactory = {
    store: {},

    registerEntity: function(main, type) {
        if (type !== null && type !== undefined) {
            this.store[type] = main;
        }
    },

    getEntityClass: function(type) {
        if (this.store.hasOwnProperty(type)) {
            return this.store[type];
        } else {
            throw Error("Entity type " + type + " not registered.");
        }
    },

    initFromData: function(data) {
        if (data.hasOwnProperty('type')) {
            return new (this.getEntityClass(data.type))(data);
        } else {
            throw Error("Data missing property type.");
            console.warn(data);
        }
    },
};

EntityFactory.registerEntity(ClientPlayer, ENTITIES.PLAYER);
EntityFactory.registerEntity(ClientProjectile, ENTITIES.PROJECTILE);
EntityFactory.registerEntity(ClientZombie, ENTITIES.ZOMBIE);

export default EntityFactory;
import Helpers from './helpers';

const Test1 = {
    objQueue: [],
}

// border walls
Helpers.GenerateWall(Test1, 0, 50, 102, 2);
Helpers.GenerateWall(Test1, 50, 0, 2, 102);
Helpers.GenerateWall(Test1, 0, -50, 102, 2);
Helpers.GenerateWall(Test1, -50, 0, 2, 102);

Helpers.GenerateWall(Test1, 0, 10, 10, 2);
Helpers.GenerateWall(Test1, 10, 0, 2, 10);
Helpers.GenerateWall(Test1, 0, -10, 10, 2);
Helpers.GenerateWall(Test1, -10, 0, 2, 10);

export default Test1;
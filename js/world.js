function World(gl, engine){
    //engine
    this.gl = gl;
    this.engine = engine

    //viewmatrix settings
    this.fieldOfView = 45 * Math.PI / 180;  // in radians
    this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.zNear = 0.1;
    this.zFar = 3000.0;

    //camera settings
    this.camera = [0, 3, 0];
    this.setCamera = function(arr){
        return [
            arr[0]- this.camera[0],
            arr[1]- this.camera[1],
            arr[2]- this.camera[2]
        ]
    }

    //world specifications
    this.depth = 3000;
    this.width = 8000;
    this.cubeSize = 10.5;
    this.collisionSize = this.cubeSize +2;
    this.collisionZFactor = 0.01;
    this.numberOfLines = 31;

    //turn related
    this.rotation = 0;
    this.rotateDirection = 0;
    this.inversionRotation = 0;
    this.isUpsideDown = false;
    this.maxRotation = 20;

    //color related
    this.planeColor = [255, 255, 255];
    this.horizonColor = [0.8, 0.8, 0.8, 1];
    this.cubeColors = [255, 255, 255];
    this.lineColor = [255,255,255];
    this.setColors = function(arr){
        var value = [];
        value[0] = arr[0] / 255;
        value[1] = arr[1] / 255;
        value[2] = arr[2] / 255;
        value[3] = 1.0;
        return value;
    }

    //speed related
    this.Zspeed = 3;
    this.Xspeed = 4;
    this.aceleration = 0.00002;

    //music related
    this.music = new Audio ('music/music.mp3');
}

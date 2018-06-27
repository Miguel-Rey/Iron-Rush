function World(gl, engine){
    this.gl = gl;
    this.engine = engine
    this.fieldOfView = 45 * Math.PI / 180;  // in radians
    this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.zNear = 0.1;
    this.zFar = 500.0;
    this.camera = [0, 3, 0];
    this.setCamera = function(arr){
        return [
            arr[0]- this.camera[0],
            arr[1]- this.camera[1],
            arr[2]- this.camera[2]
        ]
    }
    this.depth = 500;
    this.width = 2000;
    this.rotation = 0;
    this.rotateDirection = 0;
    this.inversionRotation = 0;
    this.planeColor = [255, 255, 255];
    this.horizonColor = [0.8, 0.8, 0.8, 1];
    this.cubeColors = [255, 255, 255];
    this.setColors = function(arr){
        var value = [];
        value[0] = arr[0] / 255;
        value[1] = arr[1] / 255;
        value[2] = arr[2] / 255;
        value[3] = 1.0;
        return value;
    }
    this.maxRotation = 20;
    this.Zspeed = 3;
    this.Xspeed = 1.5;
    this.aceleration = 0.0001;
    this.cubeSize = 10.5;
}

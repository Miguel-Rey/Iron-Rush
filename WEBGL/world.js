function World(gl, engine){
    this.gl = gl;
    this.engine = engine
    this.fieldOfView = 45 * Math.PI / 180;  // in radians
    this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.zNear = 0.1;
    this.zFar = 300.0;
    this.camera = [0, 3, 0];
    this.setCamera = function(arr){
        return [
            arr[0]- this.camera[0],
            arr[1]- this.camera[1],
            arr[2]- this.camera[2]
        ]
    }
    this.depth = 300;
    this.width = 300;
    this.rotation = 0;
    this.rotateDirection = 0;
    this.rotateTension= 1;
    this.planeColor = [255, 255, 255];
    this.horizonColor = [0.8, 0.8, 0.8, 1];
    this.cubeColors = [237, 237, 237];
    this.setColors = function(arr){
        var value = [];
        value[0] = arr[0] / 255;
        value[1] = arr[1] / 255;
        value[2] = arr[2] / 255;
        value[3] = 1.0;
        return value;
    }
    this.maxRotation = 20;
    this.speed = 2;
    this.aceleration = 0.00005;
    this.cubeSize = 2;
}

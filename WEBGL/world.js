function World(gl, engine){
    this.gl = gl;
    this.engine = engine
    this.fieldOfView = 45 * Math.PI / 180;  // in radians
    this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.zNear = 0.1;
    this.zFar = 100.0;
    this.camera = [0, 0, 0];
    this.setCamera = function(arr){
        return [
            arr[0]- this.camera[0],
            arr[1]- this.camera[1],
            arr[2]- this.camera[2]
        ]
    }
    this.depth = 100;
    this.rotation = 0;
    this.rotateDirection = 0;
    this.rotateTension= 1;
    this.planeColor = [237, 237, 237];
    this.horizonColor = [1, 1, 1, 1];
    this.cubeColors = [237, 237, 237];
    this.setColors = function(arr){
        var value = [];
        value[0] = arr[0] / 255;
        value[1] = arr[1] / 255;
        value[2] = arr[2] / 255;
        value[3] = 1.0;
        return value;
    }
}

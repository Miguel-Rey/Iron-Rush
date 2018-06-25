function World(gl, engine){
    this.gl = gl;
    this.engine = engine
    this.fieldOfView = 45 * Math.PI / 180;  // in radians
    this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.zNear = 0.1;
    this.zFar = 100.0;
    this.camera = [0, 3,0];
    this.setCamera = function(arr){
        return [
            arr[0]- this.camera[0],
            arr[1]- this.camera[1],
            arr[2]- this.camera[2]
        ]
    }
    this.depth = 50;
}

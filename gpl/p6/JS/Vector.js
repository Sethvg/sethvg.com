
//*****************************************//
//              Vector
//          Holder Class
//          PARAMS:
//              Arr [X,Y,Z]
//          RETURNS:
//              None
//
//*****************************************//

function Vector(arr) {
    this.x = arr[0];
    this.y = arr[1];
    this.z = arr[2];
    this.magnitude = mag([this.x, this.y, this.z]);

    this.unit = function () {
        return Vector(this.x / this.magnitude, this.y / this.magnitude, this.z / this.magnitude);
    }

    this.inverse = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }
}
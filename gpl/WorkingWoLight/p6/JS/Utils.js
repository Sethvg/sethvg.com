function dot(v1,v2){
    var s = 0;
    for(var a = 0; a < v1.length; a++){
        s+=v1[a] *v2[a];
    }

    return s;
}



function cos(v1,v2){
    return dot(v1,v2)/(mag(v1)*mag(v2));
}


function mag(vec){
    var s = 0;
    for(var a = 0; a < vec.length; a++){
        s+= vec[a]*vec[a];
    }

    return Math.sqrt(s);
}


function calcVec(face,innerArr){
    var p1 = [face[0],face[1],face[2]];
    var p2 = [face[3],face[4],face[5]];
    var p3 = [face[6],face[7],face[8]];

    var l1 = getLine(p1,p2);
    var l2 = getLine(p3,p2);

    var n1 = math.cross(l1,l2);
    var n2 = math.cross(l2,l1);

    lInner = getLine(innerArr,p2);

    a = cos(n1,lInner);
    b= cos(n2,lInner);

    if((a > 0 && b < 0)){
        return n2;

    }else if(a < 0 && b > 0)
    {
        return n1;
    }else
    {
        console.log("ERRR");
        console.log(new Error().stack);
    }
}

function getLine(v1,v2){
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}
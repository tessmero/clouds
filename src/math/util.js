// shorthands
var pi = Math.PI
var pio2 = Math.PI/2
var twopi = 2*Math.PI
function v(){return new Vector(...arguments)}
function vp(){return Vector.polar(...arguments)}


function randRange(min,max){
    return min + rand()*(max-min)
}

function cleanAngle(a){
    a = nnmod(a,twopi)
    if( a > Math.PI ){
        a -= twopi
    }
    if( a < -Math.PI ){
        a += twopi
    }
    return a        
}

//non-negative mod
function nnmod(a,b){
    var r = a%b
    return (r>=0) ? r : r+b
}

// weighted avg
function avg(a,b,r=.5){
    return (a*(1.0-r)) + (b*r)
}
function va(a,b,r=.5){
    return v(avg(a.x,b.x,r),avg(a.y,b.y,r))
}
function bezier(points,r){
    if( points.length == 1 ) return points[0];
    var ps = []
    for( var i = 1 ; i < points.length ; i++ ){
        ps.push( va(points[i-1],points[i],r) )
    }
    return bezier(ps,r)
}


function addIntersectionPoints(c1, c2, list) {
    let dx = c2.pos.x - c1.pos.x;
    let dy = c2.pos.y - c1.pos.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    // Circles too far apart
    if (d > c1.r + c2.r) { return; }
        
    // One circle completely inside the other
    if (d <= Math.abs(c1.r - c2.r)) { return; }

    dx /= d;
    dy /= d;

    const a = (c1.r * c1.r - c2.r * c2.r + d * d) / (2 * d);
    const px = c1.pos.x + a * dx;
    const py = c1.pos.y + a * dy;

    const h = Math.sqrt(c1.r * c1.r - a * a);

    list.push({
            x: px + h * dy,
            y: py - h * dx
        })
    list.push({
            x: px - h * dy,
            y: py + h * dx
        })
    
}
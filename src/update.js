

function update(dt) {    
    fitToContainer()
    global.t += dt
    
    if( global.mouseDown ){
        global.pointiness = Math.min( global.maxPointiness, global.pointiness+global.pointSpeed*dt)
    } else {
        global.pointiness = Math.max( 0, global.pointiness-10*global.pointSpeed*dt)
    }
    
    //spawn new clouds
    while( (global.clouds.length < global.nClouds) && (global.spawnCountdown<=0) ){
        global.spawnCountdown = randRange( ...global.spawnDelay )
        var x = (global.firstUpdate ? randomXForCloud() : global.screenCorners[2].x+global.oobMargin)
        var y = randomYForCloud()
        global.clouds.push( new Cloud( v(x,y) ) )
    }
    global.spawnCountdown -= dt
    global.firstUpdate = false;
    
    // update clouds
    global.clouds.forEach( b => b.update(dt) )
    
    // remove OOB clouds
    if( true ){
        global.clouds = global.clouds.filter( b => {
            var margin = global.oobMargin
            var result = (b.pos.x+margin>global.screenCorners[0].x) && (b.pos.x-margin<global.screenCorners[2].x) 
                      && (b.pos.y+margin>global.screenCorners[0].y) && (b.pos.y-margin<global.screenCorners[2].y)
            if( !result ){
                //console.log("remove oob cloud")
                //console.log( global.clouds.length )
            }
            return result
        })
    }
    
}



// used in update() to spawn new cloud
function randomYForCloud(){
    var ym = .1*(global.screenCorners[2].y-global.screenCorners[0].y)
    var y = randRange(global.screenCorners[0].y+ym,global.screenCorners[2].y-ym)
    return y
}

// used in update() to spawn new cloud (only on first update)
function randomXForCloud(){
    var xm = .1*(global.screenCorners[2].x-global.screenCorners[0].x)
    var x = randRange(global.screenCorners[0].x+xm,global.screenCorners[2].x-xm)
    return x
}

var lastCanvasOffsetWidth = -1;
var lastCanvasOffsetHeight = -1;
function fitToContainer(){
    
    var cvs = global.canvas
    if( (cvs.offsetWidth!=lastCanvasOffsetWidth) || (cvs.offsetHeight!=lastCanvasOffsetHeight) ){
        
      cvs.width  = cvs.offsetWidth;
      cvs.height = cvs.offsetHeight;
        
        var padding = 0; // (extra zoom IN) thickness of pixels CUT OFF around edges
        var dimension = Math.max(cvs.width, cvs.height) + padding*2;
        global.canvasScale = dimension;
        global.canvasOffsetX = (cvs.width - dimension) / 2;
        global.canvasOffsetY = (cvs.height - dimension) / 2;
    global.ctx.setTransform(global.canvasScale, 0, 0, 
        global.canvasScale, global.canvasOffsetX, global.canvasOffsetY);
        
        var xr = -global.canvasOffsetX / global.canvasScale
        var yr = -global.canvasOffsetY / global.canvasScale
        global.screenCorners = [v(xr,yr),v(1-xr,yr),v(1-xr,1-yr),v(xr,1-yr)]
    }
}
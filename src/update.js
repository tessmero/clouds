


function update(dt) {    
    fitToContainer()
    global.t += dt
    
    //global.pointiness = Math.min(1,Math.max(0,.5+Math.sin(global.t/(2000/twopi))))
    
    // reset periodically
    if( false ){
        global.resetCountdown -= dt
        if( global.resetCountdown < 0 ){
            global.clouds = []
            global.spawnCountdown = 0
            global.resetCountdown = global.resetDelay
        }
    }
    
    //spawn new clouds
    if( (global.clouds.length < global.nClouds) && (global.spawnCountdown<=0) ){
        global.spawnCountdown = randRange( ...global.spawnDelay )
        var x = global.screenCorners[2].x+global.oobMargin
        var y = randRange(global.oobMargin,global.screenCorners[2].y-global.oobMargin)
        global.clouds.push( new Cloud( v(x,y) ) )
    } else {
        global.spawnCountdown -= dt
    }
    
    // update clouds
    global.clouds.forEach( b => b.update(dt) )
    
    // remove OOB clouds
    if( true ){
        global.clouds = global.clouds.filter( b => {
            var margin = global.oobMargin
            var result = (b.pos.x+margin>global.screenCorners[0].x) && (b.pos.x-margin<global.screenCorners[2].x) 
                      && (b.pos.y+margin>global.screenCorners[0].y) && (b.pos.y-margin<global.screenCorners[2].y)
            if( !result ){
                console.log("remove oob cloud")
                console.log( global.clouds.length )
            }
            return result
        })
    }
    
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
class Cloud{
    constructor( pos ){
        
        // overall position
        this.pos = pos
        this.vel = v(0,0)
        
        // bounding ellipse
        this.xr = global.cloudBoundsXr
        this.yr = global.cloudBoundsYr
        
        // inner circles
        this.circles = this.buildChildren()
    }
    
    buildChildren(){
        var result = []
        for( var i = 0 ; i < global.nCirclesPerCloud ; i++ ){
            var r = 1
            var a = randRange(0,twopi)
            var rr = randRange(.01,.02)
            var pos = this.pos.add(v( r*this.xr*Math.cos(a), r*this.yr*Math.sin(a) ))
            result.push({
                pos: pos,
                vel: v(0,0),
                r:rr,
                r2:rr*rr,
                a:0,
                //av:randRange(...global.childSpinSpeed) * (rand()>.5?-1:1),
            })
        }
        return result
    }
    
    update(dt){
        this.t += dt
        
        // update pos
        this.angleOffset += this.avel*dt
        this.pos = this.pos.add(this.vel.mul(dt))
        
        // apply friction
        var fm = 1-(4e-3*dt)
        this.vel  = this.vel.mul(fm) 
        
        // update circles
        this.circles.forEach(c => {
          
        
            c.pos = c.pos.add(c.vel.mul(dt))
            //c.a += c.av*dt
            var dp = c.pos.sub(this.pos)
            c.pa = Math.atan2( dp.y/this.yr, dp.x/this.xr )
            c.a = c.pa
            c.vel  = c.vel.mul(fm) 
            
        
            // tend towards region just inside bounding ellipse
            var d = c.pos.sub(this.pos)
            var r = Math.sqrt( Math.pow( d.x/this.xr, 2 ) + Math.pow( d.y/this.yr, 2 ) )            
            if( r > 1  ){
                var g = 1e-6
                var f = vp( d.getAngle(), g*dt  )
                c.vel = c.vel.sub( f )
            }  
            if( r < .8  ){
                var g = -1e-6
                var f = vp( d.getAngle(), g*dt  )
                c.vel = c.vel.sub( f )
            }
        
            // get pushed by other circles
            //for( var i = 0 ; i < global.nCollisionChecks ; i++ ){
                
                // cycle over balloons
            //    this.collisionCheckOffsetIndex = (this.collisionCheckOffsetIndex+1)%this.circles.length
            //    var o = this.circles[this.collisionCheckOffsetIndex]
        
            // get pushed by other circles
            this.circles.forEach(o => {
                var d = o.pos.sub(c.pos)
                var d2 = d.getD2()
                var md2 = c.r2+o.r2
                if(d2 == 0) return // skip self
                if(d2 > md2) return // skip distant circle
                
                // accel self away from nearby circle
                var angle = d.getAngle()
                var f = 1e-10*dt/d2
                c.vel = c.vel.sub(vp(angle,f))
            })
            
            // limit vel
            var d2 = c.vel.getD2()
            if( d2 < global.circleMinSpeed2 ){
                c.vel = vp( c.vel.getAngle(), Math.sqrt(global.circleMinSpeed2))
            }else if( d2 > global.circleMaxSpeed2 ){
                c.vel = vp( c.vel.getAngle(), Math.sqrt(global.circleMaxSpeed2))
            }
        })
    }

    draw(g){
        
        
        // draw cloud
        g.strokeStyle = 'black'
        g.lineWidth = .001
        
        // debug
        // draw boudnign ellipse
        if( false ){
            g.strokeStyle = 'red'
            g.lineWidth = .001
            g.beginPath()
            g.ellipse(this.pos.x,this.pos.y,this.xr,this.yr,0,0,twopi)
            g.stroke()
        }
        
        // debug
        // draw circles
        if( true ){
            var dr = global.edgeWidth
            g.fillStyle = 'black'
            g.beginPath()
            this.circles.forEach(c => {
                this.childPath(g,c,true)
                g.fill()
            })
            g.beginPath()
            g.ellipse(this.pos.x,this.pos.y,this.xr+dr,this.yr+dr,0,0,twopi)
            g.fill()
            
            g.fillStyle = 'white'
            this.circles.forEach(c => {
                this.childPath(g,c,false)
                g.fill()
            })
            g.beginPath()
            g.ellipse(this.pos.x,this.pos.y,this.xr,this.yr,0,0,twopi)
            g.fill()
        }
        
        
        // debug 
        // draw ints
        if( false ) {
            var ints = this.getInts()
            g.fillStyle = "red";
            var r = .001
            ints.forEach( i => {
                g.fillRect( i.x-r,i.y-r,2*r,2*r )
            })
        }
        
        // debug 
        // draw twisting details
        if( false ) {
            g.font = ".02px Arial";
            g.textAlign = "center";
            g.textBaseline = 'middle';
            g.fillStyle = "red";
            var x = .4
            var y = .4
            g.fillText(this.angleOffset.toFixed(3), this.pos.x, this.pos.y-.01 );
            g.fillText(this.targetAngle.toFixed(3), this.pos.x, this.pos.y+.01 );
        }
        
        // debug 
        // draw retraction info
        if( false ) {
            g.font = ".02px Arial";
            g.textAlign = "center";
            g.textBaseline = 'middle';
            g.fillStyle = "red";
            var x = .4
            var y = .4
            g.fillText(this.stemRetracting, this.pos.x, this.pos.y-.01 );
            g.fillText(this.stemRetraction, this.pos.x, this.pos.y+.01 );
        }
    }
    
    // used in childPath
    pointyRad(c,a,r){
        var da = Math.abs(cleanAngle( c.pa-a ))
        //return r*Math.max(1,2-da) // petal
        
        // return r+.01/da // mesa
        return r+.01/(da+.1)
        
    }
    
    // build path for child
    childPath(g,c,outer){
        
        
        g.beginPath()
        //g.arc(c.pos.x,c.pos.y,c.r+(outer?global.edgeWidth:0),0,twopi)
        
        var n = 30
        var r = c.r+(outer?global.edgeWidth:0)
        var first = true
        for( var i = 0 ; i < n ; i++ ){
            var a = c.a+twopi*i/n
            
            var rr = avg( r, this.pointyRad(c,a,r), global.pointiness )
            var p = c.pos.add(vp(a,rr))
            
            if( i == 0 ){
                g.moveTo( p.x,p.y )
            } else {
                g.lineTo( p.x,p.y )
            }
        }
        
    }
    
    // get all intersection points between circles
    getInts() {
        var circles = this.circles
        var result = [];
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                addIntersectionPoints(circles[i],circles[j],result)
            }
        }
        return result
    }
}

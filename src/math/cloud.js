class Cloud{
    constructor( pos ){
        
        // overall position
        this.pos = pos
        this.vel = v(randRange(...global.cloudSpeed),0)
        
        // bounding ellipse for children
        this.xr = global.cloudBoundsXr
        this.yr = global.cloudBoundsYr
        
        // children
        this.nVertsPerChild = (rand()>.1) ? 50 : Math.floor(randRange(3,6))
        this.circles = this.buildChildren()
        
        // overall shape
        this.nVertsForRoughShape = this.nVertsPerChild+6
    }
    
    buildChildren(){
        var result = []
        for( var i = 0 ; i < global.nCirclesPerCloud ; i++ ){
            var r = 1
            var a = randRange(0,twopi)
            var rr = randRange(.01,.02)
            var pos = v( r*this.xr*Math.cos(a), r*this.yr*Math.sin(a) )
            var av = 0
            if( this.nVertsPerChild < 10 ){
                av = randRange(...global.childSpinSpeed) * (rand()>.5?-1:1)
            }
            result.push({
                pos: pos,
                vel: v(0,0),
                r:rr,
                r2:rr*rr,
                a:0,
                av:av,
            })
        }
        
        return result
    }
    
    update(dt){
        this.t += dt
        
        // update pos
        this.angleOffset += this.avel*dt
        var vt = this.vel.mul(dt)
        if( global.pointiness > 0 ){
            vt = vt.mul(1-(global.pointiness/global.maxPointiness))
        }
        this.pos = this.pos.add(vt)
        
        // apply friction
        var fm = 1-(4e-3*dt)
        //this.vel  = this.vel.mul(fm) 
        
        // update circles
        this.circles.forEach(c => {
          
        
            c.pos = c.pos.add(c.vel.mul(dt))
            //c.a = c.pa
            c.vel  = c.vel.mul(fm) 
            
            var av = c.av
            if( (av!=0) && (global.pointiness != 0) ){
                if( isNaN(c.a) ){
                    c.a = 0
                }
                var d = c.pa-c.a
                var am = .1
                if( Math.abs(d) < am ){
                    av = 0
                } else {
                    av = (d/am) * global.childSpinSpeed[1]
                    av /= 5*Math.max(1,global.pointiness)
                    c.vel = c.vel.mul(1/10*Math.max(1,global.pointiness))
                }
            }
            c.a += av*dt
            var dp = c.pos//.sub(this.pos)
            c.pa = Math.atan2( dp.y/this.yr, dp.x/this.xr )
            
        
            // tend towards region just inside bounding ellipse
            var d = c.pos//.sub(this.pos)
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

    draw(g,firstPass){
        
        
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
        
        // draw cloud
        if( true ){
            g.fillStyle = (firstPass ? 'black' : 'white')
            
            // draw overall shape
            this.roughPath(g,firstPass)
            g.fill()
            
            // draw details
            this.circles.forEach(c => {
                this.childPath(g,c,firstPass)
                g.fill()
            })
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
    }
    
    // used in childPath
    pointyRad(c,a,r){
        var da = Math.abs(cleanAngle( c.pa-a ))
        //return r*Math.max(1,2-da) // petal
        // return r+.01/da // mesa
        return r+.01/(da+.1)
        
    }
    
    // build path for overall cloud shape
    // used in draw
    roughPath(g,outer){
        //g.ellipse(this.pos.x,this.pos.y,this.xr+dr,this.yr+dr,0,0,twopi)
        
        g.beginPath()
       
        var dr = (outer ? global.edgeWidth : 0)
        var xr = this.xr+dr
        var yr = this.yr+dr
        var n = this.nVertsForRoughShape
        var first = true
        
        for( var i = 0 ; i < n ; i++ ){
            var a = twopi*i/n
            
            var x = Math.cos(a)*xr
            var y = Math.sin(a)*yr
            var p = this.pos.add(v(x,y))
            
            if( i == 0 ){
                g.moveTo( p.x,p.y )
            } else {
                g.lineTo( p.x,p.y )
            }
        }
    }
    
    
    // pick edge width
    // used in childPath
    getChildEdgeWidth(){
        var result = global.edgeWidth
        if( this.nVertsPerChild == 3 ){
            return result * 1.5
        } else if( this.nVertsPerChild == 4 ){
            return result * 1.3
        } else if( this.nVertsPerChild == 5 ){
            return result * 1.15
        }
        
        return Math.max(result, global.edgeWidth*global.pointiness)
    }
    
    // build path for cloud detail element
    // used in draw
    childPath(g,c,outer){
        
        
        g.beginPath()
        //g.arc(c.pos.x,c.pos.y,c.r+(outer?global.edgeWidth:0),0,twopi)
        
        var n = this.nVertsPerChild
        var r = c.r+(outer?this.getChildEdgeWidth():0)
        var first = true
        for( var i = 0 ; i < n ; i++ ){
            var oa = c.a
            //oa = avg( oa,0,global.pointiness)
            var a = oa+twopi*i/n
            
            var rr = avg( r, this.pointyRad(c,a,r), global.pointiness )
            var p = this.pos.add(c.pos.add(vp(a,rr)))
            
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

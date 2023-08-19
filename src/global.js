resetRand()

const global = {
    
    // total time elapsed in milliseconds
    t: 0,
    resetCountdown: 30000,
    resetDelay: 30000,
    
    
    // graphics context
    canvas: null,
    ctx: null,

    // 
    backgroundColor: 'white',
    edgeWidth: .002,
    
    // relate screen pixels to virtual 2D units
    canvasOffsetX: 0,
    canvasOffsetY: 0,
    canvasScale: 0,
    centerPos: v(.5,.5),
    screenCorners: null, 
    
    // mouse
    canvasMousePos: v(0,0),     //pixels
    mousePos: v(0,0),           //virtual units
    
    // objects
    nClouds: 1,
    spawnCountdown: 0,
    spawnDelay: [100,1000],
    clouds: [],
    //childSpinSpeed: [1e-4,1e-3], //radians per ms
    pointiness: .5,//
    
    //,
    nCirclesPerCloud: 20,
    cloudBoundsXr: .1,
    cloudBoundsYr: .05,
    circleMaxSpeed2: 1e-8,
    circleMinSpeed2: 1e-10,
    
    // debug
}
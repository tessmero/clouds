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
    backgroundColor: '#EEE',
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
    nClouds: 10,
    spawnCountdown: 0,
    spawnDelay: [0,0],
    oobMargin: .15, //v units
    clouds: [],
    childSpinSpeed: [1e-4,1e-3], //radians per ms
    pointiness: 0,//
    cloudSpeed: [-1e-4,-1e-5], //v units per ms
    
    //,
    nCirclesPerCloud: 20,
    cloudBoundsXr: .1,
    cloudBoundsYr: .05,
    circleMaxSpeed2: 1e-8,
    circleMinSpeed2: 1e-10,
    
    // debug
}
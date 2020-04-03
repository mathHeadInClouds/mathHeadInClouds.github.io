// defaults.js
Defaults = {
    voronoiBFrom : 0.15,
    voronoiBTo : 0.0001,
    zoomMin : 50, zoomVal : 72, zoomMax : 250,
    shiftXMin : -1000, shiftXVal : 400, shiftXMax : 2000,
    shiftYMin : -1000, shiftYVal : 350, shiftYMax : 2000,
    logComplMin : 5, logComplVal : 8, logComplMax : 25,   // complexity up to which functions are computed
    octDistMinMin : 1.3, octDistMin : 3.5, octDistMax : 15,
    latticeMaxTanTiltMin : 0.4, latticeMaxTanTiltVal : 1, latticeMaxTanTiltMax : 4, 
    maxNumFunsInMouseTable : 7,
    rotMin : -Math.PI, rotVal : 0, rotMax : Math.PI,
    mirrored : false,
    rationalTau2 : null
};
Defaults.octDistMaxMax = 1/Math.sqrt(Defaults.voronoiBTo); 
    
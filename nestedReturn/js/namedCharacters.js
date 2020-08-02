Unicode = (function(){
	var smallLeftTriangle  = String.fromCharCode(9664);  // ◀
	var smallRightTriangle = String.fromCharCode(9654);  // ▶
	var bigLeftTriangle    = String.fromCharCode(9668);  // ◄
	var bigRightTriangle   = String.fromCharCode(9658);  // ►
	var bigDownTriangle    = String.fromCharCode(9660);  // ▼
	var bigUpTriangle      = String.fromCharCode(9650);  // ▲
	var nbsp               = String.fromCharCode(160);   // 
	var leftArrow          = String.fromCharCode(8592);  // ←
	var rightArrow         = String.fromCharCode(8594);  // →
	var upArrow            = String.fromCharCode(8593);  // ↑
	var downArrow          = String.fromCharCode(8595);  // ↓
	var lessEqual          = String.fromCharCode(8804);  // ≤
	var greaterEqual       = String.fromCharCode(8805);  // ≥
	var times              = String.fromCharCode(215);   // ×
	var dash               = String.fromCharCode(8211);  // –
	var infinity           = String.fromCharCode(8734);  // ∞
	return {
		smallLeftTriangle  : smallLeftTriangle ,
		smallRightTriangle : smallRightTriangle,
		bigLeftTriangle    : bigLeftTriangle   ,
		bigRightTriangle   : bigRightTriangle  ,
		bigDownTriangle    : bigDownTriangle   ,
		bigUpTriangle      : bigUpTriangle   ,
		nbsp               : nbsp,
		leftArrow          : leftArrow,
		rightArrow         : rightArrow,
		upArrow            : upArrow,
		downArrow          : downArrow,
		lessEqual          : lessEqual,
		greaterEqual       : greaterEqual,
		times              : times,
		dash               : dash,
		infinity           : infinity
	};
})();

Assets = (function(){
	var iconBaseSize = 50;
	var pearGreen = '#C3D659';
	var heart_path_d = 'M 147.5,71.567 C 176.145,-35.337 295,0.621 295,71.567 C 295,155.892 181.52,203.585 147.5,287.78 C 113.48,203.585 0,155.892 0,71.567 C 0,0.621 118.855,-35.337 147.5,71.567';
	function combine(vec1, vec2, factor1, factor2){
		return [
			factor1 * vec1[0] + factor2 * vec2[0],
			factor1 * vec1[1] + factor2 * vec2[1]
		];
	}
	function makeHexagonalBase(r){
	    var  k   = Math.sqrt(3)/2;
	    var  pos = [(3/2)*r ,    -k*r ];
	    var  neg = [-pos[0] ,   pos[1]];
	    var  up  = [   0    , 2*pos[1]];
	    var _pos = [-pos[0] ,  -pos[1]];
	    var _neg = [-neg[0] ,  -neg[1]];
	    var _up  = [-up [0] ,  -up [1]];
	    return [up, neg, _pos, _up, _neg, pos];
	};
	return fiat.dom.fiat([{
		iconBaseSize : iconBaseSize,
		pearGreen : pearGreen,
		icon_downTriag: function($NS$SVG, svg,path,defs,linearGradient,stop){
			return svg.A({width: 40, height: 35})(
				defs(
					linearGradient.A({x1:'0%',x2:'0%',y1:'0%',y2:'100%',id:'downTriGrad628boThot',spreadMethod:'pad'})(
						stop.a('offset')('0%').a('stop-color')('#888888'),
						stop.a('offset')('50%').a('stop-color')('#ffffff'),
						stop.a('offset')('100%').a('stop-color')('#888888')
					)
				),
				path.A({fill: '#aaa', d: 'M0 0L20 34.7L40 0L0 0Z'}),
				path.A({fill: 'url(#downTriGrad628boThot)', d: 'M10  4A5 2.7 0 0 0 10  9L30 9 A5 2.7 0 0 0 30  4L10 4Z'}),
				path.A({fill: 'url(#downTriGrad628boThot)', d: 'M15 12A5 2.7 0 0 0 15 17L25 17A5 2.7 0 0 0 25 12L16 12Z'}),
				path.A({fill: 'url(#downTriGrad628boThot)', d: 'M20 20A5 2.7 0 0 0 20 25L20 25A5 2.7 0 0 0 20 20L20 20Z'})
			).s('filter')('drop-shadow(1px 5px 1px #555)').s('display')('inline-block').template();
		},
		icon_Joe: function($NS$SVG, svg,circle,ellipse,path){
			return svg.a('width')('50').a('height')('50')(
				circle.a('r')('25').a('cx')('25').a('cy')('25').a('fill')('#f7e000'),
				ellipse.a('cx')('32').a('cy')('18').a('fill')('black').a('rx')('2.4').a('ry')('5.9'),
				ellipse.a('cx')('18').a('cy')('18').a('fill')('black').a('rx')('2.4').a('ry')('5.9'),
				path.a('fill')('black').a('stroke')('none').a('d')('M42.21797065221664,30.897583116786606A18.2,18.2 0 0,1 7.782029347783361,30.897583116786606A1.000495405492635,1.000495405492635 0 0,1 7.23866642218298,28.971779140071817L9.385640810710312,28.491673969293906A0.8795564004330869,0.8795564004330869 0 0,1 9.863322503545811,30.184688454317897A16,16 0 0,0 40.13667749645419,30.184688454317893A0.8795564004330833,0.8795564004330833 0 0,1 40.614359189289694,28.491673969293913L42.76133357781702,28.97177914007182A1.0004954054926345,1.0004954054926345 0 0,1 42.21797065221664,30.897583116786606')
			).template();
		},
		icon_Jane : function($NS$SVG, svg,circle,ellipse,path){
			return svg.a('width')('50').a('height')('50')(
				circle.a('r')('25').a('cx')('25').a('cy')('25').a('fill')('#f7e000'),
				ellipse.a('cx')('32').a('cy')('20').a('fill')('black').a('rx')('2.4').a('ry')('5.9'),
				ellipse.a('cx')('18').a('cy')('20').a('fill')('black').a('rx')('2.4').a('ry')('5.9'),
				path.a('fill')('black').a('stroke')('none').a('d')('M42.21797065221664,30.897583116786606A18.2,18.2 0 0,1 7.782029347783361,30.897583116786606A1.000495405492635,1.000495405492635 0 0,1 7.23866642218298,28.971779140071817L9.385640810710312,28.491673969293906A0.8795564004330869,0.8795564004330869 0 0,1 9.863322503545811,30.184688454317897A16,16 0 0,0 40.13667749645419,30.184688454317893A0.8795564004330833,0.8795564004330833 0 0,1 40.614359189289694,28.491673969293913L42.76133357781702,28.97177914007182A1.0004954054926345,1.0004954054926345 0 0,1 42.21797065221664,30.897583116786606'),
				path.a('fill')('red').a('stroke')('none').a('d')('M10,0L25,5.8L40,0L40,16.5L25,10.7L10,16.5L10,33')
			).template();
		},
		icon_Apple: function($NS$SVG, svg,g,path,line){
			return svg.a('width')('50').a('height')('50')(
				g.a('transform')('scale(0.1)')(
					g.a('transform')('translate(250 250) scale(2.5)')(
						path.a('fill')('red').a('stroke')('none').a('d')('M0,-53 C167,-144 86,135 0,88 C -86,135 -167,-144 0,-53'),
						line.a('x1')('0').a('y1')('-53').a('x2')('20').a('y2')('-89').a('stroke')('#510').a('stroke-width')('8')
					)
				)
			).template();
		},
		icon_Orange: function($NS$SVG, svg,path,circle){
			return svg.a('width')('50').a('height')('50')(
				circle.a('cx')('25').a('cy')('25').a('r')('24.75').a('fill')('#d0f5d0'),
				path.a('d')('M48.97170370259915,25.53565634140545L43.707703672776155,39.99837755935258L26.47170370259915,25.53565634140545L48.97170370259915,25.53565634140545').a('fill')('orange').a('stroke')('none'),
				path.a('d')('M43.01907715416526,40.81905068686276L29.69016118149419,48.514503911690305L25.783077183988258,26.356329468915625L43.01907715416526,40.81905068686276').a('fill')('orange').a('stroke')('none'),
				path.a('d')('M28.635124145561708,48.700535406771884L13.478040148055781,46.027932549147074L24.728040148055776,26.542360963997204L28.635124145561708,48.700535406771884').a('fill')('orange').a('stroke')('none'),
				path.a('d')('M12.550256149345081,45.492276207741625L2.6571721816621396,33.70215784741931L23.800256149345078,26.006704622591755L12.550256149345081,45.492276207741625').a('fill')('orange').a('stroke')('none'),
				path.a('d')('M2.2907616643405495,32.695453224827546L2.290761664340546,17.304546775172454L23.433845632023488,25L2.2907616643405495,32.695453224827546').a('fill')('orange').a('stroke')('none'),
				path.a('d')('M2.657172181662136,16.297842152580696L12.550256149345067,4.507723792258382L23.800256149345078,23.993295377408245L2.657172181662136,16.297842152580696').a('fill')('orange').a('stroke')('none'),
				path.a('d')('M13.478040148055765,3.972067450852932L28.6351241455617,1.2994645932281108L24.728040148055776,23.457639036002796L13.478040148055765,3.972067450852932').a('fill')('orange').a('stroke')('none'),
				path.a('d')('M29.690161181494183,1.4854960883096933L43.01907715416526,9.180949313137237L25.783077183988258,23.64367053108438L29.690161181494183,1.4854960883096933').a('fill')('orange').a('stroke')('none'),
				path.a('d')('M43.707703672776155,10.001622440647411L48.97170370259915,24.46434365859455L26.47170370259915,24.46434365859455L43.707703672776155,10.001622440647411').a('fill')('orange').a('stroke')('none'),
				circle.a('cx')('25').a('cy')('25').a('r')('24.625').a('stroke')('orange').a('fill')('none').a('stroke-width')('0.625')
			).template();
		},
		icon_Pear: function($NS$SVG, svg,g,path){
			return svg.a('width')(50).a('height')(50)
				.a('viewBox')('0 0 64 64')(g(g(g(path.a('fill')('#6DE283').a('d')('M29.6,5.2C33.8,8.9,34,15.6,34,15.6s-6.6,0.7-10.8-3C19,8.9,18.8,2.2,18.8,2.2S25.4,1.5,29.6,5.2z')), g(path.a('fill')(pearGreen).a('d')('M34.1,16c0.4,0,0.8,0.1,1.2,0.1c5.3,0.9,9.1,5.9,9.1,11.4V28c0,3.6,1.4,6.9,3.7,9.6c2.4,2.8,3.8,6.5,3.6,10.5c-0.2,6.1-4.3,11.4-9.9,13.5c-3.1,1.1-5.9,1.1-8.5,0.4c-2.6,0.7-5.5,0.8-8.5-0.4c-5.6-2.1-9.7-7.4-9.9-13.5c-0.2-4.1,1.3-7.8,3.7-10.6c2.3-2.7,3.8-6.1,3.8-9.7v-0.7C22.5,20.8,27.8,15.6,34.1,16z'))), g(g(path.a('fill')('#2C2C3D').a('d')('M37.2,63.6C37.2,63.6,37.2,63.6,37.2,63.6c-1.2,0-2.5-0.2-3.8-0.5c-3,0.8-6,0.6-8.9-0.5c-6.1-2.3-10.3-8.1-10.5-14.4c-0.2-4.2,1.3-8.2,4-11.3c2.3-2.6,3.5-5.8,3.5-9v-0.7c0-7,5.8-12.6,12.7-12.2c0.4,0,0.9,0.1,1.4,0.2c5.7,1,9.9,6.2,9.9,12.4V28c0,3.2,1.2,6.4,3.5,9c2.7,3.1,4.1,7.1,3.9,11.2c-0.3,6.4-4.4,12.1-10.5,14.4C40.6,63.2,38.9,63.6,37.2,63.6zM33.4,61c0.1,0,0.2,0,0.3,0c1.2,0.3,2.4,0.5,3.5,0.5l0,0c1.5,0,3-0.3,4.4-0.8c5.3-2,9-7,9.2-12.6c0.2-3.6-1.1-7.1-3.4-9.8c-2.6-3-4-6.6-4-10.3v-0.5c0-5.1-3.5-9.6-8.3-10.4c-0.4-0.1-0.8-0.1-1.1-0.1c-0.2,0-0.4,0-0.6,0c-5.5,0-10,4.6-10,10.2v0.7c0,3.7-1.4,7.3-4,10.3c-2.4,2.7-3.6,6.2-3.5,9.9c0.2,5.6,3.9,10.6,9.2,12.6c2.6,1,5.2,1.1,7.9,0.3C33.3,61.1,33.3,61,33.4,61z')), g(path.a('fill')('#2C2C3D').a('d')('M32.8,16.6c-2.4,0-7-0.4-10.3-3.3c-4.5-3.9-4.7-10.8-4.7-11.1c0-0.5,0.4-1,0.9-1c0,0,0.5-0.1,1.3-0.1c2.4,0,7,0.4,10.3,3.3C34.7,8.4,35,15.3,35,15.6c0,0.5-0.4,1-0.9,1C34.1,16.6,33.6,16.6,32.8,16.6zM19.9,3.2c0.2,1.9,1.1,6.1,4,8.6c3,2.6,7.4,2.8,9.1,2.8c-0.2-1.9-1.1-6.1-4-8.6C26,3.4,21.6,3.2,19.9,3.2z')), g(path.a('fill')('#2C2C3D').a('d')('M34,22c-0.5,0-1-0.4-1-0.9c0-0.1-0.2-2.2,0.1-5.2c0.5-5,2.1-11.7,7.2-15.7c0.4-0.3,1.1-0.3,1.4,0.2c0.3,0.4,0.3,1.1-0.2,1.4c-4.5,3.5-6,9.8-6.5,14.3C34.9,18.9,35,20.9,35,21C35,21.5,34.6,22,34,22C34,22,34,22,34,22z')), g(path.a('fill')('#2C2C3D').a('d')('M33.8,22.2c-1.8,0-3.4-0.6-4-1.7c-0.3-0.5-0.2-1.1,0.3-1.4c0.5-0.3,1.1-0.2,1.4,0.3c0.2,0.3,1,0.8,2.4,0.8c1.3,0,2.1-0.4,2.3-0.8c0.3-0.5,0.9-0.6,1.4-0.3c0.5,0.3,0.6,0.9,0.3,1.4C37.2,21.6,35.6,22.2,33.8,22.2z'))))).template();
		},
		icon_Heart: function($NS$SVG, svg,g,path,line){
			return svg.a('width')('45').a('height')('45')(
				g.a('transform')('scale(0.15)')(
					g(
						path.a('fill')('red').a('stroke')('none').a('d')(heart_path_d)
					)
				)
			).template();
		},
		icon_Heart_inv: function($NS$SVG, svg,g,path,line){
			return svg.a('width')('45').a('height')('45')(
				g.a('transform')('scale(0.15)')(
					g.a('transform')('translate(0 300) scale(1 -1)')(
						path.a('fill')('red').a('stroke')('none').a('d')(heart_path_d)
					)
				)
			).template();
		},
		icon_Chief: function($NS$SVG, svg,g,path){
			var dMainGreen = 'M276.5 371.3A118 118 0 1 0 351.5 195.2A118 118 0 1 0 148.5 195.2A118 118 0 1 0 223.5 371.3A36 36 0 0 1 276.5 371.3Z';
			var dTrunk = 'M223.5 371.3A700 500 0 0 1 186.5 489A2 5 0 0 0 188.5 494A5 2 0 0 0 193.5 496L306.5 496A5 2 0 0 0 311.5 494A2 5 0 0 0 313.5 489A700 500 0 0 1 276.5 371.3A36 36 0 0 0 223.5 371.3Z';
			var dCrown = 'M345 105L155 105L140.93 25.83A11 11 0 1 1 146.779 22.778L194 70L242.152 22.708A11 11 0 1 1 257.848 22.708L306 70L353.221 22.778A11 11 0 1 1 359.07 25.83L345 105Z';
			return svg.a('width')(50).a('height')(50)(
				g.a('transform')('scale(0.1)')(
					path.a('d')(dMainGreen).a('fill')('green'),
					path.a('d')(dTrunk).a('fill')('rgb(48,8,0)'),
					path.a('d')(dCrown).a('fill')('rgb(255,208,0)')
				)
			).template();
		},
		icon_Binoculars: function($NS$SVG, svg,g,path){
			var attribution = "https://www.flaticon.com/authors/iconixar";
			var d1 = "M455.926,125.572A71.751,71.751,0,0,0,422.4,74.689l-2.96-23.65A40.058,40.058,0,0,0,379.75,16H368a40.045,40.045,0,0,0-40,40V82.392A71.831,71.831,0,0,0,304,136v48H208V136a71.669,71.669,0,0,0-24-53.672V56a40.045,40.045,0,0,0-40-40H132.25A40.058,40.058,0,0,0,92.562,51.037L89.605,74.661a72.362,72.362,0,0,0-33.531,50.911L19.853,373.061A96,96,0,1,0,207.664,408h96.672a96,96,0,1,0,187.811-34.939ZM208,296h96v96H208Zm112-66.627c47.82-38.142,91.91-39.164,134.617-3.116l16.072,108.86A95.89,95.89,0,0,0,320,347ZM344,56a24.028,24.028,0,0,1,24-24h11.75a24.034,24.034,0,0,1,23.812,21.023l1.754,14.017A71.951,71.951,0,0,0,384.68,64H376a71.537,71.537,0,0,0-32,7.528Zm32,24h8.68a56.313,56.313,0,0,1,55.414,47.889L451.287,203.7c-20-13.442-40.723-20.07-61.79-19.69-22.724.387-46.044,8.911-69.5,25.373V136A56.063,56.063,0,0,1,376,80ZM304,200v80H208V200ZM132.25,32H144a24.028,24.028,0,0,1,24,24V71.508A72.26,72.26,0,0,0,136,64h-8.68a72.249,72.249,0,0,0-20.634,3.029l1.752-14.008A24.034,24.034,0,0,1,132.25,32ZM100.834,86.647A56.182,56.182,0,0,1,127.32,80H136a55.979,55.979,0,0,1,56,56v71.021C171.215,191.841,149.611,184.1,127.592,184h-.451c-21.86,0-44.276,7.539-66.833,22.446l11.6-78.556A56.27,56.27,0,0,1,100.834,86.647ZM57.047,228.536c47.936-37.716,92.137-38.07,134.953-1.08V347a95.89,95.89,0,0,0-150.689-11.88ZM112,480a80,80,0,1,1,80-80A80.091,80.091,0,0,1,112,480Zm288,0a80,80,0,1,1,80-80A80.091,80.091,0,0,1,400,480Z";
			var d2 = "M112,336a64,64,0,1,0,64,64A64.072,64.072,0,0,0,112,336Zm0,112a48,48,0,1,1,48-48A48.053,48.053,0,0,1,112,448Z";
			var d3 = "M400,336a64,64,0,1,0,64,64A64.072,64.072,0,0,0,400,336Zm0,112a48,48,0,1,1,48-48A48.053,48.053,0,0,1,400,448Z";
			var d4 = "M256,312a32,32,0,1,0,32,32A32.036,32.036,0,0,0,256,312Zm0,48a16,16,0,1,1,16-16A16.019,16.019,0,0,1,256,360Z";
			return svg.a('width')(50).a('height')(50).a('viewBox')('0 0 512 512').a('attribution')(attribution)(g(
				path.a('d')(d1),path.a('d')(d2),path.a('d')(d3),path.a('d')(d4)
			)).template();
		},
		icon_fire: function($NS$SVG, svg,g,path,linearGradient,stop){
			var originalSize = 128;
			var outerPathD = 'M77.54,4.22c0,0-2.01,5.7-0.27,15.78c0.8,4.63,4.6,11.71,7.48,16.8 c8.88,15.73,3.75,29.99,3.75,29.99s3.66-5.96,8.22-13.51c4.58-7.57,11.3-10.82,11.3-10.82s-2.16,3.12-2.87,14.75 c-0.62,10.28,4.23,20.78,2.87,32.31c-1.87,15.78-18.13,30.28-32.25,32.88c-10.23,1.88-20.13,1.8-31.1-4.31 c-17.29-9.64-25.74-28.43-24.9-45.41c0.78-15.56,11.66-32.63,11.14-30.31C27.27,58.61,41.27,67.4,41.27,67.4 s-4.67-22.83,6.65-40.08S77.54,4.22,77.54,4.22z';
			var innerPathD = 'M62.46,43.73c0,0,1.18,15.15-6.58,27.34c-3.74,5.88-11.76,11.92-15.15,19.27 c-3.38,7.32-3.61,16.45,1.5,24.6c4.8,7.65,19.65,8.75,21.41,8.83c11.34,0.46,31.34-6.7,24.81-30.61 c-2.06-7.54-7.43-10.77-7.43-10.77s0.33,3.81-2.65,8.64S71,96.8,71,96.8s12.05-10.01,5.18-31.89 C72.39,52.83,62.46,43.73,62.46,43.73z';
			return function(size){
				var scale = size/originalSize;
				return svg.A({width: size, height: size})(
					g.scale(scale)(
						svg.A({width: originalSize, height: originalSize})(
							g(
								g(
									linearGradient.a('id')('nHINec89eatEo').a('gradientUnits')('userSpaceOnUse').A({x1:64, x2: 64, y1: 88.4516, y2: 31.2066})(
										stop.a('offset')(0.2283).a('style')('stop-color:#FB8C00'),
										stop.a('offset')(0.7141).a('style')('stop-color:#EF6C00')
									),
									path.a('d')(outerPathD).a('style')('fill:url(#nHINec89eatEo);')
								),
								linearGradient.a('id')('niNEnoNesHo78a9iH').a('gradientUnits')('userSpaceOnUse').A({x1:64, x2: 64, y1: 121.8682, y2: 65.1756})(
									stop.a('offset')(0).a('style')('stop-color:#FFB300'),
									stop.a('offset')(0.0251).a('style')('stop-color:#FFB504'),
									stop.a('offset')(0.3106).a('style')('stop-color:#FFCE28'),
									stop.a('offset')(0.577).a('style')('stop-color:#FFE042'),
									stop.a('offset')(0.8148).a('style')('stop-color:#FFEA52'),
									stop.a('offset')(1).a('style')('stop-color:#FFEE58')
								),
								path.a('d')(innerPathD).a('style')('fill:url(#niNEnoNesHo78a9iH);')
							)
						)
					)
				);
			}
		},
		icon_SnowFlake: function($NS$SVG, svg, g, path){
			return function(strokeWidthFactor, opacity, greyLevel, rotateFlag, LEVEL, radius){
				var r           = radius;
				var k           = Math.sqrt(3)/2;
				var strokeWidth = strokeWidthFactor * k * r;
				var strokeColor = ['rgba(',[greyLevel,greyLevel,greyLevel,opacity].join(','),')'].join('');
				var atts        = {fill: 'none', stroke: strokeColor, 'stroke-width': strokeWidth};
		
				function hexagon(factor){
					return function(vec){
						var tx = factor * vec[0];
						var ty = factor * vec[1];
						var vars = {a: r/2, c: r, b: k*r, x: -r, y: 0};
						var p = path.dxy().vars(vars).x('x','acaACA').y('y','b.BB.b').z()().A(atts);
						return g.translate(tx, ty)(p);
					}
				}
				var base = makeHexagonalBase(r);
				var doubles = fiat.util.range(base.length).map(function(i){
					var j = (i+1) % base.length;
					var v1 = base[i], v2 = base[j];
					return [
						combine(v1, v2, 3, 4),
						combine(v1, v2, 4, 3)
					];
				});
				function level3Inner(factor){  // = 7 hexagons
					return function(vec){
						var tx = factor * vec[0];
						var ty = factor * vec[1];
						function v(x, y){ return {a: r/2, b: k*r, c: r, x: x*r/2, y: y*k*r}; }
						var outerPts = path.dxy().vars(v(-4, 0)).x('x', 'AacacacaAaACACACAa').y('y', 'BB.B.b.bbbb.b.B.BB').getPoints();
						var innerPts = path.dxy().vars(v(-2, 0)).x('x', 'acaACA').y('y', 'b.BB.b').getPoints();
						var d = path.line(outerPts).$().getAttribute('d') + 'Z' + path.line(innerPts).$().getAttribute('d');
						return g.translate(tx, ty)(
							path.a('d')(d).A({fill: strokeColor, stroke: 'none'})
						);
					};
				}
				var level3 = (function(oneHex3, l3i1){
					return function(factor){
						return function(vec){
							var tx = factor * vec[0];
							var ty = factor * vec[1];
							return g.translate(tx, ty)(
								l3i1([0,0]), base.map(oneHex3)
							);
						};
					};
				})(hexagon(3), level3Inner(1));
				function twoHexes(twoVecs){
					var vec1   = twoVecs[0];
					var vec2   = twoVecs[1];
					var diff   = [vec1[0]-vec2[0], vec1[1]-vec2[1]];
					var center = [(vec1[0]+vec2[0])/2, (vec1[1]+vec2[1])/2];
					var normal = [diff[1], -diff[0]];
					var f = 1/(2*Math.sqrt(3));
					var linePoints = [
						[f,0],[2*f,1/2],[f,1],[-f,1],[-2*f,1/2],[-f,0],[-2*f,-1/2],[-f,-1],[f,-1],[2*f,-1/2],[f,0],[-f,0]
					].map(function(coeffs){
						var coeffNormal = coeffs[0], coeffDiff = coeffs[1];
						var cx = coeffNormal*normal[0] + coeffDiff*diff[0];
						var cy = coeffNormal*normal[1] + coeffDiff*diff[1];
						return [cx,cy];
					});
					return g.translate(center[0], center[1])( path.line(linePoints).A(atts) );
				};
				var level5_maker = (function(oneHex7, l3i1, l3i4, l3_12){
					return function(flag){
						return function(factor){
							return function(vec){
								var tx = factor * vec[0];
								var ty = factor * vec[1];
								return g.translate(tx, ty)(
									l3i1([0,0]), base.map(l3i4), flag ? base.map(l3_12) : null, base.map(oneHex7), doubles.map(twoHexes)
								);
							};
						};
					};
				})(hexagon(7), level3Inner(1), level3Inner(4), level3(12));
				var level5 = level5_maker(true);
				var level5Inner = level5_maker(false);

				var twoLevel3s = (function(l3i4, hex){
					return function(twoVecs){
					    var vec1   = twoVecs[0];
					    var vec2   = twoVecs[1];
					    var diff   = [vec1[0]-vec2[0], vec1[1]-vec2[1]];
					    var center = [(vec1[0]+vec2[0])/2, (vec1[1]+vec2[1])/2];
					    var normal = [diff[1], -diff[0]];			    
					    var  g     = 3*Math.sqrt(3)/2;
					    var  w3    = combine(vec1, vec2, 3/8, 5/8);
					    var  w5    = combine(vec1, vec2, 5/8, 3/8);
					    var  w11   = combine(vec1, vec2, 11/8, -3/8);
					    var  w_3   = combine(vec1, vec2, -3/8, 11/8);
					    var  u53   = combine(w5, normal, 4, -g);
					    var  u35   = combine(w3, normal, 4, -g);
					    var _u53   = combine(w5, normal, 4,  g);
					    var _u35   = combine(w3, normal, 4,  g);
					    var  v3p   = combine(w_3, normal, 4, -g);
					    var  v3m   = combine(w11, normal, 4, -g);
					    var _v3p   = combine(w_3, normal, 4,  g);
					    var _v3m   = combine(w11, normal, 4,  g);
					    var right  = combine(vec1, vec2, -3,  7);
					    var  left  = combine(vec1, vec2,  7, -3);
					    return [
					        l3i4(vec1), l3i4(vec2),
					        twoHexes([ u53,  u35]),
					        twoHexes([_u53, _u35]),
					        hex(v3p), hex(v3m), hex(_v3p), hex(_v3m),
					        hex(right), hex(left)
					    ];
					};
				})(level3Inner(4), hexagon(1));

				var level7_maker = (function(l5_48, l5i_1, l5i_16, l3_28){
					return function(flag){
						return function(factor){
							return function(vec){
								var tx = factor * vec[0];
								var ty = factor * vec[1];
								return g.translate(tx, ty)(
									l5i_1([0,0]),
									base.map(l5i_16),
									flag ? base.map(l5_48) : null,
									base.map(l3_28),
									doubles.map(twoLevel3s)
								);
							};
						};
					};
				})(level5(48), level5Inner(1), level5Inner(16), level3(28));
				var level7 = level7_maker(true);
				var level7Inner = level7_maker(false);
				var level9 = null; 

				var WIDTH  = [1.5625,3.125,6.25,12.5,25,50,100,200][LEVEL]*r;
				var HEIGHT = [1.75  ,3.5  ,7   ,14  ,28,56,112,224][LEVEL]*r;
				return svg.a('width')(rotateFlag ? HEIGHT : WIDTH).a('height')(rotateFlag ? WIDTH : HEIGHT)(
					g.translate(rotateFlag ? HEIGHT/2 : WIDTH/2, rotateFlag ? WIDTH/2 : HEIGHT/2)(
						({3: level3, 5: level5, 7: level7, 9: level9})[LEVEL](1)([0,0]).rotDeg(rotateFlag ? 30 : 0)
					)
				)
			};
		},
		icon_Siberia: function($NS$SVG, svg, g, path, line, $lib){
			var r, svgWidth, svgHeight, svgCenterY, base, theColor, thickness, mainPathAtts, k;
			k            = Math.sqrt(3)/2;
			r            = 25;
			svgWidth     = 730;
			svgHeight    = 1240;
			svgCenterY   = 458;
			theColor     = 'black';
			thickness    = 3;
			mainPathAtts = {fill: '#00bb00', stroke: theColor, 'stroke-width': thickness};
			base = makeHexagonalBase(r);
			function p_x_helper(_x_, _y_){
				return function(xy,fill, stroke, strokeWidth, opacity){
					var x = xy[0];
					var y = xy[1];
					var vars = {a: r/2, c: r, b: k*r, x: x-r, y: y};
					return path.dxy().vars(vars)
						.x('x', _x_).y('y', _y_).z()()
						.A({fill: fill, stroke: stroke, 'stroke-width': strokeWidth})
						.a('opacity')(opacity);
				}
			}
			var p  = p_x_helper('acaACA', 'b.BB.b');
			function L0(x1,x2,y1,y2){
				return line.A({x1:  x1*r, y1: y1*k*r, x2:  x2*r, y2: y2*k*r, stroke: theColor, 'stroke-width': thickness});
			}
			function L(x1,x2,y1,y2){
				return [
					line.A({x1:  x1*r, y1: y1*k*r, x2:  x2*r, y2: y2*k*r, stroke: theColor, 'stroke-width': thickness}),
					line.A({x1: -x1*r, y1: y1*k*r, x2: -x2*r, y2: y2*k*r, stroke: theColor, 'stroke-width': thickness})
				];
			}
			function L6(x, y){
				return [
					L( 1  +x,  2+x,   0+y,   0+y), L(-1  +x, -2+x,   0+y,   0+y),
					L( 0.5+x,  1+x,   1+y,   2+y), L(-0.5+x, -1+x,  -1+y,  -2+y),
					L(-0.5+x, -1+x,   1+y,   2+y), L( 0.5+x,  1+x,  -1+y,  -2+y)
				];
			}
			function L06(x, y){
				return [
					L0( 1  +x,  2+x,   0+y,   0+y), L0(-1  +x, -2+x,   0+y,   0+y),
					L0( 0.5+x,  1+x,   1+y,   2+y), L0(-0.5+x, -1+x,  -1+y,  -2+y),
					L0(-0.5+x, -1+x,   1+y,   2+y), L0( 0.5+x,  1+x,  -1+y,  -2+y)
				];
			}
			function hex(i, w1, w2){
				var j = (i+1) % 6;
				return p(combine(base[i], base[j], w1, w2), 'white', theColor, thickness, 1);
			}

			function L6w(w1, w2){ return L6(-1.5*w2, -2*w1-w2); }
			function L06w(w1, w2){ return L06(-1.5*w2, -2*w1-w2); }
			function hexx(i, w1, w2){
				return [hex(i, w1, w2), hex(5-i, w2, w1)];
			}
			function pathPointsHelper(p){ return p.$().getAttribute('d').slice(1,-1).split('L').map(function(s){return s.split(',').map(function(a){return +a})}); }
			function joinL(p){ return pathPointsHelper(p).join('L'); }
			function mapJoinL( p_arr_1d){ return p_arr_1d.map(joinL    ).join('ZM'); }
			function map2JoinL(p_arr_2d){ return p_arr_2d.map(mapJoinL ).join('ZM'); }
			function oneTree(width, tx, ty){
				var scale = width/svgWidth;
				var trunkColor = '#391300';
				var trunkAtts = {fill: trunkColor, stroke: trunkColor, 'stroke-width': thickness};
				var extra = false;
				var outerDX, outerDY, X0, Y0, trunkDX, trunkDY, trunkX0, trunkY0;
				X0 = -14;
				Y0 = 26;
				outerDX = 'Aac' + 'aAaAac'.repeat(9) + 'aAaAac'.repeat(8) + 'aAaAa' + 'caA' + 'CA'.repeat(18) + 'C';
				outerDY = 'BB.' + 'BBBBB.'.repeat(9) + 'bbbbb.'.repeat(8) + 'bbbbb' + '.bb' + '.b.B'.repeat(9) + '.';
				trunkDX = 'AaAaAaAaAacacacaAaAaAaAaACACAC';
				trunkDY = 'BBBBBBBBBB.B.b.bbbbbbbbbb.B.b.';
				trunkX0 = -2;
				trunkY0 = 36;
				return g.translate(tx,ty)(g.scale(scale)(
					g.translate(svgWidth/2,svgCenterY)(
						path.dxy().vars({a:r/2, b:k*r, c:r, x: X0*r, y: Y0*k*r}).x('x', outerDX).y('y', outerDY).z()().A(mainPathAtts)
						,L(-2,-1,-12,-12),L(-2.5,-2,-11,-10)
						,hexx(0,3,1),L(-3.5,-2.5,-7,-7),L(-4,-3.5,-6,-5)
						,L(-5,-4,-2,-2),L(-5.5,-5,-1,0),hexx(1,1,2)
						,L(-6.5,-5.5,3,3),L(-7,-6.5,4,5)
						,L(-8,-7,8,8),hexx(2,4,2),hexx(2,2,3),L6w(-5,2),L(-8.5,-8,9,10)
						,L(-9.5,-8.5,13,13),L(-10,-9.5,14,15),hexx(2,6,5),L(-8.5,-8,17,18),hexx(2,5,7),L6w(-12,5)
						,L(-11,-10,18,18),L(-11.5,-11,19,20)
						,L(-12.5,-11.5,23,23),L(-13,-12.5,24,25),hexx(2,7,8)
						,hexx(3,8,0),L6w(-8,0),hexx(2,1,6),hexx(2,2,7),hexx(2,1,9)
						, path.dxy().vars({a:r/2, b:k*r, c:r, x: trunkX0*r, y: trunkY0*k*r}).x('x', trunkDX).y('y', trunkDY).z()().A(trunkAtts)
					)
				));
			}
			return function(size, tx,ty){
				var f = svgHeight/svgWidth;
				var w = size/f;
				var result = svg.a('width')(size).a('height')(size)(
					oneTree(0.2*w,0.35*w,0.05*w)
					,oneTree(0.65*w,1.1*w,0.06*w)
					,oneTree(0.45*w,-0.04*w,0.24*w)
					,oneTree(1.1*w,0.24*w,-0.08*w)
				);
				return arguments.length >= 3
					? g.translate(tx,ty)(result)
					: result
			};
		}
	}]);
})();

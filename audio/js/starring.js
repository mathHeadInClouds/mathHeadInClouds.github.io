var App, Assets, pearGreen = '#C3D659', iconBaseSize = 50, movie, screening;

function bodyOnload(){
	Assets = fiat.dom.fiat([{
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
				.a('viewBox')('0 0 64 64').a('xml:space')('preserve')(g.a('id')('XMLID_10_')(g(g(path.a('fill')('#6DE283').a('d')('M29.6,5.2C33.8,8.9,34,15.6,34,15.6s-6.6,0.7-10.8-3C19,8.9,18.8,2.2,18.8,2.2S25.4,1.5,29.6,5.2z')), g(path.a('fill')(pearGreen).a('d')('M34.1,16c0.4,0,0.8,0.1,1.2,0.1c5.3,0.9,9.1,5.9,9.1,11.4V28c0,3.6,1.4,6.9,3.7,9.6c2.4,2.8,3.8,6.5,3.6,10.5c-0.2,6.1-4.3,11.4-9.9,13.5c-3.1,1.1-5.9,1.1-8.5,0.4c-2.6,0.7-5.5,0.8-8.5-0.4c-5.6-2.1-9.7-7.4-9.9-13.5c-0.2-4.1,1.3-7.8,3.7-10.6c2.3-2.7,3.8-6.1,3.8-9.7v-0.7C22.5,20.8,27.8,15.6,34.1,16z'))), g(g(path.a('fill')('#2C2C3D').a('d')('M37.2,63.6C37.2,63.6,37.2,63.6,37.2,63.6c-1.2,0-2.5-0.2-3.8-0.5c-3,0.8-6,0.6-8.9-0.5c-6.1-2.3-10.3-8.1-10.5-14.4c-0.2-4.2,1.3-8.2,4-11.3c2.3-2.6,3.5-5.8,3.5-9v-0.7c0-7,5.8-12.6,12.7-12.2c0.4,0,0.9,0.1,1.4,0.2c5.7,1,9.9,6.2,9.9,12.4V28c0,3.2,1.2,6.4,3.5,9c2.7,3.1,4.1,7.1,3.9,11.2c-0.3,6.4-4.4,12.1-10.5,14.4C40.6,63.2,38.9,63.6,37.2,63.6zM33.4,61c0.1,0,0.2,0,0.3,0c1.2,0.3,2.4,0.5,3.5,0.5l0,0c1.5,0,3-0.3,4.4-0.8c5.3-2,9-7,9.2-12.6c0.2-3.6-1.1-7.1-3.4-9.8c-2.6-3-4-6.6-4-10.3v-0.5c0-5.1-3.5-9.6-8.3-10.4c-0.4-0.1-0.8-0.1-1.1-0.1c-0.2,0-0.4,0-0.6,0c-5.5,0-10,4.6-10,10.2v0.7c0,3.7-1.4,7.3-4,10.3c-2.4,2.7-3.6,6.2-3.5,9.9c0.2,5.6,3.9,10.6,9.2,12.6c2.6,1,5.2,1.1,7.9,0.3C33.3,61.1,33.3,61,33.4,61z')), g(path.a('fill')('#2C2C3D').a('d')('M32.8,16.6c-2.4,0-7-0.4-10.3-3.3c-4.5-3.9-4.7-10.8-4.7-11.1c0-0.5,0.4-1,0.9-1c0,0,0.5-0.1,1.3-0.1c2.4,0,7,0.4,10.3,3.3C34.7,8.4,35,15.3,35,15.6c0,0.5-0.4,1-0.9,1C34.1,16.6,33.6,16.6,32.8,16.6zM19.9,3.2c0.2,1.9,1.1,6.1,4,8.6c3,2.6,7.4,2.8,9.1,2.8c-0.2-1.9-1.1-6.1-4-8.6C26,3.4,21.6,3.2,19.9,3.2z')), g(path.a('fill')('#2C2C3D').a('d')('M34,22c-0.5,0-1-0.4-1-0.9c0-0.1-0.2-2.2,0.1-5.2c0.5-5,2.1-11.7,7.2-15.7c0.4-0.3,1.1-0.3,1.4,0.2c0.3,0.4,0.3,1.1-0.2,1.4c-4.5,3.5-6,9.8-6.5,14.3C34.9,18.9,35,20.9,35,21C35,21.5,34.6,22,34,22C34,22,34,22,34,22z')), g(path.a('fill')('#2C2C3D').a('d')('M33.8,22.2c-1.8,0-3.4-0.6-4-1.7c-0.3-0.5-0.2-1.1,0.3-1.4c0.5-0.3,1.1-0.2,1.4,0.3c0.2,0.3,1,0.8,2.4,0.8c1.3,0,2.1-0.4,2.3-0.8c0.3-0.5,0.9-0.6,1.4-0.3c0.5,0.3,0.6,0.9,0.3,1.4C37.2,21.6,35.6,22.2,33.8,22.2z'))))).template();
		}
	}]);
	//Assets.joeLikes(800, 500, 20, 42).$$().fn.refill(document.body);
	//Assets.icon_Joe.$$().fn.refill(document.body);
	App = fiat.dom.fiat([{
		leftWidth: 460,
		rightWidth: 800,
		height: 500,
		headingHeight: 120,
		widthAll: function($IMPORT, leftWidth, rightWidth){ return leftWidth + rightWidth; },
		tdTop: function(td){
			return td.s('vertical-align')('top').s('padding')(0).template();
		},
		SVG: function($NS$SVG, svg, $ARGS, width, height, key){
			return svg.a('width')(width).a('height')(height).K(key);
		},
		bold: function($NS$SVG, text, $ARGS, fontSize, content){
			return text.a('font-size')(fontSize).a('font-weight')('bold')(content);
		},
		movieStar: function(tr, $NS$SVG, g, $ARGS, item, $IMPORT, leftWidth, rightWidth, height, tdTop, SVG, bold){
			return tr(
				tdTop(SVG(leftWidth , height, [item, 'left' ])(g.scale(6)(Assets['icon_' + item]))),
				tdTop(SVG(rightWidth, height, [item, 'right'])(bold(160, item).a('y')(200)))
			);
		},
		sectionHeading: function(tr, $NS$SVG, g, rect, $ARGS, key, content, $IMPORT, widthAll, headingHeight, tdTop, SVG, bold){
			return tr(
				tdTop.a('colspan')(2)(
					SVG(widthAll, headingHeight, ['sectionHeading', key])(
						rect.A({width: widthAll-100, height: headingHeight-20, x: 50, y: 10, fill: 'rgb(255,255,200)'}),
						bold(80, content).a('fill')('black').a('y')(90).a('x')(100).a('font-family')('monospace')
					)
				)
			);
		},
		body: function(div, table, $IMPORT, movieStar, sectionHeading){
			return div(
				div.K(['movieContainer2'])(
					table.S({border: {collapse: 'collapse', spacing: 0}})
						(sectionHeading('smileys', ' ... the smileys'))
						.M(movieStar)(['Joe', 'Jane'])
						(sectionHeading('fruits', ' ... the fruits'))
						.M(movieStar)(['Apple', 'Orange', 'Pear'])
				)
			);
		}
	}]).body.setRoot().fn.append();
	return;
	var duration1 = 500;
	var icons = [
		{icon: "icon_Joe"},
		{icon: "icon_Jane"},
		{icon: "icon_Apple"},
		{icon: "icon_Orange"},
		{icon: "icon_Pear"}
	];
	var introDomNode  = Assets.intro.$();
	var introDomNode2 = Assets.intro2.$();
	var introMovies = [
		App.fn.movie.textWriter(introDomNode , App.nodes.all),
		App.fn.movie.textWriter(introDomNode2, App.nodes.all)
	];
	var data = [
		{ container: 'movieContainer1', duration: 3000 },
		{ container: 'movieContainer1', duration: 1500 },
		objTimes({container: 'movieContainer2', duration: duration1}, icons)
	];
	var binSearch = fiat.util.multiBinarySearch(data);
	var containers = {
		movieContainer1: null,
		movieContainer2: null
	};
	function movie_set(position){
		var nodes = this.app.nodes;
		var foundStack = binSearch.search(position);
		if (!Array.isArray(foundStack)){
			debugger; throw new Error('unexpected');
		}
		if (foundStack.length>0){
			var found = foundStack[foundStack.length-1];
			var containerName = found.container;
			Object.keys(containers).forEach(function(c){
				if (c===containerName){
					if (!App.nodes[c].parentNode){
						App.root.appendChild(App.nodes[c]);
					}
				} else {
					if (App.nodes[c].parentNode){
						App.nodes[c].parentNode.removeChild(App.nodes[c]);
					}
				}
			});
			if (containerName === 'movieContainer1'){
				var introMovie = introMovies[found.idx];
				var localPosition = position - binSearch.sums[found.idx];
				introMovie.set(Math.round(localPosition / found.duration * introMovie.intervalLength()));
			} else {
				var iconName = found.icon;
				var name = iconName.slice(5);
				fiat.util.dom.refill(nodes.left , fiat.dom.fiat(function($NS$SVG,g){ return g.scale(6)(Assets[iconName]); }));
				fiat.util.dom.refill(nodes.right, Assets.bold(160, name).a('y')(200));
			}
		} else {
			//end
		}
	}
	movie = App.fn.movie(movie_set, binSearch.duration-0.001);
	screening = movie.createScreening({
		duration: binSearch.duration,
		onFinish: function(){
			App.elder.updateDirectionLabel();
			App.elder.updatePlayLabel();
		},
		onUpdate: function(manualChange){
			App.elder.updateTimeLabel();
			if (!manualChange){
				App.nodes.slider.value = screening.getPosition();
			}
		}
	});
	(function(slider){
		slider.min = 0;
		slider.max = movie.highPosition;
		slider.value = 0;
	})(App.nodes.slider);
}



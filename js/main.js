'use strict';

(function() {

	var _requestAnimationFrame = function(win, t) {

		return win["webkitR" + t] || win["r" + t] || win["mozR" + t] || win["msR" + t] || function(fn) {
			setTimeout(fn, 60)
		};

	}(window, "equestAnimationFrame");

	var animate = function(list) {

		var item,
			duration,
			end = 0;

		var step = function() {

			var current = +new Date(),
				remaining = end - current;

			if (remaining < 60) {

				if (item) item.run(1); //1 = progress is at 100%

				item = list.shift(); //get the next item

				if (item) {
					duration = item.time * 1000;
					end = current + duration;
					item.run(0); //0 = progress is at 0%
				} else {
					return;
				}

			} else {
				var rate = remaining / duration;
				rate = 1 - Math.pow(rate, 3); //easing formula
				item.run(rate);
			}

			_requestAnimationFrame(step);
		};
		step();
	};

	setTimeout(function() {

		animate([
			{
				time: 5,
				element: document.getElementsByTagName('body')[0],
				start: 255,
				end: 0,
				run: function(rate) {
					var i = parseInt(rate * (this.end - this.start) + this.start);
					this.element.style['background-color'] = 'rgb(' + i + ', ' + i + ', ' + i + ')';
				}
			},
			{
				time: 2,
				element: document.getElementsByClassName('synopsis')[0],
				start: 0,
				end: 100,
				run: function(rate) {
					var i = (rate * (this.end - this.start) + this.start) / 100;
					this.element.style['opacity'] = i;
				}
			}
		]);

	}, 3000);

})();
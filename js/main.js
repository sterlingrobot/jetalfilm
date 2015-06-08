"use strict";

(function(window, document) {

	var $hero = document.querySelector('.hero');
	var $heroBkgnd = document.querySelector('.hero-bkgnd');

	var interval;

	var _requestAnimationFrame = (function(win, t) {

		return win["webkitR" + t] || win["r" + t] || win["mozR" + t] || win["msR" + t] || function(fn) {
			win.setTimeout(fn, 60);
		};
	}(window, "equestAnimationFrame"));

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

	var quotes = [
		'...for the first time I have consensus between parts who are so oppositional, '
			+ 'they can\'t often agree on what to buy at the grocery store.',
		'A discovery or sudden realization I made about my life and my situation this morning: I\'m SAFE.',
		'Luckily I have an alter who thinks he\'s the devil. That\'s his name, in fact: THE DEVIL.'
			+ ' You know him as Ted.',
		'...what it\'s like experiencing severe dissociation on non-functional days like today: '
		+ 'it\'s like having Early Onset Alzheimer\'s, bi-polar and schizophrenia',
		'Tomorrow I\'ll wake-up as a boy and stare at the wall until I remember it\'s 2014 and not 1985.'
	];

	var images = [
		'ethan-headphones.jpg',
		'ethan-under-blanket.jpg',
		'in-hospital.png',
		'peter.jpg',
		'screen-shotatam.png',
		'ted-bird.jpg',
		'ted-rejoices_rare.jpg',
		'ted-working-out.png',
		'the-bullet.jpg',
		'toby-message-to-ethan.jpg'
	];

	var getRandQuote = function() {
		var index = Math.floor(Math.random() * quotes.length);
		return quotes[index];
	};

	var getRandImage = function() {
		var index = Math.floor(Math.random() * images.length);
		return images[index];
	};

	var setHeroContent = function() {

		animate([
			{
				time: 0.25,
				element: $heroBkgnd,
				start: 30,
				end: 0,
				run: function(rate) {
					var i = (rate * (this.end - this.start) + this.start) / 100;
					this.element.style.opacity = i;
				}
			},
			{
				time: 0.5,
				element: $hero,
				start: 100,
				end: 0,
				run: function(rate) {
					var i = (rate * (this.end - this.start) + this.start) / 100;
					this.element.style.opacity = i;
				}
			},
			{
				time: 0,
				run: function(rate) {
					$hero.innerText = getRandQuote();
					$heroBkgnd.style['background-image'] = 'url("img/' + getRandImage() + '")';
				}
			},
			{
				time: 1,
				element: $heroBkgnd,
				start: 0,
				end: 30,
				run: function(rate) {
					var i = (rate * (this.end - this.start) + this.start) / 100;
					this.element.style.opacity = i;
				}
			},
			{
				time: 2,
				element: $hero,
				start: 0,
				end: 100,
				run: function(rate) {
					var i = (rate * (this.end - this.start) + this.start) / 100;
					this.element.style.opacity = i;
				}
			}
		]);

	};

	window.setTimeout(function() {


		animate([
			{
				time: 1,
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
				run: function(rate) { /*noop*/ }
			},
			{
				time: 1.5,
				element: document.body.querySelector('h1'),
				startGB: 255,
				startLeft: 60,
				endG: 105,
				endB: 0,
				endLeft: 0,
				run: function(rate) {
					var g = parseInt(rate * (this.endG - this.startGB) + this.startGB),
						b = parseInt(rate * (this.endB - this.startGB) + this.startGB),
						rgb = 'rgb(255, ' + g + ', ' + b + ')',
						opac = (rate * (this.endOpac - this.startOpac) + this.startOpac) / 100;

					this.element.style.color = rgb;
					this.element.style.left = Math.round(rate * (this.endLeft - this.startLeft) + this.startLeft, 1) + 'px';
				}
			},
			{
				time: 0.25,
				element: document.body.querySelector('h1 > small'),
				start: 0,
				end: 100,
				run: function(rate) {
					var opac = (rate * (this.end - this.start) + this.start) / 100;
					this.element.style.opacity = opac;
				}
			},
			{
				time: 2,
				run: function(rate) { /*noop*/ }
			},
			{
				time: 2,
				element: document.body.querySelector('h2'),
				start: 0,
				end: 100,
				run: function(rate) {
					var opac = (rate * (this.end - this.start) + this.start) / 100;
					this.element.style.opacity = opac;
				}
			},
			{
				time: 2,
				run: function(rate) { /*noop*/ }
			},
			{
				time: 0,  // run once
				run: function(rate) { interval = window.setInterval(setHeroContent, 8*1000); setHeroContent(); }
			},
		]);

	}, 1000);

})(window, document);
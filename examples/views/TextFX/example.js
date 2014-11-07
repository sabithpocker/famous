/**
 * TextFX
 * -------------
 *
 * TextFX is a View which helps to aminate individual letters in a word.
 *
 * In this example, we create such a text with individual letters animating in synchronisation.
 */
define(function(require, exports, module) {
    var Engine     = require("famous/core/Engine");
    var Surface    = require("famous/core/Surface");
    var TextFX    = require("famous/views/TextFX");
    var Modifier   = require("famous/core/Modifier");

    var mainContext = Engine.createContext();
	mainContext.setPerspective(1000);
    var textFX = new TextFX({
		text: 'Abnormal Activity',
		transition: {curve : 'easeOutBounce', duration : 500},
		animationBoundaries: {
			scale: {from: [1, 1, 1], to: [0.5, 0.5, 0.5]},
			rotate: {from: [0, 0, 0], to: [0, Math.PI/4, 0]},
			translate: {from: [-10, -10, -10], to: [10, 10, 10]},
			skew: {from: [0, 0, 0], to: [Math.PI/4, 0, 0]}
			}
		});

    var centerModifier = new Modifier({
        align : [0.5,0.5],
        origin : [0.5,0.5]
    });

    mainContext.add(centerModifier).add(textFX);

});

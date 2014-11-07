/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var Transitionable = require('../transitions/Transitionable');
    var RenderNode = require('../core/RenderNode');
    var Surface = require('../core/Surface');
    var OptionsManager = require('../core/OptionsManager');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var RenderNode = require('famous/core/RenderNode');
	var SpringTransition = require('famous/transitions/SpringTransition');
	Transitionable.registerMethod('spring', SpringTransition);
	var Timer = require('famous/utilities/Timer');

    /**
     * Allows you to create a Text whose letters can be animated.
	 *
     * @class TextFX
     * @constructor
     * @param {Options} [options] An object of options.
     * @param {Transition} [options.transition=true] The transition executed when flipping your TextFX instance.
     */
    function TextFX(options) {
        this.options = Object.create(TextFX.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);
		
		var text = this.options.text,
			animationBoundaries = this.options.animationBoundaries;
			
		this._characterNodes = [];
		
		this.direction = "to";
		//initialize with "from" values
		this.scale = new Transitionable(animationBoundaries.scale.from)
		this.rotate = new Transitionable(animationBoundaries.rotate.from);
		this.translate = new Transitionable(animationBoundaries.translate.from);
		this.skew = new Transitionable(animationBoundaries.skew.from);
		
		this._generateCharacterNodes(text);
		this.setAnimation();
		
    }
	
    /**
     * Creates an array of character nodes
     *
     * @method _generateCharacterNodes
     * @param {Options} options An object of configurable options for the TextFX instance.
     */
    TextFX.prototype._generateCharacterNodes = function _generateCharacterNodes(text) {
		var characterNode;
		
        for(var i=0; i < text.length; i++){
			characterNode = new Surface({
				content : text.charAt(i),
				size: [30, 30],
				align: [0.5, 0.5],
				origin: [0.5, 0.5]
				});
			characterNode.originalTransform = Transform.translate(15*(i+1), 0);
			this._characterNodes.push(characterNode);
		}
		
    };
	
	TextFX.DEFAULT_OPTIONS = {
        text: 'the default text',
		transition: {curve : 'easeOutBounce', duration : 500},
		animationBoundaries: {
			scale: {from: [1, 1, 1], to: [0.5, 0.5, 0.5]},
			rotate: {from: [0, 0, 0], to: [Math.PI/2, Math.PI/2, Math.PI/2]},
			translate: {from: [-10, -10, -10], to: [10, 10, 10]},
			skew: {from: [0, 0, 0], to: [0, 0, 0]}
			}
    };
	
    /**
     * Patches the TextFX instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the TextFX instance.
     */
    TextFX.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };
	
    /**
     * Reverses the direction of transitionable
     *
     * @method reverseDirection
     * @param {Options} options An object of configurable options for the TextFX instance.
     */
    TextFX.prototype.reverseDirection = function reverseDirection() {
        this.direction = (this.direction === "to")? "from" : "to";
		return this.direction;
    };
	
    /**
     * Basic setter to the scale
     *
     * @method setAnimation
     */
    TextFX.prototype.setAnimation = function ( direction ) {
		var animationBoundaries = this.options.animationBoundaries,
			direction = (typeof direction === "undefined")? "to" : direction;
		
		this.direction = direction;
		
        if (typeof transition === "undefined") transition = this.options.transition;
		
        if (this.scale.isActive()) this.scale.halt();
        if (this.rotate.isActive()) this.rotate.halt();
        if (this.translate.isActive()) this.translate.halt();
        if (this.skew.isActive()) this.skew.halt();
		
        this.scale.set(animationBoundaries.scale[direction], transition);
        this.rotate.set(animationBoundaries.rotate[direction], transition);
        this.translate.set(animationBoundaries.translate[direction], transition);
        this.skew.set(animationBoundaries.skew[direction], transition);
    };
	
    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Number} Render spec for this component
     */
    TextFX.prototype.render = function render() {

        var result = [],
			scale = this.scale.get(),
			rotate = this.rotate.get(),
			translate = this.translate.get(),
			skew = this.skew.get(),
			finalTransform,
			originalTransform,
			i,
			origin;
		
		if(!this.scale.isActive()){
			this.setAnimation(this.reverseDirection());
		}
		
		for(i=0; i < this._characterNodes.length; i++){
			origin = this._characterNodes[i]
			finalTransform = Transform.multiply4x4(Transform.scale(scale[0], scale[1], scale[2]),Transform.translate(translate[0], translate[1], translate[2]))
			finalTransform = Transform.multiply4x4(finalTransform, Transform.rotate(rotate[0], rotate[1], rotate[2]));
			finalTransform = Transform.multiply4x4(finalTransform, Transform.skew(skew[0], skew[1], skew[2]));

			originalTransform = this._characterNodes[i].originalTransform;
			result.push({
				transform: Transform.multiply4x4(originalTransform, finalTransform), //add the initial translation to this before applying, stored in node.initialPosition
				target: this._characterNodes[i].render()
			});
		}

        return result;
    };

    module.exports = TextFX;
});

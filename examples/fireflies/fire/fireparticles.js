define(function () {

	/**** FIRE PARTICLES CONFIG ****/

	/* Radius reducing speed in terms of pixels per second. */
	var radiusVar = 20;

	/* Start color of the fire : Bright yellow color. */
	function startColor () {
		return {
			r: 255,
			g: 255 * Math.random(),
			b: 75
		};
	};

	/* Fire color reducing velocity in terms of value per second. */
	function colorVar () {
		return {
			r: 480 - 120 * Math.random(),
			g: 960 - 240 * Math.random(),
			b: 480 - 120 * Math.random()
		};
	};

	/* transfer function from color to an RGB string for ease of rendering. */
	function toRGBString (color) {
		return color.r.toFixed(0) + ', ' + color.g.toFixed(0) + ', ' + color.b.toFixed(0);
	};

	/* Starting Radius. */
	function startRadius () {
		return 20 + 10 * Math.random();
	};

	/* Fire velocity in terms of pixels per second. */
	function velocity () {
		return {
			x: -90 + 180 * Math.random(),
			y: -600 + 300 * Math.random()
		};
	};

	/* Lifespan and remaining life time in terms of seconds. */
	function lifespan () {
		return 0.2 + 0.1 * Math.random();
	};

	/**** FIRE PARTICLES OBJECT ****/

	return function () {

		var fireParticle = this;

		/* Color and the reducing speed in terms of pixels per second. */
		fireParticle.color = startColor();
		fireParticle.colorVar = colorVar();
		fireParticle.rgbString = toRGBString(fireParticle.color);

		/* Radius. */
		fireParticle.radius = startRadius();

		/* Position, initially using a fault position. */
		fireParticle.position = null;

		/* Velocity in terms of pixels per second. */
		fireParticle.velocity = velocity();

		/* Lifespan and remaining life time in terms of seconds. */
		fireParticle.lifespan = lifespan();
		fireParticle.remainingLife = 0;

		/* Opacity. */
		fireParticle.opacity = 1;
		fireParticle.opacityString = "1";

		fireParticle.update = function (newPosition, timeDiff) {
			/* Update lifespan and radius. */
			fireParticle.remainingLife -= timeDiff;
			fireParticle.radius -= radiusVar * timeDiff;

			/* Update Opacity. */
			fireParticle.opacity = fireParticle.remainingLife / fireParticle.lifespan;
			fireParticle.opacityString = fireParticle.opacity.toFixed(2);

			/* Update the fire particle. If the remainingLife is over, reset properties of the fire particle. */
			if ((fireParticle.remainingLife <= 0 || fireParticle.radius <= 0) && newPosition !== null && Math.random() > 0.7) {
				fireParticle.color = startColor();
				fireParticle.radius = startRadius();
				fireParticle.position = { x: newPosition.x, y: newPosition.y };
				fireParticle.lifespan = lifespan();
				fireParticle.remainingLife = fireParticle.lifespan;
			} else if (fireParticle.remainingLife > 0 && fireParticle.radius > 0) {
				fireParticle.colorVar = colorVar();
				fireParticle.color.r -= fireParticle.colorVar.r * timeDiff;
				fireParticle.color.g -= fireParticle.colorVar.g * timeDiff;
				fireParticle.color.b -= fireParticle.colorVar.b * timeDiff;
				fireParticle.position.x += fireParticle.velocity.x * timeDiff;
				fireParticle.position.y += fireParticle.velocity.y * timeDiff;
			} else {
				fireParticle.position = null;
				fireParticle.remainingLife = 0;
				fireParticle.radius = 0;
			}

			/* Update Color String. */
			fireParticle.rgbString = toRGBString(fireParticle.color);
		};
	};
});

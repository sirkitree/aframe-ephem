if (!AFRAME) {
  throw "AFRAME has not been loaded!";
}

AFRAME.registerComponent('planets', {
  init: function() {
      var sceneEl = this.el;

      // here are some planets we'll add dynamically to the scene
      //Moon, Mercury, Venus, Sun, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
      var planets = {
        moon: "https://rawgit.com/sirkitree/aframe-ephem/master/img/2k_moon_preview.jpeg",
        mercury: "https://rawgit.com/sirkitree/aframe-ephem/master/img/2k_mercury_preview.jpeg",
        venus: "https://rawgit.com/sirkitree/aframe-ephem/master/img/2k_venus_preview.jpeg",
	      sun: "https://rawgit.com/sirkitree/aframe-ephem/master/img/2k_sun_preview.jpeg",
        mars: "https://rawgit.com/sirkitree/aframe-ephem/master/img/2k_mars_preview.jpeg",
        jupiter: "https://rawgit.com/sirkitree/aframe-ephem/master/img/2k_jupiter_preview.jpeg",
        saturn: "https://rawgit.com/sirkitree/aframe-ephem/master/img/2k_saturn_preview.jpeg",
        uranus: "https://rawgit.com/sirkitree/aframe-ephem/master/img/2k_uranus_preview.jpeg",
        neptune: "https://rawgit.com/sirkitree/aframe-ephem/master/img/2k_neptune_preview.jpeg",
        pluto: "https://rawgit.com/sirkitree/aframe-ephem/master/img/4k_pluto_preview.jpeg"
      };
      var planetTotal = 10; // can't count objects easily
      var planetRadius = .100;
      var index = 0; // index tracker
      var startPos = -1;
      var radiusDivider = 100; // higher numbers bring the radius inward towards the user

      // create initial elements for copying later
      var planetEl = document.createElement('a-sphere');
      planetEl.setAttribute('radius', planetRadius);
      var planetParentEl = document.createElement('a-entity');

      // loop through our planets object to create our elements and their properties
      for (const planetName in planets) {
        index = index + 1; // increment index to pass to drawPoint()

        var coords = drawPoint(1, index, planetTotal);
        var xPos = Math.round(coords[0]);
        var zPos = Math.round(coords[1]);
        var yPos = (startPos + (index * 2) / planetTotal) * -1;
        var pos = xPos/radiusDivider +' '+ yPos +' '+ yPos/radiusDivider;
        // console.log(pos);

        // create a new sphere element for each planet by copying the ones we setup in our initial var declarations
        var thisPlanetEl = planetEl.cloneNode(false);
        thisPlanetEl.setAttribute('id', planetName);
        thisPlanetEl.setAttribute('src', planets[planetName]);
        thisPlanetEl.setAttribute('position', pos);

        // add sound files to each planet.
        // we don't have sounds for the moon and sun
        if (planetName !== 'moon' && planetName !== 'sun') {
          thisPlanetEl.setAttribute('sound', 'src: url(https://rawgit.com/sirkitree/aframe-ephem/master/audio/' + planetName + '.wav); autoplay: true; loop: true; volume: .0100');
        }
        //console.log(planetEl);

        // each planet needs it's own parent element in which to apply their own rotations from center and
        // so that they can rotate independently of one another
        var thisPlanetParentEl = planetParentEl.cloneNode(false);
        thisPlanetParentEl.setAttribute('id', planetName +'-parent');
        
        // @todo: duration will need to be calculated
        // i.e. 28 days for the moon going 360-degrees, 1 year for sun, 18 months for Venus, 280+ years for Pluto, etc
        thisPlanetParentEl.setAttribute('animation', 'property: rotation; dir: normal; dur: '+ index +'0000; easing: linear; loop: true; to: 0 360 0');

        // append the planet to it's parent element
        thisPlanetParentEl.appendChild(thisPlanetEl);

        // append the planet parent to our main entity in the scene (<a-entity planets></a-entity>)
        sceneEl.appendChild(thisPlanetParentEl);
      }

      // example: updates the direction to normal instead of alternate (ex of changing animation attributes)
      // marsParent.setAttribute('animation', 'dir', 'normal');

      // Function to calculate a point on a radius.
      //   takes the radius, an index for the currentPoint, and the total number of points
      //   returns the x and z coordinates of this particular index on a point of the radius
      function drawPoint(r, currentPoint, totalPoints) {
        var theta = ((Math.PI*2) / totalPoints);
        var angle = (theta * currentPoint);
        var x = (100 * Math.cos(angle));
        var z = (100 * Math.sin(angle));
        return [x, z];
      }
  }
});
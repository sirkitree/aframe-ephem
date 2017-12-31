if (!AFRAME) {
  throw "AFRAME has not been loaded!";
}

AFRAME.registerComponent('planets', {
  init: function() {
    var sceneEl = this.el;
    
    // @todo: find a way to change this date in VR
    var date = {year: 1981, month: 10, day: 4, hours: 1, minutes: 52, seconds: 0};
    
    // variables that come from the ephemeris script
    // console.log('const', $const);
    // console.log('moshier', $moshier);
    
    $const.tlong = -71.10; // longitude
    $const.glat = 42.37; // latitude
    
    $processor.init();
    
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

    // create initial elements for copying later (more performant than creating multiples)
    var planetEl = document.createElement('a-sphere');
    planetEl.setAttribute('radius', planetRadius);
    // planetEl.setAttribute('dynamic-body', '');
    
    var planetTextEl = document.createElement('a-text');
    planetTextEl.setAttribute('value', 'position');
    
    var planetRingEl = document.createElement('a-entity');
    planetRingEl.setAttribute('static-body', '');
    
    var planetParentEl = document.createElement('a-sphere');
    planetParentEl.setAttribute('radius', planetRadius);
    planetParentEl.setAttribute('static-body', '');

    // loop through our planets object to create our elements and their properties
    for (const planetName in planets) {
      index = index + 1; // increment index to pass to drawPoint()
      
      var body = $moshier.body[planetName]; // each planet
      $processor.calc(date, body);

      var xPos = Math.cos(body.position.apparentLongitude);
      var yPos = ((startPos + (index * 2) / planetTotal) * -1);
      var zPos = Math.sin(body.position.apparentLongitude);
      
      var planetPos = xPos +' '+ (yPos) +' '+ zPos;
      var textPos = xPos +' '+ (yPos + .125) +' '+ zPos;
      var ringPos = '0 '+ (yPos - .125) +' 0';
      var parentPos = '0 '+ yPos +' 0';
      // console.log(pos);

    // --- Planets ---
      // create a new sphere element for each planet by copying the ones we setup in our initial var declarations
      var thisPlanetEl = planetEl.cloneNode(false);
      thisPlanetEl.setAttribute('id', planetName);
      thisPlanetEl.setAttribute('src', planets[planetName]);
      thisPlanetEl.setAttribute('position', planetPos);
      // thisPlanetEl.setAttribute('constraint', 'type: distance; target: #'+ planetName +'-parent; distance: 1;');
      // thisPlanetEl.setAttribute('sleepy', '');
      // add sound files to each planet.
      // we don't have sounds for the moon and sun
      if (planetName !== 'moon' && planetName !== 'sun') {
        thisPlanetEl.setAttribute('sound', 'src: url(https://rawgit.com/sirkitree/aframe-ephem/master/audio/' + planetName + '.wav); autoplay: true; loop: true; volume: .0100');
      }
      
    // --- Text ---
      var thisPlanetTextEl = planetTextEl.cloneNode(false);
      thisPlanetTextEl.setAttribute('id', planetName +'-text');
      thisPlanetTextEl.setAttribute('position', textPos);
      thisPlanetTextEl.setAttribute('value', planetName);
      thisPlanetTextEl.setAttribute('scale', '0.125 0.125 0.125');
      thisPlanetTextEl.setAttribute('look-at', '[camera]');

    // --- Rings ---
      // a ring for each planet 
      // @todo: add an extra one to go above the moon
      var thisPlanetRingEl = planetRingEl.cloneNode(false);
      thisPlanetRingEl.setAttribute('geometry', 'primitive: cylinder; radius: 1.1; height: 0.01');
      thisPlanetRingEl.setAttribute('rotation', '0 0 0');
      thisPlanetRingEl.setAttribute('id', planetName +'-ring');
      thisPlanetRingEl.setAttribute('position', ringPos);
      thisPlanetRingEl.setAttribute('material', 'visible: false');

    // --- Planet Parents ---
      // each planet needs it's own parent element to constrain to
      var thisPlanetParentEl = planetParentEl.cloneNode(false);
      thisPlanetParentEl.setAttribute('id', planetName +'-parent');
      thisPlanetParentEl.setAttribute('position', parentPos);
      thisPlanetParentEl.setAttribute('material', 'visible: false');

      // append the planet
      sceneEl.appendChild(thisPlanetEl);
      
      // append the planet text
      sceneEl.appendChild(thisPlanetTextEl);
      
      // append the ring
      sceneEl.appendChild(thisPlanetRingEl);

      // append the planet parent
      sceneEl.appendChild(thisPlanetParentEl);      
      
    }
    
    // as the dial is turned we need to increment or decrement the date value
    document.querySelector('#date-radial').addEventListener('change', function(e) {
      var value = e.detail.value;
      
      if (value > 0.002) {
        // increment
        changeDate('day', 1);
      }
      
      if (value < -0.002) {
        // decrement
        changeDate('day', -1);
      }
    });

    function changeDate(unit, value) {
      var radialTextEl = document.querySelector('#radialText');
      
      if (unit === 'day') {
        if (value > 0) {
          date.day = date.day + 1;
        } else {
          date.day = date.day - 1;
        }
      }
      
      // recalc each planets position with the new date
      for (const pName in planets) {
        var planet = document.querySelector('#'+ pName);
        var text = document.querySelector('#' + pName + '-text');
        
        var body = $moshier.body[pName]; // each planet
        $processor.calc(date, body);
        // console.log(date);
        
        var xPos = Math.cos(body.position.apparentLongitude);
        var yPos = planet.getAttribute('position').y;
        var zPos = Math.sin(body.position.apparentLongitude);
        
        planet.setAttribute('position', xPos +' '+ (yPos) +' '+ zPos);
        text.setAttribute('position', xPos + ' ' + (yPos + 0.125) + ' ' + zPos);
        
        var j = new JulianDate().julian(date.julian);        
        radialTextEl.setAttribute('value', j.getDate());
      }      
    }
    
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

    // example: updates the direction to normal instead of alternate (ex of changing animation attributes)
    // marsParent.setAttribute('animation', 'dir', 'normal');
  }
});
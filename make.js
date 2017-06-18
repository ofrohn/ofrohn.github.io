var shell = require('shelljs/make'),
    fs = require('fs');

echo('Copying d3-celestial');
  
cp('-f', [
  '../d3-celestial/celestial.js', 
  '../d3-celestial/celestial.min.js', 
  //'../d3-celestial/celestial.tar.gz',
  '../d3-celestial/readme.md', 
  '../d3-celestial/celestial.css'
], './');

cp('-f', '../d3-celestial/data/*', 'data');
cp('-f', '../d3-celestial/images/*', 'images');
cp('-f', '../d3-celestial/lib/*', 'lib');
cp('-f', '../d3-celestial/demo/*', 'celestial-demo');

mv('-f', 'readme.md', 'celestial-readme.md');

echo('Copying asteroid-families');

cp('-f', [
  '../asteroid-families/asteroids.js', 
  '../asteroid-families/asteroids.min.js', 
//  '../asteroid-families/asteroids.tar.gz',
  '../asteroid-families/readme.md', 
  '../asteroid-families/style.css',
  '../asteroid-families/viewer.html'
], './');

mv('-f', 'readme.md', 'asteroids-readme.md');
mv('-f', 'style.css', 'asteroids.css');
mv('-f', 'viewer.html', 'asteroids-viewer.html');

sed('-i', 'style.css', 'asteroids.css', 'asteroids-viewer.html');

cp('-f', '../asteroid-families/data/*', 'data');


echo('Copying d3-orrery');

cp('-f', [
  '../d3-orrery/orrery.js', 
  '../d3-orrery/orrery.min.js', 
//  '../d3-orrery/orrery.tar.gz',
  '../d3-orrery/readme.md', 
  '../d3-orrery/orrery.css',
  '../d3-orrery/viewer.html'
], './');

mv('-f', 'readme.md', 'orrery-readme.md');
mv('-f', 'viewer.html', 'orrery-viewer.html');

cp('-f', '../d3-orrery/data/*', 'data');
cp('-fR', '../d3-orrery/images/*', 'images');
cp('-f', '../d3-orrery/lib/*', 'lib');

//cp('-f', '../threex.planets/threex.planets.js', 'lib');

echo('Copying seh');

cp('-f', [
  '../seh/app.js', 
  '../seh/data.js', 
  '../seh/app-obs.js', 
  '../seh/data-obs.js', 
  '../seh/readme.md', 
  '../seh/seh.css',
  '../seh/diag.html'
], './');

mv('-f', 'readme.md', 'seh-doc/readme.md');

cp('-fR', '../seh/images/*', 'images');
cp('-fR', '../seh/doc/*', 'seh-doc');

echo('Done');

var shell = require('shelljs/make'),
    fs = require('fs');

echo('Copying d3-celestial');
  
cp('-f', [
  '../d3-celestial/celestial.js', 
  '../d3-celestial/celestial.min.js', 
  '../d3-celestial/celestial.tar.gz',
  '../d3-celestial/readme.md', 
  '../d3-celestial/celestial.css',
  '../d3-celestial/dtpick.png',
  '../d3-celestial/viewer.html',
  '../d3-celestial/sky.html'
], './');

mv('-f', 'readme.md', 'celestial-readme.md');
mv('-f', 'viewer.html', 'celestial-viewer.html');
mv('-f', 'sky.html', 'celestial-sky.html');

cp('-f', '../d3-celestial/data/*', 'data');
cp('-f', '../d3-celestial/lib/*', 'lib');

echo('Copying asteroid-families');

cp('-f', [
  '../asteroid-families/asteroids.js', 
  '../asteroid-families/asteroids.min.js', 
  '../asteroid-families/asteroids.tar.gz',
  '../asteroid-families/readme.md', 
  '../asteroid-families/style.css',
  '../asteroid-families/viewer.html'
], './');

mv('-f', 'readme.md', 'asteroids-readme.md');
mv('-f', 'style.css', 'asteroids.css');
mv('-f', 'viewer.html', 'asteroids-viewer.html');

sed('-i', 'style.css', 'asteroids.css', 'asteroids-viewer.html');

cp('-f', '../d3-orrery/data/*', 'data');
cp('-f', '../d3-orrery/img/*', 'img');
cp('-f', '../d3-orrery/lib/*', 'lib');

echo('Copying d3-orrery');

cp('-f', [
  '../d3-orrery/orrery.js', 
  '../d3-orrery/orrery.min.js', 
  '../d3-orrery/orrery.tar.gz',
  '../d3-orrery/readme.md', 
  '../d3-orrery/style.css',
  '../d3-orrery/viewer.html'
], './');

mv('-f', 'readme.md', 'orrery-readme.md');
mv('-f', 'style.css', 'orrery.css');
mv('-f', 'viewer.html', 'orrery-viewer.html');

sed('-i', 'style.css', 'orrery.css', 'orrery-viewer.html');

cp('-f', '../d3-orrery/data/*', 'data');


echo('Done');

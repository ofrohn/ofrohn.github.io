var shell = require('shelljs/make'),
    fs = require('fs');

echo('Copying d3-celestial');
  
cp('-f', [
  '../d3-celestial/celestial.js', 
  '../d3-celestial/celestial.min.js', 
  '../d3-celestial/celestial.tar.gz',
  '../d3-celestial/readme.md', 
  '../d3-celestial/style.css',
  '../d3-celestial/viewer.html'
], './');

mv('-f', 'readme.md', 'celestial-readme.md');
mv('-f', 'style.css', 'celestial-style.css');
mv('-f', 'viewer.html', 'celestial-viewer.html');

sed('-i', 'style.css', 'celestial-style.css', 'celestial-viewer.html');

cp('-f', '../d3-celestial/data/*', 'data');
cp('-f', '../d3-celestial/lib/*', 'lib');

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
mv('-f', 'style.css', 'orrery-style.css');
mv('-f', 'viewer.html', 'orrery-viewer.html');

sed('-i', 'style.css', 'orrery-style.css', 'orrery-viewer.html');

cp('-f', '../d3-orrery/data/*', 'data');
cp('-f', '../d3-orrery/img/*', 'img');
cp('-f', '../d3-orrery/lib/*', 'lib');

echo('Done');

var shell = require('shelljs/make'),
    fs = require('fs'),
    ga = "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-105720254-1', 'auto');ga('send', 'pageview');</script>";



echo('Copying d3-celestial');
  
cp('-f', [
  '../d3-celestial/celestial.js', 
  '../d3-celestial/celestial.min.js', 
  '../d3-celestial/readme.md', 
  '../d3-celestial/celestial.css'
], './');

cp('-f', '../d3-celestial/data/*', 'data');
cp('-f', '../d3-celestial/images/*', 'images');
cp('-f', '../d3-celestial/lib/*', 'lib');
cp('-f', '../d3-celestial/demo/*', 'celestial-demo');

mv('-f', 'readme.md', 'celestial-demo/readme.md');

echo('Copying asteroid-families');

cp('-f', [
  '../asteroid-families/asteroids.js', 
  '../asteroid-families/asteroids.min.js', 
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
  '../d3-orrery/readme.md', 
  '../d3-orrery/orrery.css',
  '../d3-orrery/viewer.html'
], './');

mv('-f', 'readme.md', 'orrery-readme.md');
mv('-f', 'viewer.html', 'orrery-viewer.html');

cp('-f', '../d3-orrery/data/*', 'data');
cp('-fR', '../d3-orrery/images/*', 'images');
cp('-f', '../d3-orrery/lib/*', 'lib');

echo('Copying threex.planets');

cp('-f', '../threex.planets/lib/threex.planets.js', 'lib');
cp('-f', '../threex.planets/lib/planetary.js', 'lib');
cp('-f', '../threex.planets/data/moons.js', 'data');
cp('-f', '../threex.planets/examples/*.*', 'threex-planets-demo');
sed('-i', '../images/', '../images/maps/', 'lib/threex.planets.js');

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

ls('*.html', 'celestial-demo/*.html', 'seh-doc/*.html', 'threex-planets-demo/*.html').forEach(function (file) {
  if (grep('UA-105720254-1', file).length > 1) return;
  sed('-i', '</body>', ga + '\n</body>', file);
});
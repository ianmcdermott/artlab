<h1>ARTLAB</h1>

<h2>Summary</h2>
ARTLAB is a collaborative animation app that also acts as a graphics-software teaching tool. Users are presented with a canvas to draw on and given instructions and guide elements that their drawing should adhere to. The guide elements are slightly different in every new canvas each user accesses, and once the art is submitted, it’s added to a sequence of images. Because of the different guide images, that sequence creates a semi-cohesive animation, with a different drawing each frame, but a chronological progression based on the guides and instructions they were given. 

![image of dashboard](https://github.com/ianmcdermott/artlab/blob/master/reference/screenshots/dashboard.png)

<!--<h2>Functionality</h2>
<p>This app's functionality includes:</p>
<ul>
	<li></li>
	<li></li>
	<li></li>
	<li></li>
	<li></li>
</ul>-->

<h2>Technology</h2>
<p>On the backend, ARTLAB utilizes a RESTful API, using Node.js. On the front end, all of the magic happens through the p5.js library!</p>
<h3>Front End</h3>
<ul>
	<li>HTML</li>
	<li>CSS</li>
	<li>JavaScript</li>
	<li>jQuery</li>
	<li>p5.js</li>
  <li>Bootstrap</li>
</ul>

<h3>Back End</h3>
<ul>
	<li>Node.js</li>
	<li>Express</li>
	<li>Mocha</li>
	<li>Chai</li>
	<li>Mongo</li>
	<li>Mongoose</li>
	<li>bcryptjs</li>
	<li>Passport</li>
</ul>

<h3>Programs</h3>
<ul>
	<li>Heroku</li>
	<li>TravisCI</li>
	<li>mLab</li>
</ul>

<h2>Working Prototype</h2>
<p>A working prototype of this app can be viewed at <a href="https://radiant-scrubland-40519.herokuapp.com/showcase.html">https://radiant-scrubland-40519.herokuapp.com/showcase.html</a></p>

<h2>Development</h2>
<p>Future updates will include:</p>
<ul>
	<li>Add additional drawing tools</li>
	<li>Add more animation guides for different subjects</li>
	<li>Add audio tools</li>
  <li>Add tools to remix existing artwork</li>
</ul>

<h2>Concept</h2>
ARLAB is centered around its drawing functionality, created with the p5.js library. The user-drawing portion of the app, found at canvas.html, is intended to emulate the tools found in Adobe Illustrator (currently only offering an emulation of the blob brush tool). The app as a whole is intended for educational purposes, by presenting a simplified version of a professional tool, providing a stress-free environment for learning a new technique. The user is presented with the task of making a simple drawing, allowing them to get a feel for the tools and shortcuts used in Illustrator without being intimidated by a large user interface or a massive task like creating a full-blown work of art. After drawing in this program a few times, the shortcuts and process will become intuitive for the user, and easily carried over to the professional Illustrator program. 

![update page](https://github.com/ianmcdermott/artlab/blob/master/reference/screenshots/canvas.png)

After submitting the artwork, the user is presented with the option of viewing their still artwork, in a gallery setting. Functionality is currently in the works to allow the user to click through all of their previously created works, but currently the art is loaded on page refreshes.

![image of gallery](https://github.com/ianmcdermott/artlab/blob/master/reference/screenshots/gallery.png)

Alternatively, the user can see the animation which their artwork has been absorbed into. The reason for having each user’s drawing be the frame of a greater animation, is two-fold. On a concrete level it creates a goal to work toward, providing motivation during the learning process. On a abstract and philosophical level, it allows the user to realize that they both are and have the potential to be a part of something greater than simply themselves, an idea that is reinforced through a positive, social collaboration. Could they rebel and not follow the provided guides? Yes, but in doing so they will still be connected to all of the other users by adding a little spice to the animation. 

![image of theatre](https://github.com/ianmcdermott/artlab/blob/master/reference/screenshots/showcase.png)

The images are created in a vector coordinate system, similar to an svg. Colors, coordinates, and radius are stored in an object within each artwork’s database object. This allows the images and drawing program to be infinitely scalable in a responsive web environment. It also allows potential for the data to be reworked, remixed and experimented with. For example, each user drawing could be merged into one still canvas, with colors and sizing changes to individual images. 

![image of timelapse](https://github.com/ianmcdermott/artlab/blob/master/reference/screenshots/timelapse-01.png)


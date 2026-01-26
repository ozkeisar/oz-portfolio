that is just fantastic, now we are gonna do some little brainstorming for the site we are gonna crerate. 

the purpose of the site is to flex a client cv and portfolio, we have its vc in /Users/ozkeisar/oz-portfolio/src/assets/OZ-KEISAR-CV.md and a very larg overview at /Users/ozkeisar/oz-portfolio/src/assets/Oz-Keisar-Professional-Summary.md

we will take our main focuse in the first file as it much more pointed but for complete info we can check the second file. 

so our goal is to create a fantastic page that will demonstrate the qulity of Oz as a programmer and team leader and more, we want a bit minimalistic design with our animation of user scrolling in the page when moving through the phases of the site, making the transitioning simmles while all transitioning and elements is being animated smoothly and gently. 

so lets start planing the site structure, we need to be focuse and not over complicated things, show the info correctly and with good taste. 

say if we the starting point where we can see the summery of Oz, the user could "scroll" in mobile (as probably not all the info could fit in small screen) and then the content will transform to the next section. but in pc where we do see al the content, the user will start scrolling and immediatly the element will start transitioning. 

for element transitioning we HAVE to use the flow like in /Users/ozkeisar/addit/addit-demos/src/demos/FullFlowDemo.tsx in the button at line 274 
the opacity and dynamic changing, read that and trully understand how that work, ALL element that transforming in the page and moving and all HAVE to use this technique. 
(write this down as absolute requierments in the /Users/ozkeisar/oz-portfolio/openspec/project.md before you making any changes and before starting the brainstorming, do NOT start filling the rest of the file or reading the rest of the openspec files)

after that lets start developing the arch of the site, what is the best way to build the component and what info gose where? how can we implement that both mobile and pc will have that stunning animation when component have different values (ALL have to dynamicly change according to screen size), what is the best ux to present the info for the relevant people will see this and leanr in the fastes way the most important info about Oz? how the element on the screen will move between phases as the user acroll? all that and more! let start. 
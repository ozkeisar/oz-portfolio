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

---

great work, now i wnat to change fandamentaly how the text and element entering and leaving the page (exept for the image component).
lets start by making that all text will be written, letter by letter, making the section to be written one by one, first the upper section then the next and so. 
for the exit animation, i thought of that each section will faid out moving horizantly to each direction, so the top section will move as one to the left and dissapear, the next section will move tothe right and so on. 

now for the actual flow itself, i want to do this, currently the "aniamtion" is being powered by the user scroll and positioning, so if he scroll a bit upward, the animation is being tracked precisly with the exact frame. but i want it to be more like a gameplay of animation + frame tracking, but combine them to be complete flow of animation perfectly.
so what do i mean? like we have the first animation in the start where the title is being animated (using svg), the user cant scroll until the animation is finished, then afterward, the scroll tracking is powering the frame changing. so i want it to be like this, the user first seeing the animated title and the complete intro -> start scrolling - that trigger the next animation of the -> iamge being moved to the next posiotion - sync with the intro elements disappearing - writing text start until complete (while this happening the app isnt responding to other scroll event until the animation finished + buffer) -> user continue to scroll -> the content of the page is "scrolling" a bit (animated up to revele content that isnt being shown becouse of small screen size, the "scroll" amout need to be calucalted from the screen size and the content size to see how much we need to scroll to the let the user see all the content in the section.) -> the exit animation is starting (not frame changing by scrolling but like a "video" that playing) and the next section entering (we will abjust the next section later). 
so by that, is the user scroll up again, the animation Will play backward, again with not letting the user trigger the scroll mechanisem that effect frame up until the animation done playing + buffer. 

is something not understanding to you? if so ask now.

---


great work, now we continuing to the next section, the Experiance, read openspec/project.md 
as we transformd the summery section to accept the image component, and redesigned it all to be more muture and info including, read the src/assets/Oz-Keisar-Professional-Summary.md and lets recreate the Experiance section. 

for that section we will want to make something really beutifull. first as we move to that section fro mthe summery, the image take place in the header animating the entery to the page -> first item in the timeline showing in the same manner the text in the summery section is written, fast and smooth. here the animation ends and the power gose to the user scroll frame tracking. 
as the user scroll more Down, the first item time line text - are being "backward written" and stop with the item titel (like the job name or something like that) and then being shrinked and stack upward, while the next item being start "writing" the full paragraph and the time line indicatore sync with its progress. 
when the user continue -> the next item also being "backward written" and shrink & push up to be stack below the first item. -> the next item start writtent. 

all this IS being controlled by the user acroll and not auto paly animation like the entrence itself. 

so first things that iportant to notced to them, no need for the fade out animation in the summery section, we have the "backward" writtening for the exit animation, and the image is contonuing to the next section. 

we will start from scratch the Experiance section, delete the current component, and start again, do not use any matirial from there. 

use the remotion skill for the planing and the animation, write that in the proposal as instruction for every read, to remaind you to read those skill again. 

now create /openspec:proposal experiance-section for that change. 
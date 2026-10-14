

Goal: Students build a one-page profile about a subject they like, using only what they learned in Phases 1-3.

Instructions to give them:
Create a new file study-corner.html in the same project folder. Open it with Live Server. Build a page that contains:

Boilerplate and head
<!DOCTYPE html>, lang, charset
A <title> with their own text
The tab icon (images/logo.svg)
Header
The logo <img> with alt, width and height
A <nav> with 3 links: Home (index.html), Planner (planner.html), Assistant (assistant.html)
Main content
One <h1> with the name of their favorite subject (Math, Football, Coding...)
A <p> introducing it, with a <br> to break the line
Inside that paragraph, one word in <b> and one in <i>
An <h2> “Why I like it”, followed by an unordered list with 3 reasons
An <h2> “How I study it”, followed by an ordered list with 3 steps
An <h2> “Words to know”, followed by a description list with 2 terms (<dt> and <dd>)
Links
One external link (for example, a Wikipedia page about their subject)
One internal link that jumps to the “How I study it” section, using href="#..." and a matching id
Footer
A “Back to top” link that jumps to the header (id="top")
A comment (<!-- ... -->) above each major part of the page

Bonus (fast finishers):

Add a second image of their own (a photo saved in images/) with a proper alt
Wrap the three lists in <section> tags, each with its own id
Add a title attribute to the external link

Self-check (students tick before showing you):

Every opening tag has its closing tag, in the right order
No id is used twice
Both lists use <li> for every item
The internal link actually scrolls to the right place
The alt text describes the image

Common mistakes to watch for while walking around:

href="features" without the #
External link without https://
Wrong image path (image/ instead of images/)
Text placed directly inside <ul> without <li>

Answer key idea for you: a short skeleton to check against: header (img + nav), main (h1, p, three sections each with an h2 and a list), footer (back to top). If someone is stuck for more than 5 minutes, have them start from the phase-03 checkpoint and copy the header from index.html.

Want me to write a ready-made solution file you can show on screen afterwards?
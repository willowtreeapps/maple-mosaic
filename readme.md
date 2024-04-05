## The Maple Mosaic
An in-office Lego wall where a pixel image is built by people over time using 16x16 baseplates and 2x2 bricks. The current wall exists as a 144x144-stud wall, separated into 81 16x16-stud sections. The wall uses 20 common Lego colors, but may expand in the future to add more colors. Since we're using 2x2 bricks, the wall supports a 72x72 pixel image.

## The Scripts Behind It
The scripts in this repo are used to create the image and instructions for the Maple Mosaic.

First, a Ruby script is used to take any ol' image and turn it into its closest Lego colors, using the 11 colors we've defined.

One important step here is to use a pixel color counter - e.g. https://townsean.github.io/canvas-pixel-color-counter/ - to check how many bricks you'll need. We currently have 1200 bricks per color available.

Next, a JavaScript script is used in Photoshop to parse the image into individual instruction sheets. These sheets can then be printed out 4 per page and set up at the mosaic wall.

To print sheets, you can use the "Multiple Images to PDF" chrome extension. Left and Top Margins set to 0, Fit pdf page to image size, and then use Preview to print 4 or 6 to a page.

## The Colors
Lego colors are _generally_ a fool's errand as there are differences in their hues, naming, etc. We're using hex codes from https://rebrickable.com/colors/ here. Our colors:

```
0  Black:               5,19,29         #05131D
1  Dark Bluish Gray:    108,110,104     #6C6E68 (Lego 'Dark Stone Grey')
2  Light Bluish Gray:   160,165,169     #A0A5A9 (Lego 'Medium Stone Grey')
3  White:               255,255,255     #FFFFFF
4  Red:                 201,26,9        #C91A09 (Lego 'Bright Red')
5  Yellow:              242,205,55      #F2CD37 (Lego 'Bright Yellow')
6  Green:               35,120,65       #237841 (Lego 'Dark Green')
7  Blue:                0,85,191        #0055BF (Lego 'Bright Blue')
8  Orange:              254,138,24      #FE8A18 (Lego 'Bright Orange')
9  Reddish Brown:       88,42,18        #582A12
10 Tan:                 228,205,158     #E4CD9E (Lego 'Brick Yellow')
11 Bright Pink:         228,173,200     #E4ADC8
12 Dark Blue:           10,52,99        #0A3463
13 Dark Pink:           200,112,160     #C870A0 (Lego 'Bright Purple')
14 Dark Purple:         63,54,145       #3F3691 (Lego 'Medium Lilac')
15 Dark Tan:            149,138,115     #958A73 (Lego 'Sand Yellow')
16 Lime:                187,233,11      #BBE90B (Lego 'Bright Yellowish Green')
17 Medium Azure:        54,174,191      #36AEBF
18 Medium Blue:         90,147,219      #5A93DB
19 Medium Nougat:       170,125,85      #AA7D55
```

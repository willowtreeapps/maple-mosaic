#target photoshop

// Modified by Derek Brameyer May 2022
// Originally created by Todd Webb
// October 2013
// for BrickFair LEGO Fan Expo

// CONST...
var bDEBUG = false;

var SEGMENTNAME    = 'Individual-Segments.psd';
var SEGMENT_TITLE  = 'Segment Title';
var LETTER_A       = 65;
var LETTER_B       = 66;
var LETTER_C       = 67;
var LETTER_D       = 68;
var LETTER_E       = 69;
var LETTER_F       = 70;
var LETTER_G       = 71;
var LETTER_H       = 72;
var LETTER_I       = 73;
var STUD_PIX       = 19;
var STUD_GAP       = 3;
var PIX_N_GAP      = STUD_PIX + STUD_GAP
// GLOBAL...
var BaseplatesW;
var BaseplatesH;
var PixelsX;
var PixelsY;
var FilePath;
var TxtTitle;
var TxtSubTitle;
var ORIG_DOC_NAME;
var TOT_BASEPLATES;
var SELECTION_SIZE = (PIX_N_GAP * 16) - STUD_GAP;

var OldDoc;
var exportOptions;
var FileName;
var NewDoc;
var iCountFile

// 11 Common RGB Colors...
// Altered from original (Lego colors are a fools errand...), new hex codes from:
// https://rebrickable.com/colors/
// 0  Black:      			5,19,29			#05131D
// 1  Dark Bluish Gray: 	108,110,104		#6C6E68 (Lego 'Dark Stone Grey')
// 2  Light Bluish Gray:	160,165,169		#A0A5A9 (Lego 'Medium Stone Grey')
// 3  White:      			255,255,255		#FFFFFF
// 4  Red:        			201,26,9		#C91A09 (Lego 'Bright Red')
// 5  Yellow:     			242,205,55		#F2CD37 (Lego 'Bright Yellow')
// 6  Green:      			35,120,65		#237841 (Lego 'Dark Green')
// 7  Blue:       			0,85,191		#0055BF (Lego 'Bright Blue')
// 8  Orange:     			254,138,24		#FE8A18 (Lego 'Bright Orange')
// 9  Reddish Brown:		88,42,18		#582A12
// 10 Tan:					228,205,158 	#E4CD9E (Lego 'Brick Yellow')
// 11 Bright Pink:         228,173,200     #E4ADC8
// 12 Dark Blue:           10,52,99        #0A3463
// 13 Dark Pink:           200,112,160     #C870A0 (Lego 'Bright Purple')
// 14 Dark Purple:         63,54,145       #3F3691 (Lego 'Medium Lilac')
// 15 Dark Tan:            149,138,115     #958A73 (Lego 'Sand Yellow')
// 16 Lime:                187,233,11      #BBE90B (Lego 'Bright Yellowish Green')
// 17 Medium Azure:        54,174,191      #36AEBF
// 18 Medium Blue:         90,147,219      #5A93DB
// 19 Medium Nougat:       170,125,85      #AA7D55

var BLACK = 0;
var DARKGRAY = 1;
var LIGHTGRAY = 2;
var WHITE = 3;
var RED = 4;
var YELLOW = 5;
var GREEN = 6;
var BLUE = 7;
var ORANGE = 8;
var BROWN = 9;
var TAN = 10;
var BRIGHT_PINK = 11;
var DARK_BLUE = 12;
var DARK_PINK = 13;
var DARK_PURPLE = 14;
var DARK_TAN = 15;
var LIME = 16;
var MEDIUM_AZURE = 17;
var MEDIUM_BLUE = 18;
var MEDIUM_NOUGAT = 19;

var ColorNames = Array(
	'Black',
	'Dark Bluish Gray',
	'Light Bluish Gray',
	'White',
	'Red',
	'Yellow',
	'Green',
	'Blue',
	'Orange',
	'Reddish Brown',
	'Tan',
	'Bright Pink',
	'Dark Blue',
	'Dark Pink',
	'Dark Purple',
	'Dark Tan',
	'Lime',
	'Medium Azure',
	'Medium Blue',
	'Medium Nougat'
);

var ColorCounts = Array(
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0
);

var ColorRGBs  = Array(
	'5,19,29',
	'108,110,104',
	'160,165,169',
	'255,255,255',
	'201,26,9',
	'242,205,55',
	'35,120,65',
	'0,85,191',
	'254,138,24',
	'88,42,18',
	'228,205,158',
	'228,173,200',
	'10,52,99',
	'200,112,160',
	'63,54,145',
	'149,138,115',
	'187,233,11',
	'54,174,191',
	'90,147,219',
	'170,125,85'
);

var ColumnLetters = Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I');
GoForIt();

function GoForIt() {
	if (!AgreeInstructions()) return;

	if (!EnsureStatus()) return;

	if (!ScaleUpImage()) return;

	if (!DrawGridLines()) return;

	if (!GatherMoreData()) return;

	if (!ParseItAll()) return;

	alert('DONE!');
}

function ParseItAll() {
	// VARS...
	var LABELS
	var testX;
	var testY;
	var pointSample;
	var rgb;
	var ColID;
	var ColMax;
	var HighPlate;
	var LowPlate;
	var LowLetter;
	var HighLetter;
	var ThisLetter;
	var sMsg;
	var sSubtitle;
	var BaseplateID;
	var NewLayr1;
	var NewGrp1;
	var YPos;
	var XPos;
	var Colmn;
	var roW;

	// CONFIRM DO WHOLE THING, OR JUST A TEST RUN?...
	if (bDEBUG) {
		HighPlate = 8;
		LowPlate = 7;
		if (HighPlate > TOT_BASEPLATES) {
			HighPlate = TOT_BASEPLATES;
			LowPlate = HighPlate - 1;
			if (LowPlate < 1) LowPlate = 1;
		}
		LowLetter  = LETTER_E;
		HighLetter = LETTER_H;
	} else {
		sMsg = 'Do Whole Thing?';
		sMsg += '\n\n(NO/Escape to do a small sample)';
		if (!confirm(sMsg)) {
			HighPlate = 4;
			if (HighPlate > TOT_BASEPLATES) HighPlate = TOT_BASEPLATES;
			LowPlate = 1;
			LowLetter  = LETTER_D;
			HighLetter = LETTER_F;
		} else {
			HighPlate = TOT_BASEPLATES;
			LowPlate = 1;
			LowLetter  = LETTER_A;
			HighLetter = LETTER_I;
		}
	}

	// FOCUS ORIGINAL FILE...
	app.activeDocument = OldDoc;

	// SAVE EACH BASEPLATE...
	Colmn = BaseplatesW;
	roW = BaseplatesH;
	iCountFile = 0;
	for (BaseplateID = HighPlate; BaseplateID >= LowPlate; BaseplateID--) {

		// CREATE A GROUP FOR THIS BASEPLATE...
		app.activeDocument = NewDoc;
		NewGrp1 = NewDoc.layerSets.add();
		NewGrp1.name = Colmn + '-' + roW + ' (' + BaseplateID + ')';

		// PLACE THE NEW GROUP AT THE TOP, BUT 3RD PLACE (UNDER SEGMENT TITLE + GRID LINES)...
		NewGrp1.move(NewDoc.artLayers[1], ElementPlacement.PLACEAFTER);

		// FOCUS ORIGINAL DOCUMENT...
		app.activeDocument = OldDoc;

		// RE-INITIATE PLATE TO STARTING POSITION ("A" TO "I")...
		ThisLetter = LowLetter;

		// SAVE EACH PLATE...
		while (ThisLetter <= HighLetter) {

			// NEW FILE NAME...
			// FileName = BaseplateID + '-' + String.fromCharCode(ThisLetter); // Unused?

			// Colmn =      Baseplate column index
			// roW =        Baseplate row index
			// ThisLetter = Baseplate "section" (A-C, then D-F, then G-I)

			// Convert Colmn & ThisLetter to [A-I]
			// 0 1 2 3 4 5 6 7 8
			// A B C D E F G H I
			// Colmn -- 1 = 0; 2 = 3; 3 = 6;
			// ThisLetter -- A = 0; B = 1; C = 2; D = 0; E = 1; F = 2; G = 0; H = 1; I = 2;
			// NewColumnLetter = (Colmn Map) + (ThisLetter Map)
			var columnAdder = (Colmn - 1) * 3;
			switch(ThisLetter) {
				case LETTER_A: case LETTER_D: case LETTER_G:
					columnAdder += 0;
					break;
				case LETTER_B: case LETTER_E: case LETTER_H:
					columnAdder += 1;
					break;
				case LETTER_C: case LETTER_F: case LETTER_I:
					columnAdder += 2;
					break;
				default:
					break;
			}
			var NewColumnLetter = ColumnLetters[columnAdder];

			// Convert roW & ThisLetter to [1-9]
			// TODO
			// 1 2 3 4 5 6 7 8 9
			// roW -- 1 = 1; 2 = 4; 3 = 7;
			// ThisLetter -- A = 0; B = 0; C = 0; D = 1; E = 1; F = 1; G = 2; H = 2; I = 2;
			var NewRowNumber = 1 + ((roW - 1) * 3);
			switch(ThisLetter) {
				case LETTER_A: case LETTER_B: case LETTER_C:
					NewRowNumber += 0;
					break;
				case LETTER_D: case LETTER_E: case LETTER_F:
					NewRowNumber += 1;
					break;
				case LETTER_G: case LETTER_H: case LETTER_I:
					NewRowNumber += 2;
					break;
				default:
					break;
			}

			// FileName = Colmn + '-' + roW + '-' + String.fromCharCode(ThisLetter);
			FileName = '' + NewColumnLetter + NewRowNumber;

			// SELECT SEGMENT...
			JumpToSegment(BaseplateID, ThisLetter);

			// COPY CONTENT TO THE CLIPBOARD...
			OldDoc.selection.copy();

			// ADD NEW LAYER TO NEW DOCUMENT, AND PASTE THE COPIED PLATE...
			app.activeDocument = NewDoc;
			NewLayr1 = NewGrp1.artLayers.add();
			NewLayr1.name = FileName;
			NewDoc.paste();

			// POSITION IT...
			XPos = NewLayr1.bounds[0].value;
			YPos = NewLayr1.bounds[1].value;
			XPos = (XPos * -1) + STUD_GAP;
			YPos = (YPos * -1) + STUD_GAP;
			NewLayr1.translate(XPos, YPos);


			if (false) {
				LABELS = NewDoc.layerSets['LABELS'];
			}

			// CLEAR COLOR COUNTS...
			for (var ppp = 0; ppp < ColorCounts.length; ppp++) {
				ColorCounts[ppp] = 0;
			}

			// CHECK EACH PIECE COLOR, COUNT COLORS...
			for (var yyy = 1; yyy <= 8; yyy++) {
				for (var xxx = 1; xxx <= 8; xxx++) {
					// Add a Color Sampler at a given x and y coordinate in the image.
					testX = (((xxx - 1) * PIX_N_GAP * 2) + 5);
					testY = (((yyy - 1) * PIX_N_GAP * 2) + 5);

					pointSample = NewDoc.colorSamplers.add([testX, testY]);

					// Obtain array of RGB values.
					rgb = [
						Math.round(pointSample.color.rgb.red),
						Math.round(pointSample.color.rgb.green),
						Math.round(pointSample.color.rgb.blue)
					];

					// Remove the Color Sampler.
					pointSample.remove();

					// COUNT THIS COLOR...
					for (var sss = 0; sss < ColorRGBs.length; sss++) {
						//alert(ColorNames[sss]);
						if (ColorRGBs[sss] == rgb) {
							ColorCounts[sss]++;
							break;
						}
					}
				}
			}

			if (false) {
				// DETERMINE MOST-USED COLOR...
				ColMax = 0;
				ColID = -1;
				//if (bDEBUG) var sMsg = 'COLOR COUNTS';
				for (var uuu = 0; uuu < ColorCounts.length; uuu++) {
					//if (bDEBUG) sMsg += '\r' + ColorCounts[uuu] + ' ' + ColorNames[uuu];
					if (ColorCounts[uuu] > ColMax) {
						ColMax = ColorCounts[uuu];
						ColID = uuu;
					}
				}
			}

			// LABEL COLOR ISSUES/CHALLENGES...
			sSubtitle = '';

			// CHECK DARK-vs-LIGHT GRAYS...
			if (ColorCounts[DARKGRAY] > 0) {
				if (ColorCounts[LIGHTGRAY] == 0) {
					sSubtitle += 'Dark gray, not light gray.'
				} else if (ColorCounts[DARKGRAY] > (ColorCounts[LIGHTGRAY] * 2)) {
					sSubtitle += 'Mostly dark gray, less light gray.'
				}
			}
			if (ColorCounts[LIGHTGRAY] > 0) {
				if (ColorCounts[DARKGRAY] == 0) {
					sSubtitle += 'Light gray, not dark gray.'
				} else if (ColorCounts[LIGHTGRAY] > (ColorCounts[DARKGRAY] * 2)) {
					sSubtitle += 'Mostly light gray, less dark gray.'
				}
			}

			// CHECK ORANGE-vs-BROWN...
			if (ColorCounts[ORANGE] > 0) {
				if (ColorCounts[BROWN] == 0) {
					if (sSubtitle != '') sSubtitle += '  ';
					sSubtitle += 'Orange, not brown.'
				} else if (ColorCounts[ORANGE] > (ColorCounts[BROWN] * 2)) {
					if (sSubtitle != '') sSubtitle += '  ';
					sSubtitle += 'Mostly orange, less brown.'
				}
			}
			if (ColorCounts[BROWN] > 0) {
				if (ColorCounts[ORANGE] == 0) {
					if (sSubtitle != '') sSubtitle += '  ';
					sSubtitle += 'Brown, not orange.'
				} else if (ColorCounts[BROWN] > (ColorCounts[ORANGE] * 2)) {
					if (sSubtitle != '') sSubtitle += '  ';
					sSubtitle += 'Mostly brown, less orange.'
				}
			}



			TxtSubTitle.contents = sSubtitle;
			//if (bDEBUG) {
			//	if (!confirm(sMsg)) return;
			//}

			// FILL TITLE...
			TxtTitle.contents = FileName;



			// EXPORT/SAVE THE NEW LAYER TO A NEW FILE...
			// try fail
			FileName = new File(FilePath + FileName + '.png');
			NewDoc.exportDocument(FileName, ExportType.SAVEFORWEB, exportOptions);
			iCountFile++;

			// MOVE NEW LAYER INTO ITS BASEPLATE GROUP...
			NewLayr1.move(NewGrp1, ElementPlacement.INSIDE);
			NewLayr1.visible = false;

			// BACK TO ORIGINAL DOCUMENT...
			activeDocument = OldDoc;

			// INCREMENT PLATE COUNT...
			ThisLetter = ThisLetter + 1;

		} // done with plate

		// COUNT DOWN Colmn AND roWs...
		if (Colmn == 1) {
			// BACK UP ONE ROW, START AT END OF ROW...
			roW--;
			Colmn = BaseplatesW
		} else {
			// JUST BACK ONE Colmn...
			Colmn--;
		}

	} // done with baseplate

	// YAY!
	activeDocument = NewDoc;
	TxtTitle.contents = 'DONE';
	TxtSubTitle.contents = ':)';
	app.bringToFront();

	// DONE!...
	str = 'Saved ' + iCountFile + ' instruction pages.';
	str += '\n\nYour original artwork file has been modified.  To keep your original artwork, close the file WITHOUT saving.';
	str += '\n\nA new Photoshop file, Individual-Segments.psd, is NOT saved.  Save it if you like, but you don\'t need it.';
	alert(str);

	return true;
}



function AgreeInstructions() {
	// VARS...
	var str = 'This script takes your image and parses it out into a LEGO mosaic, divided into 48x48 baseplates, and sub-divided into 16x16 plates, using 2x2 bricks.';
	str += '\n\nYou can use a converter like this one: https://elektrobild.org/photo-filter/lego-bricks/preset-sw5';
	str += '\n\nFIRST, open your image file in Photoshop, then run this script.';
	str += '\n\nYour file:';
	str += '\n\n* MUST be 24x24 pixels (or multiples of 24),';
	str += '\n\n* MUST be sized whereby ONE pixel = ONE 2x2 brick (ie: half size (ie: 24x24 pixels = a single 48x48 baseplate)),';
	str += '\n\n* MUST contain only ONE layer (no multi-layer Photoshop files),';
	str += '\n\n* Should be JPG, PNG or PSD (single-layer),';
	str += '\n\n* MUST be the only file currently open in Photoshop,';
	str += '\n\n* MUST have already been saved to disk (so we know where to save files), and';
	str += '\n\n* Should already be pixelated into LEGO colors; this code does not do that.';
	str += '\n\nPrevious "Instructions" folder (created by this script) MUST be deleted or emptied.';
	str += '\n\nCONTINUE?'
	if (!confirm(str)) return false;
	return true;
}



function EnsureStatus() {
	// VARS...
	var bDoc;
	var TheFolder;

	// PIXELS ONLY, PLEASE...
	preferences.rulerUnits = Units.PIXELS;

	// CLOSE ANY "SEGMENTED" DOCUMENT THAT MAY HAVE BEEN CREATED IN PREVIOUS ATTEMPTS...
	try {
		bDoc = app.documents.getByName(SEGMENTNAME);
	} catch(err) {
	} finally {
		if (bDoc) {
			if (!confirm('The segmented document already exists, and will be overwritten.')) {
				alert('Aborted');
				return false;
			}
		bDoc.close(SaveOptions.DONOTSAVECHANGES);
		}
	}

	// ENSURE ACTIVE DOCUMENT...
	if (app.documents.length == 0) {
		alert('You must open a document in Photoshop.');
		return false;
	}
	bDoc = app.activeDocument;
	ORIG_DOC_NAME = bDoc.name;

	// ENSURE HAS BEEN SAVED TO HARD DRIVE (SO WE CAN IDENTIFY THE LOCAL FOLDER)...
	if (!app.activeDocument.saved) {
		alert('Save art file first.\nThe art file has not yet been saved to disk.\n\nPlease save the original art file.  This is how I determined the "local folder" and where to save instruction images).');
		return false;
	}

	// ENSURE JUST ONE LAYER...
	if (bDoc.layerSets.length > 0) {
		alert('Image cannot contain grouped layers.  Must contain exactly 1 layer.');
		return false;
	}

	// ENSURE FOLDER EXISTS...
	FilePath = bDoc.path + '/Instructions/';
	TheFolder = new Folder(FilePath);
	if (!TheFolder.exists) {
		TheFolder.create();
	}
	if (!TheFolder.exists) {
		alert('Failed to create folder "' + TheFolder + '."\n\nYou can create it yourself and try again.');
		return false;
	}

	// ENSURE OLD INSTRUCTION SHEET IMAGES DON'T EXIST,
	// OTHERWISE WE'LL BE ASKED TO CONFIRM BEFORE OVERWRITING EVERY ONE OF THEM...
	// FileName = new File(FilePath + '1-1-A.png');
	FileName = new File(FilePath + 'A1.png');
	if (FileName.exists) {
		alert('I\'ve detected the file "1-1-A.png" already exists in the INSTRUCTIONS folder.  Perhaps more.  These must be deleted before proceeding.\nOtherwise you would have to sit there and confirm the overwriting of every file.');
		return false;
	}

	// GET IMAGE SIZE...
	PixelsX = bDoc.width;
	PixelsY = bDoc.height;

	PixelsX.convert('px'); /* now in pixels */
	PixelsY.convert('px'); /* now in pixels */

	// CLEAN OFF THE "PX"...
	str = ' ' + PixelsX;
	PixelsX = str.split(' px').join('') - 0;
	str = ' ' + PixelsY;
	PixelsY = str.split(' px').join('') - 0;

	// ENSURE SIZE DIVISIBLE BY 24...
	if (((PixelsX % 24) > 0) || ((PixelsY % 24) > 0)) {
		alert('Image is not correct size.  Both HEIGHT and WIDTH (pixels) must be divisible by 24.\n\nACTION CANCELED.');
		return false;
	}
	return true;
}



function ScaleUpImage() {
	// VARS...
	var fW;
	var fH;
	var xDoc;

	// CALCULATE FUTURE (AFTER SCALING UP) BASEPLATES...
	BaseplatesW = PixelsX / 24;
	BaseplatesH = PixelsY / 24;
	TOT_BASEPLATES = BaseplatesW * BaseplatesH;

	str = 'Your new image will be ' + BaseplatesW + ' x ' + BaseplatesH + ' baseplates, using 2x2 bricks.';
	if (bDEBUG) {
		str += '\n\n*** This script is in DEBUG mode, so although your original image will be resized, we are creating only one instruction sheet.  To exit debug mode, open this script in notepad and edit the bDEBUG variable to false. ***'
	}
	str += '\n\nCONTINUE?';
	if (!confirm(str)) return false;

	// GRAB DOC AND LAYER...
	xDoc = app.documents.getByName(ORIG_DOC_NAME);
	app.activeDocument = xDoc;

	// SIZE IMAGE...
	// these are our values for the END RESULT width and height (in pixels) of our image
	fW  = (PIX_N_GAP * 48 * BaseplatesW) + STUD_GAP;
	fH = (PIX_N_GAP * 48 * BaseplatesH) + STUD_GAP;

	// do the resizing.  if height > width (portrait-mode) resize based on height.  otherwise, resize based on width
	if (xDoc.height > xDoc.width) {
		xDoc.resizeImage(null, UnitValue(fH, 'px'), null, ResampleMethod.NEARESTNEIGHBOR);
	} else {
		xDoc.resizeImage(UnitValue(fW, 'px'), null, null, ResampleMethod.NEARESTNEIGHBOR);
	}

	// SUCCESS!...
	xDoc.selection.deselect();
	return true
}


function DrawGridLines() {
	app.bringToFront();

	// VARS...
	var FG1;
	var FG2;
	var colorRef;
	var cDoc;
	var valSel1;
	var NewLayr2;
	var PixY;
	var tempBox;
	var EIGHTH;
	var DOTTED_LINES = 'Dotted Lines';
	var NewGrp2;

	// CREATE A NEW PHOTOSHOP DOCUMENT TO STORE THE SECTIONS...
	cDoc = app.documents.add(SELECTION_SIZE + (STUD_GAP * 2), SELECTION_SIZE + (STUD_PIX * 3), 72, SEGMENTNAME, NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
	// UNLOCK THE DEFAULT BACKGROUND LAYER...
	FG2 = cDoc.artLayers[0];
	UnlockLayer(FG2);
	try {
		//FG2.remove(); // why doesn't this delete the useless layer? :(
	} catch(e) {
	}
	// DRAW NEW BACKGROUND...

	// ADD NEW BACKGROUND LAYER...
	NewLayr2 = cDoc.artLayers.add();
	NewLayr2.name = 'WHITE';
	// SET COLOR TO WHITE...
	colorRef = new SolidColor;
	colorRef.rgb.red   = 255;
	colorRef.rgb.green = 255;
	colorRef.rgb.blue  = 255;

	// SELECT ALL AND FILL WHOLE THING...
	valSel1 = [[0, 0], [cDoc.width, 0], [cDoc.width, cDoc.height], [0, cDoc.height]];
	cDoc.selection.select(valSel1, SelectionType.REPLACE, 0, false);
	cDoc.selection.fill(colorRef);

	// LOCK IT...
	NewLayr2.allLocked = true;

	// SET COLOR TO OFF-WHITE...
	colorRef.rgb.red   = 230;
	colorRef.rgb.green = 240;
	colorRef.rgb.blue  = 250;
	// SELECT JUST THE SQUARE BOX AND FILL IT...
	valSel1 = [[0, 0], [cDoc.width, 0], [cDoc.width, cDoc.width], [0, cDoc.width]];
	cDoc.selection.select(valSel1, SelectionType.REPLACE, 0, false);
	//cDoc.selection.fill(colorRef);


	// ADD TEXT (TITLE) LAYER TO THIS DOCUMENT...

	// CREATE TEXT LAYER AT THE FRONT...
	NewLayr2 = cDoc.artLayers.add();
	NewLayr2.kind = LayerKind.TEXT;
	NewLayr2.name = SEGMENT_TITLE;

	// MOVE TO FRONT OF THE CLASS...
	NewLayr2.move(cDoc.artLayers[1], ElementPlacement.PLACEBEFORE);

	// REMEMBER IT, SO WE CAN EDIT TEXT LATER...
	TxtTitle = NewLayr2.textItem;

	// SET COLOR TO BLACK...
	colorRef.rgb.red   = 0;
	colorRef.rgb.green = 0;
	colorRef.rgb.blue  = 0;

	// POSITION TEXT...
	TxtTitle.kind = TextType.PARAGRAPHTEXT;
	TxtTitle.width= cDoc.width;
	TxtTitle.justification = Justification.LEFT;
	TxtTitle.font = 'Tahoma';
	TxtTitle.size = STUD_PIX * 2;
	if (TxtTitle.size < 10) TxtTitle.size = 10;
	TxtTitle.height = TxtTitle.size;
	TxtTitle.fauxBold = true;
	TxtTitle.contents = 'Starting...';
	TxtTitle.color = colorRef;
	TxtTitle.position = Array(0, cDoc.height - Math.round(STUD_PIX * 1.7));

	// ADD TEXT (SUBTITLE)...

	// CREATE TEXT LAYER AT THE FRONT...
	NewLayr2 = cDoc.artLayers.add();
	NewLayr2.kind = LayerKind.TEXT;
	NewLayr2.name = 'Subtitle';

	// MOVE TO FRONT OF THE CLASS...
	NewLayr2.move(cDoc.artLayers[1], ElementPlacement.PLACEBEFORE);

	// REMEMBER IT, SO WE CAN EDIT TEXT LATER...
	TxtSubTitle = NewLayr2.textItem;

	// SET COLOR TO GRAY...
	colorRef.rgb.red   = 103;
	colorRef.rgb.green = 103;
	colorRef.rgb.blue  = 103;

	// POSITION TEXT...
	TxtSubTitle.kind = TextType.PARAGRAPHTEXT;
	TxtSubTitle.width= cDoc.width - (PIX_N_GAP * 5);
	TxtSubTitle.justification = Justification.LEFT;
	TxtSubTitle.font = 'Tahoma';
	TxtSubTitle.size = Math.round(STUD_PIX * .8);
	if (TxtSubTitle.size < 8) TxtSubTitle.size = 8;
	TxtSubTitle.height = TxtSubTitle.size * 3;
	TxtSubTitle.fauxBold = true;
	TxtSubTitle.color = colorRef;
	TxtSubTitle.position = Array((PIX_N_GAP * 5), cDoc.height - Math.round(STUD_PIX * 2.5));

	if (false) {
		// NEW LABEL GROUP...
		NewGrp2 = cDoc.layerSets.add();
		NewGrp2.name = 'LABELS';

		// PLACE THE NEW GROUP AT THE VERY TOP...
		NewGrp2.move(cDoc.artLayers[0], ElementPlacement.PLACEBEFORE);

		// ADD TEXT (LABELS) LAYERS...
		EIGHTH = Math.round(cDoc.width / 8);
		for (var yyy = 1; yyy <= 8; yyy++) {
			for (var xxx = 1; xxx <= 8; xxx++) {

				// CREATE TEXT LAYER AT THE FRONT...
				NewLayr2 = NewGrp2.artLayers.add();
				NewLayr2.kind = LayerKind.TEXT;
				NewLayr2.name = 'ColLbl_' + xxx + '_' + yyy;

				// REMEMBER IT, SO WE CAN EDIT TEXT LATER...
				tempBox = NewLayr2.textItem;

				// SET COLOR TO BLACK...
				colorRef.rgb.red   = 0;
				colorRef.rgb.green = 0;
				colorRef.rgb.blue  = 0;

				// POSITION TEXT...
				tempBox.kind = TextType.PARAGRAPHTEXT;
				tempBox.width= Math.round(cDoc.width / 8);
				tempBox.justification = Justification.CENTER;
				tempBox.position = Array(EIGHTH * (xxx - 1), (EIGHTH * (yyy - 1)) + 5);
				tempBox.font = 'Tahoma';
				tempBox.size = 8;
				tempBox.height = Math.round(STUD_PIX * 2);
				tempBox.fauxBold = true;
				tempBox.contents = '*';
				tempBox.color = colorRef;

			}
		}
	}

	// DRAW NEW GRIDLINES (WILL COVER THE EXCESS PIXELS NOT SHOWN, WHICH BECOME THE GAP)...

	// CREATE A GROUP FOR THE CHECKERED FOREGROUND...
	FG1 = cDoc.layerSets.add();
	FG1.name = 'FG1';

	// CREATE NEW LAYER FOR THE GRID...
	NewLayr2 = cDoc.artLayers.add();
	NewLayr2.name = DOTTED_LINES;
	NewLayr2.move(FG1, ElementPlacement.INSIDE);
	activeLayer = NewLayr2;

	// SET COLOR TO LIME...
	colorRef.rgb.red   = 153;
	colorRef.rgb.green = 255;
	colorRef.rgb.blue  = 51;

	// DRAW ONE ROW OF GAP...
	valSel1 = [[0, 0], [cDoc.width, 0], [cDoc.width, STUD_GAP], [0, STUD_GAP]];
	cDoc.selection.select(valSel1, SelectionType.REPLACE, 0, false);

	// FILL IT...
	cDoc.selection.fill(colorRef);
	cDoc.selection.deselect();

	// DUPLICATE THAT ROW FOR EACH ROW...
	PixY = 1;
	while (PixY <= ((16 * PIX_N_GAP))) {
		// DUPLICATE THAT ROW...
		NewLayr2 = NewLayr2.duplicate();

		// SLIDE DOWN...
		NewLayr2.translate(0, PIX_N_GAP * 2);

		// NEXT...
		PixY = PixY + (PIX_N_GAP * 2);
	}

	// DUPLICATE GROUP, AND ROTATE...
	FG2 = FG1.duplicate();
	FG2.name = 'FG2';
	FG2.rotate(90);

	// MERGE THEM
	// (INTO 1 COMPLETE BASEPLATE BORDER)...
	FG2 = FG2.merge();
	FG2.move(FG1, ElementPlacement.INSIDE);

	// FINAL MERGE OF GRID...
	FG1 = FG1.merge();
	FG1.name = DOTTED_LINES;

	// MOVE TO THE MIDDLE OF THE CLASS...
	FG1.move(cDoc.artLayers[1], ElementPlacement.PLACEAFTER);

	// SAVE TO FILE...
	// well, should we?

	// DONE...
	cDoc.selection.deselect();
	app.bringToFront();

	return true;
}


function GatherMoreData() {
	// SAVE OPTIONS (REMAIN SAME FOR EACH IMAGE)...
	exportOptions = new ExportOptionsSaveForWeb();
	exportOptions.format = SaveDocumentType.PNG;
	exportOptions.PNG8 = false;
	exportOptions.transparency = true;
	exportOptions.optimized = true;

	// GRAB ORIGINAL FILE...
	OldDoc = app.documents.getByName(ORIG_DOC_NAME);
	NewDoc = app.documents.getByName(SEGMENTNAME);

	return true;
}


function JumpToSegment(inBaseplateID, inPlateID) {
	// VARS...
	var NewX;
	var NewY;
	var valSel2;

	//alert('Baseplate: ' + inBaseplateID + '\n\nPlate: ' + String.fromCharCode(inPlateID) + '\n\nSELECTION_SIZE: ' + SELECTION_SIZE + '\n\nBaseplatesW: ' + BaseplatesW + '\nBaseplatesH: ' + BaseplatesH);

	// COUNT ACROSS BASEPLATES (X-AXIS)...
	NewX = ((inBaseplateID - 1) % BaseplatesW);
	//alert('NewX = ' + NewX);
	NewX = NewX * (SELECTION_SIZE + STUD_GAP) * 3;
	//alert('NewX = ' + NewX);
	NewX = NewX + STUD_GAP;
	//alert('NewX = ' + NewX);
	// COUNT ACROSS FURTHER FOR PLATES (X-AXIS)...
	NewX = NewX + (((inPlateID - LETTER_A) % 3) * (SELECTION_SIZE + STUD_GAP));

	// COUNT DOWN BASEPLATES (Y-AXIS)...
	NewY = Math.floor((inBaseplateID - 1) / BaseplatesW);
	//alert('NewY = ' + NewY);
	NewY = Math.floor(NewY * (SELECTION_SIZE + STUD_GAP) * 3);
	//alert('NewY = ' + NewY);
	// COUNT DOWN FURTHER FOR PLATES (Y-AXIS)...
	NewY = NewY + Math.floor((inPlateID - LETTER_A) / 3) * (SELECTION_SIZE + STUD_GAP);
	NewY = NewY + STUD_GAP;

	//alert('Highlighting: ' + NewX + ' - ' + NewY + ' to ' + (NewX - 0 + SELECTION_SIZE) + ' - ' + (NewY - 0 + SELECTION_SIZE));

	// MOVE IT...
	valSel2 = [[NewX, NewY], [NewX + SELECTION_SIZE, NewY], [NewX + SELECTION_SIZE, NewY + SELECTION_SIZE], [NewX, NewY + SELECTION_SIZE]];
	app.activeDocument.selection.select(valSel2, SelectionType.REPLACE, 0, false);
}

function UnlockLayer(inLayer) {
	if (inLayer.isBackgroundLayer) inLayer.name = 'Background';
	if (inLayer.allLocked) inLayer.allLocked = false;
	if (inLayer.pixelsLocked) inLayer.pixelsLocked = false;
	if (inLayer.positionLocked) inLayer.positionLocked = false;
	if (inLayer.transparentPixelsLocked) inLayer.transparentPixelsLocked = false;
}


function MoveLayerTo(fLayer, fX, fY) {
	var Position = fLayer.bounds;
	Position[0] = fX - Position[0];
	Position[1] = fY - Position[1];
	fLayer.translate(-Position[0], -Position[1]);
}


function ListObjAttributes(inObj, inMatchStr, inMax) {
	// VARS...
	var s = '';
	var c = 0;
	var att;
	var v;
	var MAX = 8;
	if (inMax == undefined) inMax = MAX;
	if (inMax < 1) inMax = MAX;
	if (inMatchStr != undefined) inMatchStr = inMatchStr.toLowerCase();

	// GET IT...
	if (typeof(inObj) == 'string') inObj = document.getElementById(inObj);
	if (!inObj) {
		alert('What object to list attributes?: ' + inObj);
		return;
	}

	for(att in inObj) {
		if (inObj[att] != null) {
			v = String(inObj[att]).toLowerCase();
			if ((inMatchStr == null) || (v.indexOf(inMatchStr) >= 0) || (att.indexOf(inMatchStr) >= 0)) {
				s = s + att + ' = ' + v + '\n';
				c = c + 1;
			}
		}
		if (c == inMax) {
			s = 'ATTRIBUTES of ' + inObj.tagName + ':\nID: ' + inObj.id + '\nNAME: ' + inObj.name + '\n\n' + s;
			if (!confirm(s)) { return; }
			s = '';
			c = 0;
		}
	}
	if (s != '') {
		s = 'ATTRIBUTES:\nID: ' + inObj.id + '\nName: ' + inObj.name + ' (' + inObj.tagName + ')\n\n' + s;
		alert(s);
	}
}

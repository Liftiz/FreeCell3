// VARIABLES
var gAudioCtx = new (window.AudioContext || window.webkitAudioContext)();

// GAME SETUP
{
    // SETUP: Table backgrounds
    var gGameTableBkgds = {};
    gGameTableBkgds.pattern = { url:'images/table_pattern.jpg' };
    gGameTableBkgds.circles = { url:'images/table_circles.jpg' };
    gGameTableBkgds.felt    = { url:'images/table_felt.jpg'    };
    gGameTableBkgds.plain   = { url:'images/table_plain.png'   };

    // SETUP: Game Options / Defaults
    var gGameOpts = {};
    gGameOpts.allowFounReuse = false;
    gGameOpts.cheatUnlimOpen = false;
    gGameOpts.debugOneLeft   = false;
    gGameOpts.showTips       = true;
    gGameOpts.sound          = true;
    gGameOpts.tableBkgdUrl   = gGameTableBkgds.pattern.url;

    // SETUP: Define / Start async load of sounds files
    // NOTE: iOS (as of iOS9) is unable to play ogg files, so we are using MP3 for everything
    var gGameSounds = {};
    gGameSounds.cardFlip    = { buffer:null, url:'sounds/cardFlip.mp3',    src:'freesound.org/people/f4ngy/sounds/240776/'    };
    gGameSounds.cardShuffle = { buffer:null, url:'sounds/cardShuffle.mp3', src:'freesound.org/people/deathpie/sounds/19245/'  };
    gGameSounds.crowdCheer  = { buffer:null, url:'sounds/crowdCheer.mp3',  src:'soundbible.com/1700-5-Sec-Crowd-Cheer.html'   };
    gGameSounds.sadTrombone = { buffer:null, url:'sounds/sadTrombone.mp3', src:'freesound.org/people/Benboncan/sounds/73581/' };
}

// ==============================================================================================


    // ------------------------------------------------------------------------

    // STEP 1: VFX/SFX update
    if (gGameOpts.sound) playSound(gGameSounds.cardFlip);



function handleOpenDrop(event, ui, drop) {
    // -------------------------------------------

    // RULE 1: Was only a single card provided?
    if ( ui.helper.children().length != 1 ) {
        if ( gGameOpts.showTips ) null; // TODO
        return false;
    }

    // -------------------------------------------

    // STEP 1: VFX/SFX update



    // STEP 1: VFX/SFX update
    if (gGameOpts.sound) playSound(gGameSounds.cardFlip);



    // STEP 3: Shorten fanning padding if card stack grows too large
    // TODO: measure #playArea and length of children
}

function handleCardDblClick(card) {
    // RULE 1: Only topmost card can be double-clicked


    // STEP 1: Where are we?
    switch ( $(card).parent().parent().prop('id') ) {
    

            
    }

    // TODO: more!!!

}

// ==============================================================================================

function handleStartBtn() {
    // STEP 1:
    $('#dialogStart').dialog('close');
    window.location.href = "level.html";
    // STEP 2: iOS requires a touch event before any type of audio can be played, then everything will work as normal
    // SOLN: A: play a dummy sound (https://paulbakaus.com/tutorials/html5/web-audio-on-ios/)
    // ....: B: play a real startup sound when applicable (this is our case)
    if (gGameOpts.sound) playSound(gGameSounds.cardShuffle);


}

function handleMenuBtn() {
    $('#dialogMenu').dialog('open');
    $('#dialogMenu button').blur();
}

function handleOptionsNewGame() {
    // STEP 1: UX/UI Update
    if (gGameOpts.sound) playSound(gGameSounds.sadTrombone);

    // STEP 2: Close dialog
    $('#dialogMenu').dialog('close');

    // STEP 3: Clear/Fill board
    doFillBoard();
}

function handleOptionsOpen() {
    // STEP 1: Update UI options
    $('#chkOptSound').prop('checked', gGameOpts.sound);

    // LAST: Open dialog
    $('#dialogOptions').dialog('open');
}

function handleOptionsClose() {
    // STEP 1: Update game options
    gGameOpts.sound = $('#chkOptSound').prop('checked');

    // STEP 2: Set background
    var strBkgdUrl = $('input[type="radio"][name="radBkgd"]:checked').data('url');
    if ( strBkgdUrl ) $('body').css('background', 'url("'+ strBkgdUrl +'")');

    // LAST: Close dialog
    $('#dialogOptions').dialog('close');
}

function playSound(objSound) {
    // SRC: http://www.html5rocks.com/en/tutorials/webaudio/intro/

    // STEP 1: Reality Check
    if ( !objSound.buffer ) {
        console.warn('WARN: No buffer exists for: '+objSound.url);
        console.log(objSound.buffer);
        return;
    }

    // STEP 2: Create new bufferSource with existing file buffer and play sound
    var source = gAudioCtx.createBufferSource();
    source.buffer = objSound.buffer;
    source.connect(gAudioCtx.destination);
    (source.start) ? source.start(0) : source.noteOn(0);
}

// ==============================================================================================

function cascHelper() {
    // A: Build container and fill with cards selected
    var container = $('<div/>').attr('id', 'draggingContainer').addClass('cardCont');
    container.css( 'position', 'absolute' );
    container.css( 'z-index', '100' );
    container.css( 'top' , $(this).offset().top +'px' );
    container.css( 'left', $(this).offset().left+'px' );
    container.append( $(this).clone() );
    container.append( $(this).nextAll('.card').clone() );

    // B: Hide original cards
    $(this).css('visibility','hidden'); // IMPORTANT: Dont hide() this or container jumps to {0,0} (jQuery must be using .next or whataver)
    $(this).find('span').css('visibility','hidden'); // IMPORTANT: the cool cards we use have spans that must be set on their own
    $(this).nextAll().hide();

    // C: "Cascade" cards in container to match orig style
    // REQD! We have to do this as we use negative margins to stack cards above, else they'll go up in this container and look all doofy
    container.find('div.card').each(function(i,ele){ $(this).css('position', 'absolute').css('top', (i*CARD_OFFSET)+'px'); });

    // LAST:
    return container;
}





function appStart() {
    // STEP 3: jQuery Dialog setup
    $('#dialogStart').dialog({
        modal: true,
        autoOpen: true,
        draggable: false,
        resizable: false,
        dialogClass: 'dialogCool',
        closeOnEscape: false,
        height: ( $(window).innerWidth() < 1080 ? 300 : 330 ),
        width:  ( $(window).innerWidth() * ( $(window).innerWidth() < 1080 ? 0.9 : 0.8 ) )
    });
    $('#dialogMenu').dialog({
        modal: true,
        autoOpen: false,
        draggable: false,
        resizable: false,
        dialogClass: 'dialogCool',
        closeOnEscape: true,
        width: ( $(window).innerWidth() * ( $(window).innerWidth() < 1080 ? 0.5 : 0.4 ) )
    });
    $('#dialogOptions').dialog({
        modal: true,
        autoOpen: false,
        draggable: false,
        resizable: false,
        dialogClass: 'dialogCool',
        closeOnEscape: true,
        width: ( $(window).innerWidth() * ( $(window).innerWidth() < 1080 ? 0.5 : 0.3 ) )
    });


    // STEP 5: Web-Audio for iOS
    $(document).on('touchstart', '#btnStart', function(){
        // A: Create and play a dummy sound to init sound in iOS
        // NOTE: iOS (iOS8+) mutes all sounds until a touch is detected (good on you Apple!), so we have to do this little thing here
        var buffer = gAudioCtx.createBuffer(1, 1, 22050); // create empty buffer
        var source = gAudioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(gAudioCtx.destination); // connect to output (your speakers)
        (source.start) ? source.start(0) : source.noteOn(0);

        // B: Start game
        handleStartBtn();
    });

    // STEP 6: OPTIONS: Show available backgrounds
    $.each(gGameTableBkgds, function(i,obj){
        var strHtml = '<div>'
                    + '  <div><input id="radBkgd'+i+'" name="radBkgd" type="radio" data-url="'+ obj.url +'" '
                    + (gGameOpts.tableBkgdUrl == obj.url ? ' checked="checked"' : '') + '></div>'
                    + '  <div><label for="radBkgd'+i+'"><div style="background:url(\''+ obj.url +'\'); width:100%; height:60px;"></div></div>'
                    + '</div>';

        $('#optBkgds').append( strHtml );
    });
}

// ==============================================================================================
$(document).ready(function(){ appStart(); })
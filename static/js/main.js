/*
	Strongly Typed by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/
function formSend() {
    var formData = new FormData();

    // Image, Version 선택
    const content = document.getElementById('file-1').files[0];
    const style = document.getElementById('file-2').files[0];
	const range = document.getElementById("range").value;

	if(content == null){
		alert("Input the Content Image");
		return;
	}
	else if(style == null){
		alert("Input the Style Image");
		return;
	}

	document.getElementsByClassName('button')[1].style.display = "none";
	document.getElementsByClassName('loading')[0].style.display = "block";


    formData.append("content", content);
	formData.append("style", style);
	formData.append("range", range);
	
    fetch(
        '/combine',
        {
            method: 'POST',
            body: formData,
        }
    )
    .then(response => {
        if ( response.status == 200){
            return response
        }
        else{
            throw Error("Neural error")
        }
    })
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob))
    .then(imageURL => {
    	document.getElementsByClassName('button')[1].style.display = "block";
		document.getElementsByClassName('loading')[0].style.display = "none";

        document.getElementById("results").setAttribute("src", imageURL);
    })
    .catch(e =>{
    })
}

function setThumbnail(event, id) {
    var reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById(id).setAttribute("src", event.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
}



'use strict';

;( function ( document, window, index )
{
	var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
		});

		// Firefox bug fix
		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
	});
}( document, window, 0 ));


(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			mode: 'fade',
			noOpenerFade: true,
			hoverDelay: 150,
			hideDelay: 350
		});

	// Nav.

		// Title Bar.
			$(
				'<div id="titleBar">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

})(jQuery);

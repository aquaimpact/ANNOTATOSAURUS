$(document).ready(function() {
	//$('#options').on('submit', function(event) {
		
	//	$.ajax({
			
	//		data : {
 //               register_input: $("#filename").val(),
 //               filedata: 
	//		},

	//		type : 'POST',
	//		url : '/download'
	//	})
	//	.done(function(data) {

	//		if (data.error) {
	//			document.getElementById('output').innerHTML = data.error
	//		}
	//		else {
	//			//document.getElementById('output').value = data.answer
	//			document.getElementById('output').innerHTML = data.answer
	//		}
	//	});

	//	event.preventDefault();

	//});

    //$('#options').on('submit', function (event) {

    //    $.ajax({

    //        data: {
    //            register_input: $("#filename").val(),
    //            filedata: filess,
    //        },

    //        type: 'POST',
    //        url: '/download'
    //    })
    //        .done(function (data) {

    //            if (data.error) {
    //                document.getElementById('output').innerHTML = data.error
    //            }
    //            else {
    //                //document.getElementById('output').value = data.answer
    //                document.getElementById('output').innerHTML = data.answer
    //            }
    //        });

    //    event.preventDefault();

    //})

/*	$('#exportform').on('submit', function(event) {
		$.ajax({
			data : {
				export_input : $("#exportinput").val()
			},

			type : 'POST',
			url : '/export'
		})
		.done(function(data) {

			if (data.error) {
				$('#errorAlert').text(data.error).show();
			}
			else {
				$('#errorAlert').hide();
				alert('Export Successful')
			}
		});

		event.preventDefault();

	});*/

});

/*	$('#displayattention').on('submit', function(event) {
		$.ajax({
			data : {
				attention_sent1 : $('#attention_sent1').val(),
				attention_sent2 : $('#attention_sent2').val()
			},
			type : 'POST',
			url : '/processatt'
		})
		.done(function(data) {

			if (data.error) {
				$('#errorAlert').text(data.error).show();
				//$('#successAlert').hide();
			}
			else {
				$('#errorAlert').hide();
				//$('#show_attention').text(data.answer).show();
				document.getElementById('vis').innerHTML = data.answer;	
			}
		});

		event.preventDefault();

	});*/

/*	$('#questionanswer').on('submit', function(event) {
		$.ajax({
			data : {
				language: $('#language').val(),
				context : $('#context').val(),
				query : $('#query').val()
			},
			type : 'POST',
			url : '/processqa'
		})
		.done(function(data) {

			if (data.error) {
				$('#errorAlert').text(data.error).show();
				//$('#successAlert').hide();
			}
			else {
				$('#errorAlert').hide();
				//$('#output').text(data.answer).show();
				$('output').delay(1000);
				document.getElementById('output').value=data.answer;
			}

		});

		event.preventDefault();

	});*/


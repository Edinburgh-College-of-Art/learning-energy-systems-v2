// CONSTANTS //

// GLOBAL VARS //
var questionData;

var yAxis = { xMax: 0, xMin: 0, yMax: 0, yMin: 0};
var xAxis = { xMax: 0, xMin: 0, yMax: 0, yMin: 0};

// **** APP START **** //
setupListeners();
getQuestions();

function setupListeners()
{
	$('.addButton').click(function(event) {
		event.preventDefault();

		// check q AND a
		var question = $.trim($("#questionTextArea").val());
		var answer = $.trim($("#answerTextArea").val());
		var questionID;
		if ( (question === "") || (answer === "") )
		{
			alert("Don't forget both the question and the answer");
			return;
		}
		// send
		$.ajax({
			url: 'http://www.learningenergy.eca.ed.ac.uk/backend/app_questions/add',
			type: 'POST',
			dataType: 'json',
			data: {school_id: 5, question: question, answer: answer}
		})
		.done(function(e) {
			questionID = e.data.id;
			questionData.push({'id':questionID, 'question': question, 'answer': answer, 'app_school_id': 0});

			var numElements = $('#questionsWrapper').find('span.questionRow').length;
			$('#questionsWrapper').append("<span class='questionRow'><span class='qNumber'>"+(numElements+1)+"</span><span class='questionText'>"+question+"</span><img class='deleteButton' questionID="+questionID+" src='img/deleteButton.png' alt='delete question' height='20px' width='20px' /><p questionID="+questionID+" class='revealButton'>Reveal Answer</p></span");
			$('.revealButton').last().click(function(event)
			{
				var questionID = $(event.currentTarget).attr('questionid');

				if($(event.currentTarget).text() === "Reveal Answer")
				{
					var theAnswer;
					$(event.currentTarget).text("Hide Answer"); // change the button
					for(var i=0;i<questionData.length; i++)
					{
						if(questionData[i].id === +questionID)
						{
							theAnswer = questionData[i].answer;
						}
					}
					if($(event.currentTarget).parent().find('hr').length > 0)
					{
						$(event.currentTarget).parent().find('hr').last().before("<p class='answer'>"+theAnswer+"</p>");
					}
					else
					{
						$(event.currentTarget).parent().append("<p class='answer'>"+theAnswer+"</p>");
					}
					
				}
				else
				{
					$(event.currentTarget).text("Reveal Answer");
					$(event.currentTarget).parent().find('.answer').remove();
				}
			});

			$('.deleteButton').last().click(function(event)
			{
				/* Act on the event */
				var deleteConfirm = confirm("Are you sure you want to delete this question? (no way back!)");

				if(deleteConfirm)
				{
					var questionID = $(event.currentTarget).attr('questionid');
					// grey until gone
					$(event.currentTarget).parent().css('color', 'rgb(225,225,225');
					$(event.currentTarget).parent().find('.revealButton').css('color', 'rgb(225,225,225');

					// send query
					$.ajax({
						url: 'http://www.learningenergy.eca.ed.ac.uk/backend/app_questions/delete/'+questionID,
						type: 'DELETE',
						dataType: 'json',
						data: {},
					})
					.done(function() {
						console.log("success");
						$(event.currentTarget).parent().remove();
						reflowListNumbers();
					})
					.fail(function(e) {
						console.log(e);
					});
					
				}
			});
		})
		.fail(function() {
			alert('Failed to connect to the database - send Chris an angry email');
		});
		
		// add new q below but grey
		// when callback success show fully
		// otherwise popup
	});
}

function getQuestions()
{
	// all questions pertaining to a certain school
	d3.json("http://www.learningenergy.eca.ed.ac.uk/backend/app_questions.json", function(error, json) {
		if (error) return console.log(error);
		questionData = json.data;
		console.log(questionData);
		displayQuestions();
	});
}

function displayQuestions()
{
	for(var i=0;i<questionData.length; i++)
	{
		var thisQuestion = questionData[i];
		$('#questionsWrapper').append("<span class='questionRow'><span class='qNumber'>"+(i+1)+"</span><span class='questionText'>"+thisQuestion.question+"</span><img class='deleteButton' questionID="+thisQuestion.id+" src='img/deleteButton.png' alt='delete question' height='20px' width='20px' /><p questionID="+thisQuestion.id+" class='revealButton'>Reveal Answer</p></span");
		if(i % 2 !== 0)
		{
			$('span.questionRow').eq(i).append("<hr/>");
			$('span.questionRow').eq(i).prepend("<hr/>");
		}
	}

	setupQuestionListeners();
}


function setupQuestionListeners()
{
	$('.deleteButton').click(function(event)
	{
		/* Act on the event */
		var deleteConfirm = confirm("Are you sure you want to delete this question? (no way back!)");

		if(deleteConfirm)
		{
			var questionID = $(event.currentTarget).attr('questionid');
			// grey until gone
			$(event.currentTarget).parent().css('color', 'rgb(225,225,225');
			$(event.currentTarget).parent().find('.revealButton').css('color', 'rgb(225,225,225');

			// send query
			$.ajax({
				url: 'http://www.learningenergy.eca.ed.ac.uk/backend/app_questions/delete/'+questionID,
				type: 'DELETE',
				dataType: 'json',
				data: {},
			})
			.done(function() {
				console.log("success");
				$(event.currentTarget).parent().remove();
				reflowListNumbers();
			})
			.fail(function(e) {
				console.log(e);
			});
			
		}
	});

	$('.revealButton').click(function(event)
	{
		var questionID = $(event.currentTarget).attr('questionid');

		if($(event.currentTarget).text() === "Reveal Answer")
		{
			var theAnswer;
			$(event.currentTarget).text("Hide Answer"); // change the button
			for(var i=0;i<questionData.length; i++)
			{
				if(questionData[i].id === +questionID)
				{
					theAnswer = questionData[i].answer;
				}
			}
			if($(event.currentTarget).parent().find('hr').length > 0)
			{
				$(event.currentTarget).parent().find('hr').last().before("<p class='answer'>"+theAnswer+"</p>");
			}
			else
			{
				$(event.currentTarget).parent().append("<p class='answer'>"+theAnswer+"</p>");
			}
			
		}
		else
		{
			$(event.currentTarget).text("Reveal Answer");
			$(event.currentTarget).parent().find('.answer').remove();
		}
	});
}

function reflowListNumbers()
{
	var rows = $('#questionsWrapper').find('span.questionRow');
	for(var i=0; i<rows.length; i++)
	{
		$(rows[i]).find('.qNumber').text(i+1);
		if($(rows[i]).find('hr').length > 1)
		{
			$(rows[i]).find('hr').eq(0).remove();
		}
	}
}
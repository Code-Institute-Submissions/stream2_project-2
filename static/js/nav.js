$("#navigation").addClass("js").before('<div id="menu">&#9776;</div>');
	$("#menu").click(function(){
		$("#navigation").toggle();
	});
	$(window).resize(function(){
		if(window.innerWidth > 768) {
			$("#navigation").removeAttr("style");
		}
	});
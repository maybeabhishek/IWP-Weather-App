$("#goDown").click(function() {
  $('html,body').animate({
      scrollTop: $(".seperation").offset().top},'slow');
});
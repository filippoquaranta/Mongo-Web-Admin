$(document).ready(function()
{
  var $history = $('#history');
  var $input = $('#input').commandInput({trigger: executor.execute, history: $history});
  var $history = $history.inputHistory({target: $input});
  $('#pager').pager({});
  $('#collections').delegate('li', 'click', explorer.collections.clicked);
  
  $(window).resize(setHeight);
  setHeight();
  function setHeight()
  {
    var height = $(window).height() - $('#menu').height() - $input.height() - 30;
    $('#explorer').height(height);
    $('#results').height(height - $('#history').height()-10);
    $input.width($history.width()-20);
  };
  
  $('#toggleExplorer div').click(explorer.toggle);
});

var explorer = {};
explorer.collections = 
{
  context: function(type, context)
  {
    var $collections = $('#collections');
    if (type == 'new') { $collections.hide(); return; }
    if (type != 'database' || !context.collections) { return; }
    
    var $ul = $collections.find('ul');
    $ul.children().remove();
    for (var i = 0; i < context.collections.length; ++i)
    {
      $ul.append($('<li>').text(context.collections[i]));
    }
    $collections.show();
  },
  clicked: function()
  {
    executor.rawExecute('db.' + $(this).text() + '.stats();');
  }
};
//this whole thing sucks!
explorer.toggle = function()
{
  var $explorer = $('#explorer');
  var $this = $(this);
  var left = 0;
  if ($explorer.is(':visible'))
  {
    $this.removeClass('collapse').addClass('expand');
    $explorer.hide(); 
  }
  else
  {
    $this.removeClass('expand').addClass('collapse');
    $explorer.show();
    left = $explorer.width()+2;
  }
  $('#input').css({left: left, width: $('#history').width()-20});
}
context.register(explorer.collections.context);
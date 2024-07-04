

// Aqui você adiciona ou remove os containers pra onde devem ir os cards
var containers = [
  // Container com os cards que serão realocados
  // Não mexer
  document.querySelector("#cardPile"),

  // Containers que irão receber os cards
  document.querySelector("#slot-1"),
  document.querySelector('#slot-2'), 
  document.querySelector('#slot-3')
];
var audio = new Audio();
var erro = 0;

// Solução ao dragindrop
var scrollable = true;

var listener = function(e) {
  console.log(scrollable)
    if (! scrollable) {
        e.preventDefault();
    }
}

document.addEventListener('touchmove', listener, { passive:false });

// Solução ao dragindrop

dragula({
  containers: containers,
  revertOnSpill: true,
  direction: 'vertical',
  accepts: function (el, target, source, sibling) {
      return el.dataset.target == target.id; 
  }
}).on('drag', function(el, source) {
  // On mobile this prevents the default page scrolling while dragging an item.
  scrollable = false;
}).on("drop", function(){
  scrollable = true;

  $('#bgmodal-acerto').modal('show')
      audio.setAttribute('src','../assets/atividades/arrasta_solta/acerto.mp3'); //change the source
      audio.load(); //load the new source
      audio.play(); //play

}).on("cancel", function(){
  scrollable = true;

      // Executa o áudio e a modal necessária
      // Também é possível fazer algum teste aqui caso necessário.
  $('#bgmodal-erro').modal('show')
      audio.setAttribute('src','../assets/atividades/arrasta_solta/erro.mp3'); //change the source
      audio.load(); //load the new source
      audio.play(); //play
});

// document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive:false });
var snd_path = "../assets/atividades/perguntas/snd/"


var FXManager = {
    snd_certo : new Audio(snd_path+"acerto.mp3"),
    snd_erro : new Audio(snd_path+"erro.mp3"),
    snd_aplauso : new Audio(snd_path+"aplauso.mp3"),
}

var Atividadeselect = {
    init:function(classname){
        console.log('init - '+ classname);
        $('.'+classname).parent().before('<p class="enunciado sr-only" aria-hidden="true">para resolver o problema do audio no caso do select</p>')
       
        $('.'+classname).on('change', function(){
            $(this).parent().removeClass('certo');
            $(this).parent().removeClass('errado');
            console.log('selected = ',$(this).val());
            console.log('default =',$(this).data("def"));
            if($(this).val() == $(this).data("def")){
                $(this).parent().addClass('certo');
                FXManager.snd_certo.play();
                if($(".ol-"+classname+" li.certo").length == 3)
                    Checker($('.'+classname).eq(0));//FXManager.snd_aplauso.play();                
            }else{
                $(this).parent().addClass('errado')/
                    FXManager.snd_erro.play();
            }
        })
    }
}

/**
 *Bem simples, coloca a classe esquemaDaBru no container, e alt-c na alternativa certa ,
  alt-e na alternativa errada, e colcar os feedback na div feedbacks, pq o designer mudou a simplicidade do original :(,
se quiser que fique como era originalmente basta nao declarar a div feedbacks dentro da estrutura
 */

var EsquemaDaBru = {
    init: function(){
        
        Array.from(document.querySelectorAll('.esquemaDaBru')).forEach(function(el){

            let btCerto = el.querySelector('.alt-c');
            let btsErrados = el.querySelectorAll('.alt-e');
            let feed_positivo = el.querySelector('.f-positivo');
            let feed_negativo = Array.from(el.querySelectorAll('.f-negativo'));
            let original = false;

            if(el.querySelector('.feedbacks') == null){
                original = true;
            }

            console.log('tp of ', typeof(feed_positivo))
            if(feed_positivo != null)
                feed_positivo.style.display = 'none';
            if(feed_negativo.length > 0)
                feed_negativo.forEach(function(fn){
                fn.style.display = 'none';
            })

            btCerto.addEventListener('click', function(){
                FXManager.snd_certo.play();
                el.hideFeedbacks();
                el.clear();
                this.classList.add('selected');
                if(original) this.classList.add('certo');
                $(feed_positivo).fadeIn(200);                
            })

            btsErrados.forEach(function(bt,index){
                bt.addEventListener('click', function(){
                    FXManager.snd_erro.play();
                    el.hideFeedbacks();
                    el.clear();
                    this.classList.add('selected');
                    if(original) this.classList.add('errado');
                    if(feed_negativo.length > 1){
                      $(feed_negativo[index]).fadeIn(200);
                    } else  if(feed_negativo.length <=1 && feed_negativo.length > 0)
                      $(feed_negativo[0]).fadeIn(200);
                })
            })

            el.hideFeedbacks = function(){
                if(feed_positivo != null){
                    feed_positivo.style.display = 'none';
                }
                if(feed_negativo.length > 0){
                    feed_negativo.forEach(function(fn){
                        fn.style.display = 'none';
                    })
                }
            }
            el.clear = function(){
                btCerto.classList.remove('selected');
                btCerto.classList.remove('certo');
                btsErrados.forEach(function(bt){
                    bt.classList.remove('selected')
                    bt.classList.remove('errado')
                })
            }
        })
    }
}

EsquemaDaBru.init();

var MultiSelect = {
    alternatives: null,
    init: function (classname){
        console.log('initi - ', classname)
        ms = this,
        $("."+classname+'.multiSelect .alt-e').on('click', function(){
            $(this).addClass('errado');
            FXManager.snd_erro.play();
            
        });
        $("."+classname+'.multiSelect .alt-c').on('click', function(){
            //ms.clear(this);
            $(this).addClass('certo');
            FXManager.snd_certo.play();
            if($("."+classname+'.multiSelect .alt-c').length == $("."+classname+'.multiSelect .alt-c.certo').length){
                FXManager.snd_aplauso.play();
            }
        });

    },
    clear: function(el){ 
        $(el).parent().find('.alt-e').removeClass('errado');
    }
}

/**
 * Classe para criar atividades do tipo colunas
 * 
 * @constructor
 * @param {string} id - o id do elemento que possui a estrutura das colunas 
 */

function AtividadeClick(id){
    this.id = id;
    this.selected = null;
    let alts = document.querySelectorAll('#'+id+' .bt-alts');
    let res = document.querySelectorAll('#'+id+' .bt-res');
    let container = document.querySelector('#'+id);
    this.btsAlternativas =  Array.prototype.slice.call(alts, 0);
    this.btsRespostas =  Array.prototype.slice.call(res, 0);
    console.log(this.btsAlternativas);
    let at = this;
    this.btsAlternativas.forEach(function(el){
        el.setAttribute('title',"Alternativa: ");
        el.addEventListener('click', function(){
            console.log('alt=',this.dataset.alt);
            if(at.selected != null){
                console.log('errou!');
                FXManager.snd_erro.play();
                PopupMessage.show("Escolha uma das respostas não outra alternativa!")
                at.clear();
            } else {
                at.selected = this;
                this.classList.add('selected');
                this.disabled = true;
            }
        })
    });

    this.btsRespostas.forEach(function(el){
        el.setAttribute('title','Resposta: ');
        el.addEventListener('click', function(){
            console.log('res=',this.dataset.alt);
            if(at.selected == null){
                console.log('errou!');
                FXManager.snd_erro.play();
                PopupMessage.show("Escolha uma das alternativas primeiro!")
                //at.clear();
            } else {
                if(at.selected.dataset.alt == this.dataset.alt){
                    console.log('acertou');
                    FXManager.snd_certo.play();
                    this.disabled = true;
                    at.selected.disabled = true;
                    this.classList.add('certo')
                    at.selected.classList.add('certo');
                    at.selected = null;
                    at.checkEnd();
                } else {
                    FXManager.snd_erro.play();
                    this.disabled = true;
                    console.log('errou');
                    this.classList.add('errou');
                    at.selected.classList.add('errou');
                    setTimeout(function(){
                        el.classList.remove('errou');
                        at.selected.classList.remove('errou');                        
                        el.disabled = false;
                        at.clear();
                    }, 400);
                }                
            }
        })
    });

    this.clear = function(){
        at.selected.classList.remove('selected');
        at.selected.disabled = false;
        at.selected = null
    }

    this.checkEnd = function(){

        if(document.querySelectorAll('#'+id+' .bt-alts.certo').length == at.btsAlternativas.length){
            //FXManager.snd_aplauso.play();
            console.log('container ',container);
            $(container).addClass('certo');
            Checker($('#'+id+' .bt-alts').eq(0).parent());

            //setTimeout(PopupMessage.show("Parabéns, você acertou tudo!"),200)
        }
    }

    console.log(this.alternativas)
    console.log('sou -', this.id);
}


$(document).ready(function(){   
    EsquemaDaBru.init()
})

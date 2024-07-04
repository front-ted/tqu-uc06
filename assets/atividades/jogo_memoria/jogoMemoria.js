
var cards = [
    {
        'par':'1',
        'conteudo':'lorem'
    },
    {
        'par':'1',
        'conteudo':'lorem'
    },
    {
        'par':'2',
        'conteudo':'lorem'
    },
    {
        'par':'2',
        'conteudo':'lorem'
    },
    {
        'par':'3',
        'conteudo':'lorem'
    },
    {
        'par':'3',
        'conteudo':'lorem'
    },
    {
        'par':'4',
        'conteudo':'lorem'
    },
    {
        'par':'4',
        'conteudo':'lorem'
    },
    {
        'par':'5',
        'conteudo':'lorem'
    },
    {
        'par':'5',
        'conteudo':'lorem'
    },
    {
        'par':'6',
        'conteudo':'lorem'
    },
    {
        'par':'6',
        'conteudo':'lorem'
    },
    {
        'par':'7',
        'conteudo':'lorem'
    },
    {
        'par':'7',
        'conteudo':'lorem'
    },
    {
        'par':'8',
        'conteudo':'lorem'
    },
    {
        'par':'8',
        'conteudo':'lorem'
    },
    {
        'par':'9',
        'conteudo':'lorem'
    },
    {
        'par':'9',
        'conteudo':'lorem'
    },
    {
        'par':'10',
        'conteudo':'lorem'
    },
    {
        'par':'10',
        'conteudo':'lorem'
    },
    {
        'par':'1',
        'conteudo':'lorem'
    },
];
$(".cartaMemoria").click(cliqueCarta);

function cliqueCarta(){
    var cartaAtual = $(this);

    if(cartaAtual.hasClass("acertou") || cartaAtual.hasClass("errou")){

    }else{
        $(this).addClass("flip");
        if($(".flip:not(.acertou):not(.errou)").length > 1){
            $(".cartaMemoria").unbind()
            validaMemoria();
        }
    }
}
function validaMemoria(){
    var flip = $(".flip:not(.acertou):not(.errou)");
    var carta0 = flip[0];
    var carta1 = flip[1];

    
    if($(carta0).data( "par" ) == $(carta1).data( "par" )){
        console.log($(carta0).data( "par" ) +"__"+ $(carta1).data( "par" ));
        $(".flip:not(.acertou):not(.errou)").addClass("acertou");
        $(".cartaMemoria:not(.acertou):not(.errou)").click(cliqueCarta);               

    }else{
        $(".flip:not(.acertou):not(.errou)").addClass("errou");
            window.setTimeout(function(){
                $(flip).removeClass("flip");
                $(flip).removeClass("errou");
                $(".cartaMemoria:not(.acertou):not(.errou)").click(cliqueCarta);
            }, 1000)
    }
}
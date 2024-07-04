/*
imgPath: 
O caminho padrao das imagens dentro do diretorio do tópico, em relação a raiz do diretório do topico
caso todos os topicos usem em sua estrutura um diretorio com mesmo nome de imagem, basta setar aqui
no js o caminho, seja ele img, assets, conteudo, etc, essa variavel eh uma referencia a pasta em que as imagens estao em
relação a raiz do topico, 

    <pasta_topico>
              | |
              | <pasta que contém as imagens refrenciados no html>
              |
              index.html
    se tivermos uma estrutra de pastas mais elaborada em um tópico, por exemplo :
    
    topico_01
          |  |
          |  assets 
          |     | | |
          |     | | imgs
          |     | css 
          |     js
          |
          index.html    
    
    A pasta que contem as imagens, nesse caso em relação a raiz pasta topico_01 é a pasta assets
    neste caso entao a variavel imgPath é imgPath = "assets/", já que esta variavel eh utilizada
    para a correção dos links no momento em que conteudo é carregado dinamicamente via ajax na tela de print.
    ja que a tela de print esta localizada fora da estrutura dos conteudos.
*/
let imgPath = 'img/';
//path: deve ficar em branco, pois recebe via "GET" o nome da pasta onde está o index.html do tópico que será impresso
let path = "";
//qual arquivo de inicio procurar, caso nao seja o index.html, vem no "GET"
let startPoint = ""
/*
defaultContentLocation:
supondo que o conteudo de cada tópico do módulo esta todo em relação a raiz 
do diretorio do modulo, entao a localização padrao para o print eh subir um
diretorio e então ir para a pasta referenciada no path, que vem via get no html.
caso a estrutura seja difente, com os topicos dentro de uma pasta conteudo, então
se faz necessário o ajuste do defaultContentLocation para, por exemplo
        defaultContentLocation = "../conteudo/"
pois assim informamos para o print que ele deve subir um diretorio e procurar o path informado dentro da pasta conteudo.
*/
let defaultContentLocation = "../"

window.addEventListener('load', function(){
  let location = window.location.href;
  let params = location.split("?")[1].split('&');
  path = params[0].split('=')[1];
  params.forEach((el) => {    
    if (el.indexOf('imgpath') != -1)
      imgPath = el.split("=")[1] + '/';
    if (el.indexOf('startpoint') != -1)
      startPoint = el.split("=")[1]
    else{
      startPoint = "index.html";
    }
  })
  //console.log(path)
  //console.log('params:', params)
  //console.log('location:', location)
  //console.log('path:', path, "imgPath:", imgPath, "startPoint:", startPoint)
  recuperarConteudo(path)
})

function recuperarConteudo(htmlPath){ 
    //console.log(htmlPath)  
    console.log('caminho:','../' + htmlPath + '/' + startPoint +' .pagina')
    $('#ajaxPages').load('../' + htmlPath + '/' + startPoint +' .pagina', function(response, status, xhr){
        if(status == "success"){
            //console.log('loaded:', response)
            $('img').each(function (i, img){
                //console.log($(img).attr('src'))
                if($(img).attr('src').indexOf(imgPath) != -1){
                    $(img).attr('src',defaultContentLocation + htmlPath + '/' +  $(img).attr('src'))
                }
            })
            $('.preloader').fadeOut(150)
        }
        if(status == "error"){
            $('.preloader').fadeOut(150)
            alert('Erro ao carregar o conteudo para impressao. Erro: ' + xhr.status + ':' + xhr.statusText)
            console.error("Erro:" + xhr.status + ":" + xhr.statusText)
        }
    }) 
}

function fontSize(size)
  {

    size = Number(size);
    switch (size)
    {
      case 1:

        $("h1").css({"font-size":"26pt "});
        $("h2").css({"font-size":"24pt "});
        $("h3").css({"font-size":"22pt "});
        $("h4").css({"font-size":"20pt "});
        $("h5").css({"font-size":"18pt "});
        $("p").css({"font-size":"14pt "});
        break;

      case 2:

          $("h1").css({"font-size":"28pt "});
          $("h2").css({"font-size":"26pt "});
          $("h3").css({"font-size":"24pt "});
          $("h4").css({"font-size":"22pt "});
          $("h5").css({"font-size":"20pt "});
          $("p").css({"font-size":"18pt "});
          break;

      default:
          $("h1").css({"font-size":""});
          $("h2").css({"font-size":""});
          $("h3").css({"font-size":""});
          $("h4").css({"font-size":""});
          $("h5").css({"font-size":""});
          $("p").css({"font-size":""});
          break;
    }

    $("[data-click='fontSize']").removeClass("active");
    $("[data-click='fontSize'][data-value='"+size+"']").addClass("active");
  }
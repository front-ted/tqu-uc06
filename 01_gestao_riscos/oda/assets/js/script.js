$(document).ready(function () {
    criarBodyJogo();
    const somErro = $('#audio-erro')[0];
    const somAcerto = $('#audio-acerto')[0];

    controleCarrossel();
    cloneECorrecao();
    $('#modalCarrossel').on('shown.bs.modal', function () {
        embaralharDivs();
    });
});

function controleCarrossel() {
    let currentIndex = 0;
    const items = $('.div-texto-modal');
    const itensNaPagina = 1;
    const animationSpeed = 400;

    function mostrarItens(startIndex) {
        items.fadeOut(animationSpeed, function () {
            items.addClass('d-none');
            items.slice(startIndex, startIndex + itensNaPagina)
                .removeClass('d-none')
                .fadeIn(animationSpeed);

            const itemVisivel = items.slice(startIndex, startIndex + itensNaPagina);
            $('.div-texto-modal').removeClass('div-selecionada');
            itemVisivel.addClass('div-selecionada');
        });
        controleBotoes();
    }

    function controleBotoes() {
        if (currentIndex === 0) {
            $('.carrosel-controle-voltar')
                .prop('disabled', true)
                .addClass('disabled-button');
        } else {
            $('.carrosel-controle-voltar')
                .prop('disabled', false)
                .removeClass('disabled-button');
        }

        if (currentIndex + itensNaPagina >= items.length) {
            $('.carrosel-controle-proximo')
                .prop('disabled', true)
                .addClass('disabled-button');
        } else {
            $('.carrosel-controle-proximo')
                .prop('disabled', false)
                .removeClass('disabled-button');
        }
    }

    mostrarItens(currentIndex);

    $('.carrosel-controle-proximo').on('click', function () {
        if (currentIndex + itensNaPagina < items.length) {
            currentIndex += itensNaPagina;
            mostrarItens(currentIndex);
        }
    });

    $('.carrosel-controle-voltar').on('click', function () {
        if (currentIndex - itensNaPagina >= 0) {
            currentIndex -= itensNaPagina;
            mostrarItens(currentIndex);
        }
    });
}

function cloneECorrecao() {
    let linhaSelecionada;
    let divSelecionada;

    const respostasCorretas = {
        linha1: ["categoria-um", "categoria-oito"],
        linha2: ["categoria-nove", "categoria-cinco"],
        linha3: ["categoria-sete", "categoria-seis"],
        linha4: ["categoria-dez", "categoria-quatro"],
        linha5: ["categoria-dois", "categoria-tres"]
    };

    const somErro = $('#audio-erro')[0];
    const somAcerto = $('#audio-acerto')[0];

    $('.btn-carrosel').on('click', function () {
        linhaSelecionada = $(this).closest('.linha');
    });

    $('.btn-selecionar').on('click', function () {
        divSelecionada = $('.div-texto-modal.div-selecionada');
        if (divSelecionada && linhaSelecionada) {
            let divClasse = divSelecionada.attr('class').split(' ').filter(cls => cls.startsWith('categoria-'))[0];

            let divJaClonada = linhaSelecionada.find(`.div-texto-modal.${divClasse}`).length > 0;

            if (divJaClonada) {
                alert('Esta opção já foi selecionada para esta linha.');
            } else {
                let divClonada = divSelecionada.clone();
                linhaSelecionada.find('.conjunto-bts').prepend(divClonada);
                divSelecionada.removeClass('div-selecionada');

                verificarRespostas(linhaSelecionada);
                verificarTodasLinhas();
            }
        }
    });

    function verificarRespostas(linha) {
        const linhaId = linha.attr('class').split(' ')[0];
        const respostasLinha = respostasCorretas[linhaId];
        
        // Mova a definição de somErro e somAcerto para dentro da função
        const somErro = $('#audio-erro')[0];
        const somAcerto = $('#audio-acerto')[0];
    
        linha.find('.div-texto-modal').each(function () {
            const divClonada = $(this);
            const divClasse = divClonada.attr('class').split(' ').filter(cls => cls.startsWith('categoria-'))[0];
    
            if (divClonada.hasClass('feedback-correto')) {
                return;
            }
    
            if (respostasLinha.includes(divClasse)) {
                exibirFeedbackModal('Correto!', 'assets/img/positivo.png', 'feedback-success');
                if (somAcerto) {
                    somAcerto.play().catch(error => console.error("Erro ao reproduzir o som de acerto:", error));
                }
                divClonada.addClass('feedback-correto');
            } else {
                exibirFeedbackModal('Errado!', 'assets/img/negativo.png', 'feedback-error');
                if (somErro) {
                    somErro.play().catch(error => console.error("Erro ao reproduzir o som de erro:", error));
                }
                setTimeout(function () {
                    divClonada.remove();
                }, 5000);
            }
        });
    }
    


    function exibirFeedbackModal(mensagem, icone, estiloClasse) {
        $('#feedbackMessage').text(mensagem).removeClass('feedback-success feedback-error').addClass(estiloClasse);
        $('#feedbackIcon').attr('src', icone);
        $('#feedbackModal').modal('show');
    }

    function verificarTodasLinhas() {
        let todasLinhasCorretas = true;

        $('.linha').each(function () {
            const linha = $(this);
            const linhaId = linha.attr('class').split(' ')[0];
            const respostasLinha = respostasCorretas[linhaId];

            let respostasEncontradas = [];

            linha.find('.div-texto-modal.feedback-correto').each(function () {
                const divClasse = $(this).attr('class').split(' ').filter(cls => cls.startsWith('categoria-'))[0];
                respostasEncontradas.push(divClasse);
            });

            if (respostasEncontradas.sort().toString() !== respostasLinha.sort().toString()) {
                todasLinhasCorretas = false;
            }
        });

        if (todasLinhasCorretas) {
            setTimeout(function () {
                $('#modalFinal').modal('show');
            }, 5000);
        }
    }
}

function embaralharDivs() {
    const $divs = $('.carrosel .div-texto-modal');
    const $parent = $divs.parent();

    $divs.sort(function () {
        return 0.5 - Math.random();
    }).appendTo($parent);
}

function criarBodyJogo() {
    var $estrutura = $('<div>', { class: 'estrutura' });

    var $feedbackModal = $('<div>', {
        class: 'modal fade',
        id: 'feedbackModal',
        tabindex: '-1',
        'aria-labelledby': 'feedbackModalLabel',
        'aria-hidden': 'true'
    }).append(
        $('<div>', { class: 'modal-dialog modal-dialog-centered' }).append(
            $('<div>', { class: 'modal-content' }).append(
                $('<div>', { class: 'modal-body text-center' }).append(
                    $('<img>', {
                        id: 'feedbackIcon',
                        src: '',
                        alt: 'Ícone de Feedback',
                        class: 'img-fluid my-3',
                        width: 50
                    }),
                    $('<h5>', {
                        id: 'feedbackMessage'
                    })
                ),
                $('<div>', { class: 'modal-footer justify-content-center' }).append(
                    $('<button>', {
                        type: 'button',
                        class: 'btn btn-secondary btn-lg btn-final',
                        'data-bs-dismiss': 'modal'
                    }).append(
                        $('<span>', { class: 'span-fechar' }).text('Fechar')
                    )
                )
            )
        )
    );

    $estrutura.append($feedbackModal);

    var $topo = $('<div>', { class: 'topo' }).append(
        $('<div>')
    );


    $estrutura.append($topo);

    var $meio = $('<div>', { class: 'meio' }).append(
        $('<div>', { class: 'obj-jogo-encontre' })
    );

    $estrutura.append($meio);

    var $rodape = $('<div>', { class: 'rodape' }).append(
        $('<div>')
    );

    $estrutura.append($rodape);


    var $bodyEncontre = $('<div>', { class: 'body-encontre' });
    var $conteudoEncontre = $('<div>', { class: 'conteudo-encontre' }).appendTo($bodyEncontre);

    var $borda = $('<div>', { class: 'borda' }).appendTo($conteudoEncontre);

    $('<div>', { class: 'topo-img' }).append(
        $('<img>', {
            src: 'assets/img/topo_doodles.png',
            class: 'img-fluid',
            alt: 'imagem background título encontre meu lugar'
        })
    ).appendTo($borda);

    $('<div>', { class: 'topo-intro' }).append(
        $('<p>', { class: 'p-encontre' }).html('Determinar os <strong>RISCOS</strong> e <strong>OPORTUNIDADES</strong> para cada categoria:')
    ).appendTo($borda);

    var $colunasEncontre = $('<div>', { class: 'colunas-encontre' }).appendTo($borda);

    var categorias = ['Pessoas', 'Processos', 'Tecnologia', 'Imagem', 'Eventos Externos'];
    categorias.forEach(function (categoria, index) {
        $('<div>', { class: 'linha' + (index + 1) + ' linha row' }).append(
            $('<h3>', { class: 'categoria col-5' }).text(categoria),
            $('<div>', { class: 'conjunto-bts col' }).append(
                $('<button>', {
                    type: 'button',
                    class: 'col btn-carrosel som-clique',
                    'data-bs-toggle': 'modal',
                    'data-bs-target': '#modalCarrossel'
                }).text('+')
            )
        ).appendTo($colunasEncontre);
    });

    var $modalCarrossel = $('<div>', {
        class: 'modal fade',
        id: 'modalCarrossel',
        tabindex: '-1',
        'aria-labelledby': 'modalCarrosselLabel',
        'aria-hidden': 'true'
    }).appendTo($bodyEncontre);

    var $modalDialog = $('<div>', { class: 'modal-dialog' }).appendTo($modalCarrossel);
    var $modalContent = $('<div>', { class: 'modal-content' }).appendTo($modalDialog);
    var $modalHeader = $('<div>', { 
        class: 'centralizar oda-selecao', 
        id: 'odaModal' 
    }).appendTo($modalContent);

    $('<div>', { class: 'div-categoria-modal-cabecalho' }).append(
        $('<h1>', { class: 'h1-categoria-modal-cabecalho' }),
        $('<p>', { class: 'p-categoria-modal-cabecalho p-inicio' }).html('<span class="cinza">Selecione o <strong>RISCO</strong> ou a <strong>OPORTUNIDADE</strong> para esta categoria.</span>')
    ).appendTo($modalHeader);

    var $modalBodyCategoria = $('<div>', { class: 'modal-body-categoria' }).appendTo($modalContent);
    var $carrosel = $('<div>', { class: 'carrosel' }).appendTo($modalBodyCategoria);

    var carrosselConteudo = [
        { categoria: 'categoria-um', tipo: 'Risco', descricao: 'Estoque físico e online diferentes devido a conferência errada;', icone: 'ico_risco.png' },
        { categoria: 'categoria-dois', tipo: 'Risco', descricao: 'Perda de clientes para concorrentes por não fazer análise de mercado;', icone: 'ico_risco.png' },
        { categoria: 'categoria-tres', tipo: 'Oportunidade', descricao: 'Vendas garantidas devido a diversificação do mix de produtos;', icone: 'stars.png' },
        { categoria: 'categoria-quatro', tipo: 'Oportunidade', descricao: 'Reforço da reputação por atender o cliente rapidamente pelo chat;', icone: 'stars.png' },
        { categoria: 'categoria-cinco', tipo: 'Oportunidade', descricao: 'Análise do perfil de cliente da loja devido ao processo de análise de dados e indicadores;', icone: 'stars.png' },
        { categoria: 'categoria-seis', tipo: 'Oportunidade', descricao: 'Compras aumentaram devido a boa experiência no site;', icone: 'stars.png' },
        { categoria: 'categoria-sete', tipo: 'Risco', descricao: 'Exposição dos dados dos clientes devido a vazamento de dados;', icone: 'ico_risco.png' },
        { categoria: 'categoria-oito', tipo: 'Oportunidade', descricao: 'Cliente possui experiência de compra personalizada devido a sugestões de looks após análise de seu perfil;', icone: 'stars.png' },
        { categoria: 'categoria-nove', tipo: 'Risco', descricao: 'Produto cadastrado com informações erradas por falta de instrução de trabalho;', icone: 'ico_risco.png' },
        { categoria: 'categoria-dez', tipo: 'Risco', descricao: 'Cliente insatisfeito pois não encontra foto das roupas no site;', icone: 'ico_risco.png' }
    ];

    carrosselConteudo.forEach(function (item) {
        var tipoClass = item.tipo.toLowerCase();
        $('<div>', { class: 'div-texto col div-texto-modal som-clique d-block ' + item.categoria }).append(
            $('<div>', { class: 'cabecalho-texto ' + tipoClass + ' row' }).append(
                $('<img>', { src: 'assets/img/' + item.icone, class: 'col-3 img-icone', alt: '' }),
                $('<h3>', { class: 'h1-titulo col-9' }).text(item.tipo)
            ),
            $('<p>', { class: 'p-descricao p-descricao-' + tipoClass }).text(item.descricao)
        ).appendTo($carrosel);
    });

    $('<button>', { class: 'carrosel-controle-voltar controle', type: 'button' }).append(
        $('<img>', { src: 'assets/img/seta_esq_normal.png', class: 'estilo-seta som-clique selecionado', alt: 'seta esquerda' })
    ).appendTo($carrosel);

    $('<button>', { class: 'carrosel-controle-proximo controle', type: 'button' }).append(
        $('<img>', { src: 'assets/img/seta_dir_normal.png', class: 'estilo-seta som-clique selecionado', alt: 'seta direita' })
    ).appendTo($carrosel);

    $('<div>', { class: 'modal-footer' }).append(
        $('<button>', {
            type: 'button',
            class: 'btn btn-lg btn-selecionar som-clique',
            'data-bs-dismiss': 'modal'
        }).append(
            $('<span>', { class: 'span-selecionar' }).text('Selecionar')
        )
    ).appendTo($modalContent);

    var $modalFinal = $('<div>', {
        class: 'modal fade',
        id: 'modalFinal',
        tabindex: '-1',
        'aria-labelledby': 'modalFinalLabel',
        'aria-hidden': 'true'
    }).appendTo($bodyEncontre);

    var $modalFinalDialog = $('<div>', { class: 'modal-dialog modal-lg' }).appendTo($modalFinal);
    var $modalFinalContent = $('<div>', { class: 'modal-content' }).appendTo($modalFinalDialog);
    var $modalFinalHeader = $('<div>', { class: 'modal-header' }).appendTo($modalFinalContent);

    $('<h5>', { class: 'modal-title title-final' }).text('Concluído com sucesso!').appendTo($modalFinalHeader);
    $('<button>', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'modal', 'aria-label': 'Close' }).appendTo($modalFinalHeader);

    $('<div>', { class: 'modal-body body-modal-final' }).append(
        $('<p>').html('Parabéns pela conclusão da atividade! <br><br> Você explorou de forma brilhante a elaboração de uma lista de riscos e oportunidades que é o produto final de uma reunião de brainstorming para Gestão de Riscos. Continue assim!')
    ).appendTo($modalFinalContent);

    $('<div>', { class: 'modal-footer' }).append(
        $('<button>', {
            type: 'button',
            class: 'btn btn-secondary btn-lg btn-final',
            'data-bs-dismiss': 'modal'
        }).append(
            $('<span>', { class: 'span-fechar' }).text('Fechar')
        )
    ).appendTo($modalFinalContent);


    $('<audio>', { id: 'audio-acerto', src: 'assets/audios/acerto.mp3' }).appendTo($bodyEncontre);
    $('<audio>', { id: 'audio-erro', src: 'assets/audios/erro.mp3' }).appendTo($bodyEncontre);

    $meio.find('.obj-jogo-encontre').append($bodyEncontre);

    $('.obj-jogo-encontre').append($estrutura);
}


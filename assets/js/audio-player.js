/* Criei esse player customizado pra ficar em conformidade com o layout proposto pelo designer 
 incorporar no documento html os arquivos sesc-player.css para o estilo visual e o audio-player.js para a funcionalidade
*/

/**
 * A estrutura básica dele no html fica assim:
 * 
    <div class="sesc-audio-player">
        <audio>
            <source src="conteudo/audio/tears.mp3" type="audio/mpeg">
        </audio>
        <div class="row g-0 align-items-center">
            <div class="col-12 col-lg-4">
                <button title="Tocar" class="btn-play btn-player"></button>
                <button title="Pause" class="btn-pause btn-player"></button>
                <button title="Transcrição" data-bs-toggle="modal" data-bs-target="#modal-transcricao-audio" class="btn-transcricao btn-player"></button>
                <div class="timestamp">00:00/00:00</div>
            </div>
            <div class="col-12 mt-2 col-lg-8 mt-lg-0">
                <input type="range" value="0" max="100" step="any">
            </div>
        </div>                    
    </div>   
 */


/*
    O objeto audio player funciona de forma geral para todos os players declarados na pagina, nao havendo necessidade
    de configurar cada um de forma independente, basta declarar a estrutra no html, linkar o source certo no audio e linkar 
    o audio-player.js ao final do documento, antes de fechar o body.
    A estrutura utilizada deve preferencialmente ser a demonstrada acimam sendo obrigatorias as classes no container principal(.sesc-audio-player) e nos botões(btn-play e btn-pause), uma tag de audio com source e um input range (as classes do bootstrap podem ser removidas caso nao seja usado)
    
    Escrito em js puro, então não precisa de jquery.

*/

AudioPlayer = {
    init: function(){
        //aqui eu verifico se existem estruturas de player com a classe .sesc-audio-player, e então trato as funcionalidades da cada player          
        Array.from(document.querySelectorAll('.audio-player')).forEach(function(el){
            let btPlay = el.querySelector('.btn-play');
            let btPause = el.querySelector('.btn-pause');
            let seek = el.querySelector('input');
            let audio = el.querySelector('audio');
            let timestamp = el.querySelector('.timestamp');

            audio.stopUpdate = false;

            audio.updateSeek = function(){
                if(!this.stopUpdate)
                    seek.value = audio.currentTime;
            }

            audio.updateTimestamp = function(){
                let min = Math.floor(this.currentTime / 60);
                let sec = Math.floor(this.currentTime % 60);
                let totmin = Math.floor(this.duration / 60);
                let totsec = Math.floor(this.duration % 60);

                let stringmin = min<=9?'0'+min:min;
                let stringsec = sec<=9?'0'+sec:sec;
                let stringtotmin = totmin<=9?'0'+totmin:totmin;
                let stringtotsec = totsec<=9?'0'+totsec:totsec;
                timestamp.innerHTML = stringmin+':'+stringsec+'/'+ stringtotmin+':'+stringtotsec
            }

            audio.addEventListener('loadeddata', function(){
                seek.max = audio.duration;
                audio.updateTimestamp()
            })

            btPlay.addEventListener('click', function(){
                audio.play();
            })

            btPause.addEventListener('click', function(){
                audio.pause();
            })  

            seek.addEventListener('input', function(){
                audio.stopUpdate = true;
            })

            seek.addEventListener('change', function(){
                console.log('change to:', this.value)
                audio.currentTime = parseFloat(this.value);  
                audio.stopUpdate = false;             
            })

            audio.addEventListener('timeupdate', function(){
                this.updateSeek();
                this.updateTimestamp();
            })

            audio.addEventListener('play', function(){
                audio.playing = true;
            })

            audio.addEventListener('pause', function(){
                audio.playing = false;
            })

            audio.addEventListener('ended', function(){
                audio.currentTime = 0;
                audio.playing = false;
            })

        })

    }
}
AudioPlayer.init()
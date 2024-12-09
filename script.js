const audioPlayer = new Audio();
let musicas = [];
let musicaAtualIndex = 0;

// Função para obter a lista de arquivos da pasta 'musicas' no GitHub usando a API
function obterListaMusicas() {
  fetch('https://api.github.com/repos/ribeiro-123/player/contents/musicas')
    .then(response => response.json())
    .then(data => {
      musicas = data.filter(file => file.name.endsWith('.mp3')).map(file => file.name);
      if (musicas.length > 0) {
        // Inicializa o player com a primeira música
        carregarMusica(musicaAtualIndex);
      }
    })
    .catch(error => console.error('Erro ao carregar a lista de músicas:', error));
}

// Função para carregar a música
function carregarMusica(index) {
  const musica = musicas[index];
  const musicaUrl = `https://raw.githubusercontent.com/ribeiro-123/player/master/musicas/${musica}`;
  
  audioPlayer.src = musicaUrl;
  audioPlayer.load();
  audioPlayer.play(); // Toca a música imediatamente após carregar
  // Atualiza o título da música
  document.getElementById('titulo-musica').textContent = musica.replace('.mp3', '');
}

// Requisita a lista de músicas
obterListaMusicas();

// Funções para os botões
const playPauseBtn = document.getElementById('play-btn');
const backwardBtn = document.getElementById('backward-btn');
const forwardBtn = document.getElementById('forward-btn');
const volumeControl = document.getElementById('volume');

// Função para alternar entre Play e Pause
playPauseBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    document.getElementById('play-icon').style.display = 'none';
    document.getElementById('pause-icon').style.display = 'inline';
  } else {
    audioPlayer.pause();
    document.getElementById('pause-icon').style.display = 'none';
    document.getElementById('play-icon').style.display = 'inline';
  }
});

// Funções para tocar a próxima e a anterior música
function tocarProximaMusica() {
  musicaAtualIndex = (musicaAtualIndex + 1) % musicas.length; // Avança para a próxima
  carregarMusica(musicaAtualIndex);
}

function tocarMusicaAnterior() {
  musicaAtualIndex = (musicaAtualIndex - 1 + musicas.length) % musicas.length; // Volta para a música anterior
  carregarMusica(musicaAtualIndex);
}

// Configura os botões de avanço e retrocesso
forwardBtn.addEventListener('click', tocarProximaMusica);
backwardBtn.addEventListener('click', tocarMusicaAnterior);

// Ajuste o volume
volumeControl.addEventListener('input', () => {
  audioPlayer.volume = volumeControl.value;
});

const audioPlayer = new Audio();
let musicas = [];
let musicaAtualIndex = 0;

// Função para obter os metadados da música
function obterMetadados(musica) {
  jsmediatags.read(musica, {
    onSuccess: function(tag) {
      const artista = tag.tags.artist || 'Desconhecido';  // Se não houver artista, exibe "Desconhecido"
      console.log('Artista:', artista);
      // Atualiza o nome do artista no HTML
      document.getElementById('artista').textContent = artista;
    },
    onError: function(error) {
      console.error('Erro ao ler metadados:', error);
    }
  });
}

// Requisição para obter a lista de músicas do servidor
fetch('https://github.com/ribeiro-123/player/tree/master/musicas')  // Este caminho pode ser ajustado conforme a estrutura do seu repositório
  .then(response => response.json())
  .then(data => {
    musicas = data;
    if (musicas.length > 0) {
      // Construindo o caminho para o arquivo de áudio no formato raw do GitHub
      const musicaUrl = `https://github.com/ribeiro-123/player/raw/main/musicas/${musicas[musicaAtualIndex]}`;
      
      audioPlayer.src = musicaUrl;
      audioPlayer.load();
      // Obtém os metadados da música
      obterMetadados(musicaUrl);
      // Atualiza o título da música
      document.getElementById('titulo-musica').textContent = musicas[musicaAtualIndex].replace('.mp3', '');
    }
  })
  .catch(error => console.error('Erro ao carregar as músicas:', error));

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
  musicaAtualIndex = (musicaAtualIndex + 1) % musicas.length;
  const musicaUrl = `https://github.com/ribeiro-123/player/raw/main/musicas/${musicas[musicaAtualIndex]}`;
  
  audioPlayer.src = musicaUrl;
  audioPlayer.play();
  document.getElementById('titulo-musica').textContent = musicas[musicaAtualIndex].replace('.mp3', '');
  obterMetadados(musicaUrl);
}

function tocarMusicaAnterior() {
  musicaAtualIndex = (musicaAtualIndex - 1 + musicas.length) % musicas.length;
  const musicaUrl = `https://github.com/ribeiro-123/player/raw/main/musicas/${musicas[musicaAtualIndex]}`;
  
  audioPlayer.src = musicaUrl;
  audioPlayer.play();
  document.getElementById('titulo-musica').textContent = musicas[musicaAtualIndex].replace('.mp3', '');
  obterMetadados(musicaUrl);
}

// Configura os botões de avanço e retrocesso
forwardBtn.addEventListener('click', tocarProximaMusica);
backwardBtn.addEventListener('click', tocarMusicaAnterior);

// Ajuste o volume
volumeControl.addEventListener('input', () => {
  audioPlayer.volume = volumeControl.value;
});

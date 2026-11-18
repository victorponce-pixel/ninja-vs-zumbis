// ninja vs zumbis

var LARGURA = 960;
var ALTURA = 540;
var GRAVIDADE = 0.6;
var VELOCIDADE = 4;
var FORCA_PULO = -14;
var LARGURA_JOGADOR = 28;
var ALTURA_JOGADOR = 44;
var BANDEIRA_X = 880;
var BANDEIRA_Y = 360;
var TOTAL_FASES = 3;

var MAX_PLAT = 14;
var MAX_MOEDAS = 12;
var MAX_INIMIGOS = 5;
var MAX_ESPINHOS = 4;

// x, y, largura, altura, tipo, min, max, vel
var plataformas = new Array();
var moedas = new Array();
var inimigos = new Array();
var espinhos = new Array();

var estado = "inicio";
var fase = 1;
var px, py, vx, vy, noChao;
var vidas = 5;
var pontos = 0;
var invencivel = 0;
var tempo = 0;
var contador = 0;
var coletadas = 0;
var aviso = "";
var avisoTempo = 0;
var esquerda = false;
var direita = false;
var pulo = false;
var platX = new Array();
var platY = new Array();
var platDir = new Array();
var moedaPega = new Array();
var inimigoX = new Array();
var inimigoDir = new Array();
var inimigoVivo = new Array();
var inimigoFolha = new Array();
var giro = false;
var olhando = 1;
var animTick = 0;
var folhaAtual = "";

var nuvemX = new Array(100, 380, 700, 850, 250, 560);
var nuvemY = new Array(30, 100, 60, 150, 190, 90);
var nuvemL = new Array(148, 142, 90, 97, 107, 104);
var nuvemA = new Array(79, 56, 59, 45, 38, 23);
var nuvemO = new Array(0.95, 0.9, 0.8, 0.7, 0.7, 0.6);
var nuvemVel = new Array(0.9, 0.7, 0.5, 0.3, 0.25, 0.2);

function desenhaCenario() {
  for (var i = 0; i < nuvemX.length; i++) {
    document.write("<div class='nuvem' id='nuvem" + i + "' style='top:" + nuvemY[i] + "px; width:" + nuvemL[i] + "px; height:" + nuvemA[i] + "px; opacity:" + nuvemO[i] + "; background-image:url(nuvem" + i + ".png);'></div>");
  }
    for (var i = 0; i < MAX_PLAT; i++) {
    document.write("<div class='plataforma' id='plat" + i + "'></div>");
    }
  for (var i = 0; i < MAX_MOEDAS; i++) {
    document.write("<div class='moeda' id='moeda" + i + "'></div>");
  }
  for (var i = 0; i < MAX_ESPINHOS; i++) {
  document.write("<div class='espinho' id='espinho" + i + "'></div>");
  }
  for (var i = 0; i < MAX_INIMIGOS; i++) {
    document.write("<div class='inimigo' id='inimigo" + i + "'></div>");
  }
  document.write("<div class='bandeira' id='bandeira' style='left:" + BANDEIRA_X + "px; top:" + BANDEIRA_Y + "px;'></div>");
  document.write("<div id='jogador'></div>");
}

function carregarFase(n) {
  fase = n;
  if (n == 1) {
    plataformas = new Array(
      [0, 480, 280, 60, 0, 0, 0, 0],
      [400, 480, 220, 60, 0, 0, 0, 0],
      [740, 480, 220, 60, 0, 0, 0, 0],
      [100, 390, 110, 16, 0, 0, 0, 0],
      [300, 320, 100, 16, 0, 0, 0, 0],
      [470, 390, 100, 16, 0, 0, 0, 0],
      [620, 300, 100, 16, 0, 0, 0, 0],
      [790, 380, 90, 16, 0, 0, 0, 0],
      [800, 240, 110, 16, 0, 0, 0, 0]
    );
    moedas = new Array([60, 440], [160, 350], [335, 280], [420, 440], [510, 350],
      [560, 440], [660, 260], [760, 440], [820, 340], [850, 200]);
    inimigos = new Array([190, 440, 0, 280, 1.2], [790, 440, 740, 900, 1.2]);
    espinhos = new Array([540, 464, 20]);
    tempo = 100;
  }
  else if (n == 2) {
    plataformas = new Array(
      [0, 480, 200, 60, 0, 0, 0, 0],
      [760, 480, 200, 60, 0, 0, 0, 0],
      [230, 450, 110, 16, 1, 230, 390, 1],
      [470, 380, 110, 16, 2, 320, 440, 0.8],
      [610, 360, 90, 16, 0, 0, 0, 0],
      [730, 270, 90, 16, 0, 0, 0, 0],
      [330, 290, 80, 16, 0, 0, 0, 0],
      [430, 200, 80, 16, 0, 0, 0, 0],
      [560, 230, 80, 16, 0, 0, 0, 0]
    );
    moedas = new Array([90, 440], [350, 250], [450, 160], [580, 190],
      [640, 320], [760, 230], [820, 440], [900, 440]);
    inimigos = new Array([790, 440, 760, 910, 1.5]);
    espinhos = new Array([830, 464, 20]);
    tempo = 90;
  } else {
    plataformas = new Array(
      [0, 480, 160, 60, 0, 0, 0, 0],
      [860, 480, 100, 60, 0, 0, 0, 0],
      [200, 440, 70, 16, 0, 0, 0, 0],
      [330, 390, 70, 16, 0, 0, 0, 0],
      [460, 340, 70, 16, 0, 0, 0, 0],
      [570, 290, 100, 16, 1, 570, 690, 1.2],
      [740, 250, 80, 16, 0, 0, 0, 0],
      [830, 330, 60, 16, 0, 0, 0, 0],
      [100, 330, 80, 16, 0, 0, 0, 0],
      [220, 250, 80, 16, 0, 0, 0, 0],
      [400, 230, 80, 16, 0, 0, 0, 0]
    );
    moedas = new Array([120, 290], [225, 400], [350, 350],
      [480, 300], [610, 250], [760, 210], [840, 290], [890, 440]);
    inimigos = new Array([870, 440, 860, 935, 1.5]);
    espinhos = new Array([100, 464, 20]);
    tempo = 80;
  }

  for (var i = 0; i < MAX_PLAT; i++) {
    var elemento = document.getElementById("plat" + i);
    if (i < plataformas.length) {
      platX[i] = plataformas[i][0];
      platY[i] = plataformas[i][1];
      platDir[i] = 1;
      elemento.style.width = plataformas[i][2] + "px";
      elemento.style.height = plataformas[i][3] + "px";
      elemento.style.display = "block";
      if (plataformas[i][4] != 0) {
        elemento.style.backgroundImage = "url(plataforma_movel.png)";
      } else if (plataformas[i][3] > 20) {
        elemento.style.backgroundImage = "url(chao.png)";
      } else {
        elemento.style.backgroundImage = "url(plataforma.png)";
      }
    } else {
      elemento.style.display = "none";
    }
  }
  for (var i = 0; i < MAX_MOEDAS; i++) {
    var elemento = document.getElementById("moeda" + i);
    if (i < moedas.length) {
      moedaPega[i] = false;
      elemento.style.left = moedas[i][0] + "px";
      elemento.style.top = moedas[i][1] + "px";
      elemento.style.display = "block";
    }
    else {
      elemento.style.display = "none";
    }
  }
  for (var i = 0; i < MAX_INIMIGOS; i++) {
    var elemento = document.getElementById("inimigo" + i);
    if (i < inimigos.length) {
      inimigoX[i] = inimigos[i][0];
      inimigoDir[i] = 1;
      inimigoVivo[i] = true;
      elemento.style.display = "block";
    } else {
      inimigoVivo[i] = false;
      elemento.style.display = "none";
    }
  }
  for (var i = 0; i < MAX_ESPINHOS; i++) {
      var elemento = document.getElementById("espinho" + i);
      if (i < espinhos.length) {
        elemento.style.left = espinhos[i][0] + "px";
        elemento.style.top = espinhos[i][1] + "px";
        elemento.style.width = espinhos[i][2] + "px";
        elemento.style.display = "block";
      } else {
        elemento.style.display = "none";
      }
  }
  document.getElementById("bandeira").style.backgroundImage = "url(bandeira_trancada.png)";

  px = 30;
  py = 430;
  vx = 0;
  vy = 0;
  noChao = false;
  invencivel = 60;
  contador = 0;
  coletadas = 0;
  aviso = "Fase " + fase + ": pegue todas as moedas";
  avisoTempo = 150;
}

function bate(ax, ay, al, aa, bx, by, bl, ba) {
  if (ax < bx + bl && ax + al > bx && ay < by + ba && ay + aa > by) {
    return true;
  }
  return false;
}

function mostrarTela(titulo, mensagem, cor, textoBotao) {
  document.getElementById("titulo").innerHTML = titulo;
  document.getElementById("titulo").style.color = cor;
  document.getElementById("mensagem").innerHTML = mensagem;
  document.getElementById("botao").innerHTML = textoBotao;
  document.getElementById("tela").style.display = "block";
}

function comecar() {
  vidas = 5;
  pontos = 0;
  carregarFase(1);
  document.getElementById("tela").style.display = "none";
  estado = "jogando";
}

function proximaFase() {
  vidas = Math.min(5, vidas + 1);
  carregarFase(fase + 1);
  document.getElementById("tela").style.display = "none";
  estado = "jogando";
}

function acaoBotao() {
  if (estado == "fasefim") {
    proximaFase();
  }
  else if (estado != "jogando") {
    comecar();
  }
}

function moverNuvens() {
  var empurrao = 0;
  if (estado == "jogando") {
    empurrao = vx;
  }
  for (var i = 0; i < nuvemX.length; i++) {
    nuvemX[i] = nuvemX[i] - nuvemVel[i] - empurrao * nuvemVel[i] * 0.3;
    if (nuvemX[i] < -nuvemL[i]) {
      nuvemX[i] = LARGURA;
    }
    if (nuvemX[i] > LARGURA) nuvemX[i] = -nuvemL[i];
    document.getElementById("nuvem" + i).style.left = nuvemX[i] + "px";
  }
}

function fimDeJogo(mensagem) {
  estado = "fim";
  mostrarTela("VOCE PERDEU", mensagem + "<br>Parou na fase " + fase + " com " + pontos + " pontos", "#c8402f", "DE NOVO (ou ENTER)");
}

function perderVida(cairam) {
  if (invencivel > 0 && cairam == false) {
    return;
  }
  vidas = vidas - 1;
  if (vidas <= 0) {
    fimDeJogo("Suas vidas acabaram.");
  } else {
    px = 30;
    py = 430;
    vy = 0;
    invencivel = 120;
  }
}

function atualizar() {
  if (estado != "jogando") {
    return;
  }
  if (invencivel > 0) {
    invencivel = invencivel - 1;
  }
  if (avisoTempo > 0) {
    avisoTempo = avisoTempo - 1;
  }

  contador = contador + 1;
  if (contador >= 50) {
    contador = 0;
    tempo = tempo - 1;
    if (tempo <= 0) {
      fimDeJogo("O tempo acabou.");
      return;
    }
  }

  for (var i = 0; i < plataformas.length; i++) {
    var tipo = plataformas[i][4];
    if (tipo != 0) {
      var emCima = false;
      if (noChao && py + ALTURA_JOGADOR == platY[i] && px + LARGURA_JOGADOR > platX[i] && px < platX[i] + plataformas[i][2]) {
        emCima = true;
      }
      var dx = 0;
      var dy = 0;
      if (tipo == 1) {
        dx = platDir[i] * plataformas[i][7];
        platX[i] = platX[i] + dx;
        if (platX[i] > plataformas[i][6]) {
          platDir[i] = -1;
        }
        if (platX[i] < plataformas[i][5]) {
          platDir[i] = 1;
        }
      }
      else {
        dy = platDir[i] * plataformas[i][7];
        platY[i] = platY[i] + dy;
        if (platY[i] > plataformas[i][6]) {
          platDir[i] = -1;
        }
        if (platY[i] < plataformas[i][5]) {
          platDir[i] = 1;
        }
      }
      if (emCima) {
        px = px + dx;
        py = py + dy;
      }
    }
  }

  vx = 0;
  if (direita) {
    vx = VELOCIDADE;
    olhando = 1;
  }
  if (esquerda) {
    vx = -VELOCIDADE;
    olhando = -1;
  }
  if (pulo && noChao) {
    vy = FORCA_PULO;
    noChao = false;
    if (Math.floor(Math.random() * 6) == 0) {
      giro = true;
    }
  }
  vy = vy + GRAVIDADE;

  px = px + vx;
  if (px < 0) {
    px = 0;
  }
  if (px > LARGURA - LARGURA_JOGADOR) {
    px = LARGURA - LARGURA_JOGADOR;
  }
  for (var i = 0; i < plataformas.length; i++) {
    if (bate(px, py, LARGURA_JOGADOR, ALTURA_JOGADOR, platX[i], platY[i], plataformas[i][2], plataformas[i][3])) {
      if (vx > 0) {
        px = platX[i] - LARGURA_JOGADOR;
      } else if (vx < 0) {
        px = platX[i] + plataformas[i][2];
      }
    }
  }

  py = py + vy;
  noChao = false;
  for (var i = 0; i < plataformas.length; i++) {
    if (bate(px, py, LARGURA_JOGADOR, ALTURA_JOGADOR, platX[i], platY[i], plataformas[i][2], plataformas[i][3])) {
      if (vy > 0) {
        py = platY[i] - ALTURA_JOGADOR;
        vy = 0;
        noChao = true;
      }
      else if (vy < 0) {
        py = platY[i] + plataformas[i][3];
        vy = 0;
      }
    }
  }

  if (py > ALTURA) {
    perderVida(true);
    return;
  }

  for (var i = 0; i < espinhos.length; i++) {
    if (bate(px, py, LARGURA_JOGADOR, ALTURA_JOGADOR, espinhos[i][0] + 3, espinhos[i][1] + 6, espinhos[i][2] - 6, 10)) {
      fimDeJogo("Voc&ecirc; encostou nos espinhos.");
      return;
    }
  }

  for (var i = 0; i < moedas.length; i++) {
    if (moedaPega[i] == false && bate(px, py, LARGURA_JOGADOR, ALTURA_JOGADOR, moedas[i][0], moedas[i][1], 20, 20)) {
      moedaPega[i] = true;
      coletadas = coletadas + 1;
      pontos = pontos + 10;
      document.getElementById("moeda" + i).style.display = "none";
      if (coletadas == moedas.length) {
        document.getElementById("bandeira").style.backgroundImage = "url(bandeira_aberta.png)";
        aviso = "Bandeira liberada";
        avisoTempo = 150;
      }
    }
  }

  for (var i = 0; i < inimigos.length; i++) {
    if (inimigoVivo[i]) {
      inimigoX[i] = inimigoX[i] + inimigoDir[i] * inimigos[i][4];
      if (inimigoX[i] < inimigos[i][2]) {
        inimigoDir[i] = 1;
      }
      if (inimigoX[i] + 28 > inimigos[i][3]) {
        inimigoDir[i] = -1;
      }
      if (bate(px, py, LARGURA_JOGADOR, ALTURA_JOGADOR, inimigoX[i], inimigos[i][1], 28, 40)) {
        if (vy > 1 && py + ALTURA_JOGADOR - inimigos[i][1] < 22) {
          inimigoVivo[i] = false;
          document.getElementById("inimigo" + i).style.display = "none";
          vy = -8;
          pontos = pontos + 50;
        }
        else {
          perderVida(false);
        }
      }
    }
  }

  if (estado == "jogando" && bate(px, py, LARGURA_JOGADOR, ALTURA_JOGADOR, BANDEIRA_X, BANDEIRA_Y, 12, 120)) {
    if (coletadas < moedas.length) {
      aviso = "Bandeira trancada, faltam " + (moedas.length - coletadas) + " moedas.";
      avisoTempo = 100;
    } else {
      pontos = pontos + vidas * 100 + tempo * 5;
      if (fase < TOTAL_FASES) {
        estado = "fasefim";
        mostrarTela("FASE " + fase + " CONCLU&Iacute;DA", "Pontos: " + pontos, "#5a9e3b", "PR&Oacute;XIMA FASE (ou ENTER)");
      } else {
        estado = "vitoria";
        mostrarTela("VOCE ZEROU", "Pontua&ccedil;&atilde;o final: " + pontos + " pontos", "#e0b43a", "JOGAR DE NOVO (ou ENTER)");
      }
    }
  }
}

function desenhar() {
  animTick = animTick + 1;
  var jogador = document.getElementById("jogador");
  jogador.style.left = (px - 10) + "px";
  jogador.style.top = (py + ALTURA_JOGADOR - 50) + "px";

  if (noChao) {
    giro = false;
  }
  var folha = "ninja_parado";
  var quadro = Math.floor(animTick / 10) % 5;
  if (estado == "fim") {
    folha = "ninja_morto";
    quadro = 0;
  } else if (noChao == false && giro) {
    folha = "ninja_giro";
    quadro = Math.floor(animTick / 3) % 5;
  } else if (noChao == false) {
    folha = "ninja_pulo";
    if (vy < 0) {
      quadro = 0;
    } else {
      quadro = 1;
    }
  } else if (vx != 0) {
    folha = "ninja_correr";
    quadro = Math.floor(animTick / 4) % 6;
  }
  if (olhando == -1) {
    folha = folha + "_e";
  }
  if (folha != folhaAtual) {
    jogador.style.backgroundImage = "url(" + folha + ".png)";
    folhaAtual = folha;
  }
  jogador.style.backgroundPosition = (-quadro * 48) + "px 0px";
  if (invencivel > 0 && Math.floor(invencivel / 5) % 2 == 0) {
    jogador.style.visibility = "hidden";
  } else {
    jogador.style.visibility = "visible";
  }
  for (var i = 0; i < plataformas.length; i++) {
    document.getElementById("plat" + i).style.left = platX[i] + "px";
    document.getElementById("plat" + i).style.top = platY[i] + "px";
  }
  for (var i = 0; i < inimigos.length; i++) {
    var zumbi = document.getElementById("inimigo" + i);
    zumbi.style.left = (inimigoX[i] - 4) + "px";
    zumbi.style.top = (inimigos[i][1] - 6) + "px";
    var folhaZumbi = "zumbi_andar";
    if (inimigoDir[i] < 0) {
      folhaZumbi = "zumbi_andar_e";
    }
    if (folhaZumbi != inimigoFolha[i]) {
      zumbi.style.backgroundImage = "url(" + folhaZumbi + ".png)";
      inimigoFolha[i] = folhaZumbi;
    }
    var quadroZumbi = (Math.floor(animTick / 5) + i * 2) % 8;
    zumbi.style.backgroundPosition = (-quadroZumbi * 36) + "px 0px";
  }
  document.getElementById("placar").innerHTML = "Fase " + fase + "/" + TOTAL_FASES + " &nbsp;|&nbsp; Pontos: " + pontos +
    " &nbsp;|&nbsp; Moedas: " + coletadas + "/" + moedas.length + " &nbsp;|&nbsp; Vidas: " + vidas + " &nbsp;|&nbsp; Tempo: " + tempo;
  if (avisoTempo > 0) {
    document.getElementById("aviso").innerHTML = aviso;
  } else {
    document.getElementById("aviso").innerHTML = "";
  }
}

function jogo() {
  moverNuvens();
  atualizar();
  desenhar();
  setTimeout("jogo()", 20);
}

function teclaApertada(e) {
  var tecla = e.keyCode;
  if (tecla == 37 || tecla == 65) {
    esquerda = true;
  }
  if (tecla == 39 || tecla == 68) {
    direita = true;
  }
    if (tecla == 38 || tecla == 32 || tecla == 87) {
    pulo = true;
    }
  if (tecla == 13) {
    acaoBotao();
  }
  if (tecla >= 37 && tecla <= 40 || tecla == 32) {
    e.preventDefault();
  }
}

function teclaSolta(e) {
  var tecla = e.keyCode;
  if (tecla == 37 || tecla == 65) {
    esquerda = false;
  }
  if (tecla == 39 || tecla == 68) {
    direita = false;
  }
  if (tecla == 38 || tecla == 32 || tecla == 87) {
    pulo = false;
  }
}

function iniciarPagina() {
  carregarFase(1);
  mostrarTela("NINJA vs ZUMBIS", "Pegue as moedas, desvie dos espinhos e dos zumbis e chegue na bandeira.", "#4fa3b5", "JOGAR (ou ENTER)");
  jogo();
}

import { Component, OnInit } from '@angular/core';

interface QueueItem {
  row: number;
  col: number;
  distance: number;
}


@Component({
  selector: 'app-labirinto',
  templateUrl: './labirinto.page.html',
  styleUrls: ['./labirinto.page.scss'],
})
export class LabirintoPage implements OnInit {


  labirinto: number[][];
  avatarRow: number;
  avatarCol: number;
  vidas: number;
  numLinhas: number;
  numColunas: number;
  saidaRow: number;
  saidaCol: number;
  pontos:number =0;
  passos:number =0;



  constructor() {
this.labirinto=[];
this.avatarRow=0;
this.avatarCol=0;
this.saidaRow=0;
this.saidaCol=0;
this.vidas=3;
    this.numLinhas = 10; // Valor padrão para o número de linhas
    this.numColunas = 10; // Valor padrão para o número de colunas
  }




  ngOnInit() {
  }


  criarLabirinto() {
    if (this.numLinhas <= 0 || this.numColunas <= 0) {
      return;
    }

    this.inicializarLabirinto(this.numLinhas, this.numColunas);
  }


  inicializarLabirinto(i: number, j: number) {
    this.labirinto = [];
    this.vidas = 3; // Quantidade de vidas

    for (let row = 0; row < i; row++) {
      this.labirinto[row] = [];
      for (let col = 0; col < j; col++) {
        this.labirinto[row][col] = Math.random() < 0.1 ? 1 : 0; // 30% de chance de uma célula ser parede (1)
      }
    }

    this.adicionarMacas(5); // Quantidade de maçãs
    this.posicionarAvatar(); // Posicionar o avatar no labirinto
    this.adicionarSaida(); // Add a saidao mais longe possivel do usuario
  }

  adicionarMacas(macas: number) {
    let count = 0;
    while (count < macas) {
      const row = Math.floor(Math.random() * this.labirinto.length);
      const col = Math.floor(Math.random() * this.labirinto[0].length);
      if (this.labirinto[row][col] === 0) {
        this.labirinto[row][col] = 2; // Maçã
        count++;
      }
    }
  }

  /*
A função percorre todas as células do labirinto que estão livres (valor 0)
 e calcula a distância entre cada uma delas e a posição do avatar.
 A posição da saída é escolhida como a célula que possui a maior distância em relação ao avatar.
  */

  adicionarSaida() {
    const avatarPos = {
      row: this.avatarRow,
      col: this.avatarCol
    };

    let maxDistance = -1;
    let farthestRow = -1;
    let farthestCol = -1;

    for (let row = 0; row < this.labirinto.length; row++) {
      for (let col = 0; col < this.labirinto[row].length; col++) {
        if (this.labirinto[row][col] === 0) {
          const distance = Math.abs(row - avatarPos.row) + Math.abs(col - avatarPos.col);
          if (distance > maxDistance) {
            maxDistance = distance;
            farthestRow = row;
            farthestCol = col;
          }
        }
      }
    }

    this.labirinto[farthestRow][farthestCol] = 4; // Saída
    this.saidaRow = farthestRow;
    this.saidaCol = farthestCol;
  }



  posicionarAvatar() {
    if (!this.labirinto || this.labirinto.length === 0 || this.labirinto[0].length === 0) {
      return;
    }

    // Remover avatares existentes
    const avataresAntigos = document.getElementsByClassName('avatar');
    while (avataresAntigos.length > 0) {
      avataresAntigos[0].parentNode?.removeChild(avataresAntigos[0]);
    }

    // Encontrar a primeira célula vazia para posicionar o avatar
    for (let i = 0; i < this.labirinto.length; i++) {
      for (let j = 0; j < this.labirinto[i].length; j++) {
        if (this.labirinto[i][j] === 0) {
          this.avatarRow = i;
          this.avatarCol = j;

          // Criar e posicionar o novo avatar
          const avatar = document.createElement('ion-icon');
          avatar.setAttribute('name', 'person');
          avatar.setAttribute('class', 'avatar');
          const celulaAvatar = document.getElementById(`celula-${i}-${j}`);
          if (celulaAvatar) {
            celulaAvatar.appendChild(avatar);
          }
          return;
        }
      }
    }
  }


  moveAvatar(row: number, col: number) {
  if (!this.labirinto || this.vidas <= 0) {
    return;
  }

  if (this.labirinto[row][col] === 1) {
    // Tentativa de entrar em uma célula de parede
    return;
  }

  const rowDiff = Math.abs(row - this.avatarRow);
  const colDiff = Math.abs(col - this.avatarCol);

  if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
    if (row === this.avatarRow && col === this.avatarCol) {
      // O avatar atingiu uma parede
      this.vidas--;
      if (this.vidas === 0) {
        // O usuário perdeu todas as vidas
        alert('Você perdeu todas as vidas! Fim de jogo.');
      } else {
        alert('Você perdeu uma vida! Vidas restantes: ' + this.vidas);
      }
    } else if (this.labirinto[row][col] === 2) {
      // O avatar pegou uma maçã
      this.labirinto[row][col] = 0;
      alert('Você pegou uma maçã!');
      this.pontos++; // Aumenta a pontuação por pegar uma maçã
    }

    this.avatarRow = row;
    this.avatarCol = col;

    this.passos++; // Conta cada passo dado pelo avatar
  }
}



  reiniciar() {
    if (!this.labirinto) {
      return;
    }

    this.inicializarLabirinto(this.labirinto.length, this.labirinto[0].length);
  }

  calcularMenorCaminho() {
    if (!this.labirinto || this.vidas <= 0) {
      return;
    }

    const visited: boolean[][] = [];
    for (let i = 0; i < this.labirinto.length; i++) {
      visited[i] = [];
      for (let j = 0; j < this.labirinto[0].length; j++) {
        visited[i][j] = false;
      }
    }

    const queue: QueueItem[] = [];
    queue.push({ row: this.avatarRow, col: this.avatarCol, distance: 0 });
    visited[this.avatarRow][this.avatarCol] = true;

    while (queue.length > 0) {
      const currentItem = queue.shift();

      if (!currentItem) {
        continue;
      }

      const { row, col, distance } = currentItem;

      if (row === this.labirinto.length - 1 || col === this.labirinto[0].length - 1 || row === 0 || col === 0) {
        // O caminho mais curto para a saída foi encontrado
        alert('Caminho mais curto até a saída: ' + distance + ' passos.');
        return;
      }

      const neighbors = this.getNeighbors(row, col);
      for (const neighbor of neighbors) {
        const newRow = neighbor.row;
        const newCol = neighbor.col;
        if (this.labirinto[newRow][newCol] === 0 && !visited[newRow][newCol]) {
          queue.push({ row: newRow, col: newCol, distance: distance + 1 });
          visited[newRow][newCol] = true;
        }
      }
    }

    // Não há caminho para a saída
    alert('Não há caminho para a saída!');
  }




  calcularMenorCaminhoComMacas() {
    if (!this.labirinto || this.vidas <= 0) {
      return;
    }

    const visited: boolean[][] = [];
    for (let i = 0; i < this.labirinto.length; i++) {
      visited[i] = [];
      for (let j = 0; j < this.labirinto[0].length; j++) {
        visited[i][j] = false;
      }
    }

    const queue: QueueItem[] = [];
    queue.push({ row: this.avatarRow, col: this.avatarCol, distance: 0 });
    visited[this.avatarRow][this.avatarCol] = true;

    while (queue.length > 0) {
      const currentItem = queue.shift();

      if (!currentItem) {
        continue;
      }

      const { row, col, distance } = currentItem;

      if (this.labirinto[row][col] === 2) {
        this.pintarCaminhoComMacas(row, col, distance);
        return;
      }

      const neighbors = this.getNeighbors(row, col);
      for (const neighbor of neighbors) {
        const newRow = neighbor.row;
        const newCol = neighbor.col;
        if (!this.labirinto[newRow] || !this.labirinto[newRow][newCol]) {
          continue;
        }
        if (this.labirinto[newRow][newCol] === 0 && !visited[newRow][newCol]) {
          queue.push({ row: newRow, col: newCol, distance: distance + 1 });
          visited[newRow][newCol] = true;
        }
      }
    }

    // Não há caminho para a maçã
    alert('Não há caminho para a maçã (considerando as maçãs)!');
  }

  pintarCaminhoComMacas(row: number, col: number, distance: number) {
    while (distance > 0) {
      this.labirinto[row][col] = 3; // Pintar o caminho de verde (valor 3)

      const neighbors = this.getNeighbors(row, col);
      for (const neighbor of neighbors) {
        const newRow = neighbor.row;
        const newCol = neighbor.col;
        if (this.labirinto[newRow][newCol] === distance - 1) {
          row = newRow;
          col = newCol;
          distance--;
          break;
        }
      }
    }

    // Mensagem de sucesso
    alert('Caminho mais curto até a maçã (considerando as maçãs): ' + this.labirinto[row][col] + ' passos.');
  }

  getNeighbors(row: number, col: number): { row: number; col: number }[] {
    const neighbors: { row: number; col: number }[] = [];

    if (row > 0) {
      neighbors.push({ row: row - 1, col });
    }
    if (row < this.labirinto.length - 1) {
      neighbors.push({ row: row + 1, col });
    }
    if (col > 0) {
      neighbors.push({ row, col: col - 1 });
    }
    if (col < this.labirinto[0].length - 1) {
      neighbors.push({ row, col: col + 1 });
    }

    return neighbors;
  }

}


import { Component, OnInit } from '@angular/core';
import { PriorityQueue } from 'typescript-collections';


interface QueueItem {
  row: number;
  col: number;
  distance: number;
  path: { row: number; col: number }[];
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
  pontos: number = 0;
  passos: number = 0;
  menorCaminho: { row: number; col: number }[] = [];




  constructor() {
    this.labirinto = [];
    this.avatarRow = 0;
    this.avatarCol = 0;
    this.saidaRow = 0;
    this.saidaCol = 0;
    this.vidas = 3;
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
    this.encontrarMenorCaminho();
  }

  inicializarLabirinto(i: number, j: number) {
    this.labirinto = [];
    this.vidas = 3; // Quantidade de vidas
    this.menorCaminho = []; // Limpa o menor caminho

    for (let row = 0; row < i; row++) {
      this.labirinto[row] = [];
      for (let col = 0; col < j; col++) {
        if (row === 0 || col === 0 || row === i - 1 || col === j - 1) {
          this.labirinto[row][col] = 0; // Paredes nas laterais
        } else {
          this.labirinto[row][col] = Math.random() < 0.6 ? 1 : 0; // 30% de chance de uma célula ser parede (1)
        }
      }
    }

    this.adicionarMacas(5); // Quantidade de maçãs
    this.posicionarAvatar(); // Posicionar o avatar no labirinto
    this.adicionarSaida(); // Adicionar a saída mais longe possível do usuário
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

    const distances = this.calcularDistancias(avatarPos);

    let maxDistance = -1;
    for (let row = 0; row < this.labirinto.length; row++) {
      for (let col = 0; col < this.labirinto[row].length; col++) {
        if (this.labirinto[row][col] === 0 && distances[row][col] > maxDistance) {
          maxDistance = distances[row][col];
          this.saidaRow = row;
          this.saidaCol = col;
        }
      }
    }

    this.labirinto[this.saidaRow][this.saidaCol] = 3; // Saida
  }

  posicionarAvatar() {
    let row, col;
    do {
      row = Math.floor(Math.random() * this.numLinhas);
      col = Math.floor(Math.random() * this.numColunas);
    } while (this.labirinto[row][col] !== 0);

    this.avatarRow = row;
    this.avatarCol = col;
    this.labirinto[this.avatarRow][this.avatarCol] = 0; // Avatar
  }


  calcularDistancias(startPos: { row: number; col: number }) {
    const distances = new Array(this.labirinto.length);
    for (let row = 0; row < this.labirinto.length; row++) {
      distances[row] = new Array(this.labirinto[row].length).fill(Infinity);
    }

    distances[startPos.row][startPos.col] = 0;

    const queue: QueueItem[] = [{ row: startPos.row, col: startPos.col, distance: 0, path: [] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current) {
        continue;
      }
      const { row, col, distance, path } = current;


      if (visited.has(`${row},${col}`)) {
        continue;
      }

      visited.add(`${row},${col}`);
      distances[row][col] = distance;

      const neighbors = this.getNeighbors(row, col);
      for (const neighbor of neighbors) {
        const { newRow, newCol } = neighbor;
        const newPath = [...path, { row: newRow, col: newCol }];
        queue.push({ row: newRow, col: newCol, distance: distance + 1, path: newPath });
      }
    }

    return distances;
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
    queue.push({
      row: this.avatarRow,
      col: this.avatarCol,
      distance: 0,
      path: [{ row: this.avatarRow, col: this.avatarCol }]
    });
    visited[this.avatarRow][this.avatarCol] = true;

    const shortestPath: { row: number; col: number }[] = [];

    while (queue.length > 0) {
      const currentItem = queue.shift();

      if (!currentItem) {
        continue;
      }

      const { row, col, distance, path } = currentItem;

      if (row === this.saidaRow && col === this.saidaCol) {
        // O caminho até a saída foi encontrado
        if (!shortestPath.length || distance < shortestPath.length) {
          shortestPath.splice(0);
          shortestPath.push(...path);
        }
      }

      const neighbors = this.getNeighbors(row, col);
      for (const neighbor of neighbors) {
        const newRow = neighbor.newRow;

        const newCol = neighbor.newCol;
        if (this.labirinto[newRow][newCol] === 0 && !visited[newRow][newCol]) {
          queue.push({
            row: newRow,
            col: newCol,
            distance: distance + 1,
            path: [...path, { row: newRow, col: newCol }]
          });
          visited[newRow][newCol] = true;
        }
      }
    }

    if (shortestPath.length) {
      this.menorCaminho = shortestPath;
      this.pintarCaminho(shortestPath);
      alert('Caminho mais curto encontrado! Passos necessários: ' + shortestPath.length);
    } else {
      alert('Não há caminho para a saída!');
    }
  }

  pintarCaminho(path: { row: number; col: number }[]) {
    for (const { row, col } of path) {
      const cellId = `celula-${row}-${col}`;
      const cellElement = document.getElementById(cellId);
      if (cellElement) {
        cellElement.classList.add('caminho');
      }
    }
  }

  encontrarMenorCaminho() {
    const distances = this.calcularDistancias({ row: this.avatarRow, col: this.avatarCol });

    const start = { row: this.avatarRow, col: this.avatarCol, distance: 0, path: [] };
    const goal = { row: this.saidaRow, col: this.saidaCol };

    const bruteForcePath = this.bruteForceSearch(start, goal);
    const depthFirstPath = this.depthFirstSearch(start, goal);
    const dijkstraPath = this.dijkstraSearch(start, goal, distances);

    const paths = [bruteForcePath, depthFirstPath, dijkstraPath];

    let minLength = Infinity;
    let shortestPath: { row: number; col: number }[] = [];

    for (const path of paths) {
      if (path.length < minLength) {
        minLength = path.length;
        shortestPath = path;
      }
    }

    this.menorCaminho = shortestPath;
  }

  bruteForceSearch(start: QueueItem, goal: { row: number; col: number }) {
    const stack: QueueItem[] = [start];
    const visited = new Set<string>();
    let distance = 0;

    while (stack.length > 0) {
      const current = stack.pop();

      if (current) {
        const { row, col, path } = current;



        if (visited.has(`${row},${col}`)) {
          continue;
        }

        visited.add(`${row},${col}`);

        if (row === goal.row && col === goal.col) {
          return path;
        }

        const neighbors = this.getNeighbors(row, col);
        for (const neighbor of neighbors) {
          const { newRow, newCol } = neighbor;
          const newPath = [...path, { row: newRow, col: newCol }];
          stack.push({ row: newRow, col: newCol, distance: distance + 1, path: newPath });



        }
      }

    }

    return [];
  }

  depthFirstSearch(start: QueueItem, goal: { row: number; col: number }) {
    const stack: QueueItem[] = [start];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const current = stack.pop();
      const { row, col, path } = current!;


      if (visited.has(`${row},${col}`)) {
        continue;
      }

      visited.add(`${row},${col}`);

      if (row === goal.row && col === goal.col) {
        return path;
      }

      const neighbors = this.getNeighbors(row, col);
      for (const neighbor of neighbors) {
        const { newRow, newCol } = neighbor;
        const newPath = [...path, { row: newRow, col: newCol }];
        stack.push({ row: newRow, col: newCol, distance: 0, path: newPath });

      }
    }

    return [];
  }

  dijkstraSearch(start: QueueItem, goal: { row: number; col: number }, distances: number[][]) {
    const queue = new PriorityQueue<QueueItem>((a, b) => a.distance - b.distance);
    queue.enqueue(start);

    const visited = new Set<string>();

    while (!queue.isEmpty()) {
      const current = queue.dequeue();
      if (!current) {
        continue;
      }

      const { row, col, distance, path } = current;

      if (visited.has(`${row},${col}`)) {
        continue;
      }

      visited.add(`${row},${col}`);

      if (row === goal.row && col === goal.col) {
        return path;
      }

      const neighbors = this.getNeighbors(row, col);
      for (const neighbor of neighbors) {
        const { newRow, newCol } = neighbor;
        const newPath = [...path, { row: newRow, col: newCol }];
        const newDistance = distance + 1 + distances[newRow][newCol];
        queue.enqueue({ row: newRow, col: newCol, distance: newDistance, path: newPath });
      }
    }

    return [];
  }

  getNeighbors(row: number, col: number) {
    const neighbors = [];
    const directions = [
      { row: -1, col: 0 }, // Up
      { row: 1, col: 0 }, // Down
      { row: 0, col: -1 }, // Left
      { row: 0, col: 1 }, // Right
    ];

    for (const direction of directions) {
      const newRow = row + direction.row;
      const newCol = col + direction.col;
      if (
        newRow >= 0 &&
        newRow < this.labirinto.length &&
        newCol >= 0 &&
        newCol < this.labirinto[0].length &&
        this.labirinto[newRow][newCol] !== 1
      ) {
        neighbors.push({ newRow, newCol });
      }
    }

    return neighbors;
  }

}


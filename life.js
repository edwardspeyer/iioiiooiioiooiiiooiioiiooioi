// vim: ft=javascript

/*

Any live cell with fewer than two live neighbours dies, as if by
underpopulation.

Any live cell with two or three live neighbours lives on to the next
generation.

Any live cell with more than three live neighbours dies, as if by
overpopulation.

Any dead cell with exactly three live neighbours becomes a live cell, as if by
reproduction.

*/

const Grid = document.getElementById('grid');

const Offsets = [
  [-1, -1], [ 0, -1], [+1, -1],
  [-1,  0], /* me! */ [+1,  0],
  [-1, +1], [ 0, +1], [+1, +1],
]

const _ = null;
const I = 'i';
const O = 'o';

function build(grid, size) {
  let cells = [];
  let [width, height] = size;
  for (let y = 0; y < height; y++) {
    let row = document.createElement('tr');
    grid.appendChild(row);
    for (let x = 0; x < height; x++) {
      let cell = document.createElement('td');
      row.appendChild(cell);
      cells.push(cell);
    }
  }
  return cells;
}

function render(state, cells) {
  state.forEach((v, i) => {
    if (v) {
      cells[i].style = 'background: #777;'
    } else {
      cells[i].style = '';
    }
  });
  return state;
}

function tick(state0, size) {
  let [width, height] = size;
  let state1 = state0.map(() => null);

  for (let i = 0; i < width * height; i++) {
    let x = i % width, y = Math.floor(i / width);

    let n = {};
    Offsets.forEach(pair => {
      let [dx, dy] = pair;
      let j = (x + dx) + (y + dy) * width;
      let s = state0[j] || null;
      n[s] = (n[s] || 0) + 1;
    });

    if (state0[i]) {
      if (n[I] >= 2 && n[I] <= 3) {
        state1[i] = I;
      } else {
        state1[i] = null;
      }
    } else {
      if (n[I] == 3) {
        state1[i] = I;
      }
    }
  }

  return state1;
}

function random(state0, density) {
  let state1 = state0.map(v => {
    if (v) {
      return v;
    } else if (Math.random() <= density) {
      return I;
    }
  });
  return state1;
}


let size = [60, 60];
let cells = build(grid, size); 
let state = cells.map(() => null);
state = random(state, 0.5);
render(state, cells);

window.setInterval(() => state = render(tick(state, size), cells), 1000/24);

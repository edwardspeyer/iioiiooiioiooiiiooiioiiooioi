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

const Cells = Array.prototype.slice.call(grid.querySelectorAll('td'));

const Offsets = [
  [-1, -1], [ 0, -1], [+1, -1],
  [-1,  0], /* me! */ [+1,  0],
  [-1, +1], [ 0, +1], [+1, +1],
]

const _ = null;
const I = 'i';
const O = 'o';

function render(state) {
  Cells.forEach((cell, i) => {
    cell.innerHTML = state[i];
  });
}

function tick(state0) {
  let state1 = Cells.map(() => null);

  for (let i = 0; i < 256; i++) {
    let x = i % 16, y = Math.floor(i / 16);

    let n = {};
    Offsets.forEach(pair => {
      let [dx, dy] = pair;
      let j = (x + dx) + (y + dy) * 16;
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

function random(density) {
  let state = Cells.map(() => null);
  for (let i = 0; i < 256; i++) {
    if (Math.random() <= density) {
      state[i] = I;
    }
  }
  return state;
}


let state = random(0.5);

window.setInterval(() => {
  render(state);
  state = tick(state);
}, 1000/24)

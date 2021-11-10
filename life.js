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


function random(state0) {
  let state1 = state0.map(v => {
    if (v) {
      return v;
    } else if (Math.random() <= 0.3) {
      return I;
    } else if (Math.random() >= 0.7) {
      return O;
    }
  });
  return state1;
}


function drop(team, state0, size) {
  const density = 0.3

  let [width, height] = size;
  let r = n => Math.floor(Math.random() * n)
  let origin_x = r(width);
  let origin_y = r(height);
  let radius = width / 10;

  for (let y = origin_y - radius; y < origin_y + radius; y++) {
    for (let x = origin_x - radius; x < origin_x + radius; x++) {
      let r2 = (x - origin_x) ** 2 + (y - origin_y) ** 2;
      if (r2 <= radius ** 2) {
        if (Math.random() <= density) {
          if (x >= 0 && x < width && y >= 0 && y < height) {
            let i = x + y * width;
            state0[i] = team;
          }
        }
      }
    }
  }
}


function render(state, cells) {
  state.forEach((v, i) => {
    if (v) {
      cells[i].classList = v;
    } else {
      cells[i].className = '';
    }
  });
  return state;
}

function next(state0, size) {
  let [width, height] = size;
  let state1 = state0.map(() => null);

  for (let i = 0; i < width * height; i++) {
    let x = i % width, y = Math.floor(i / width);

    let n = {};
    Offsets.forEach(pair => {
      let [dx, dy] = pair;
      let px = x + dx, py = y + dy;
      if (px >= 0 && px < width && py >= 0 && py < height) {
        let j = px + py * width;
        let s = state0[j] || null;
        n[s] = (n[s] || 0) + 1;
      }
    });

    // Rules!
    let c = state0[i];
    if (state0[i]) {
      if (n[c] >= 2 && n[c] <= 3) {
        state1[i] = c;
      } else {
        state1[i] = null;
      }
    } else {
      if (n[I] == 3) {
        state1[i] = I;
      } else if (n[O] == 3) {
        state1[i] = O;
      }
    }
  }

  return state1;
}

let size = [30, 30];
let cells = build(grid, size);
let state = cells.map(() => null);
state = random(state);

render(state, cells);

let time = 0;

function tick() {
  if (time % 12 == 0) {
    let team;
    if (Math.random() <= 0.5) team = I;
    else team = O;
    drop(team, state, size);
  }
  state = next(state, size);
  render(state, cells);
  time += 1;
}


window.setInterval(tick, 1000/12);

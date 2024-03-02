class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.pop();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Hàm in dòng ngăn cách
function printSeperate(f) {
  f.write("_____________________________________\n");
}

// Đọc file
const fs = require("fs");
fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Không thể đọc file input.txt:", err);
    return;
  }
  const f = fs.createWriteStream("output.txt", {
    flags: "w",
    encoding: "utf-8",
  });
  const parent = {}; // phần tử trước nó
  const dict = {};
  const lines = data.trim().split("\n");
  const n = parseInt(lines[0]);
  const [start, end] = lines[1].split(" ");
  for (let i = 0; i < n; i++) {
    const elem = lines[i + 2].split(" ");
    dict[elem[0]] = elem.slice(1);
  }
  f.write("Đỉnh".padEnd(5)+" | "+ " TTK ".padEnd(10)+ " | "+" Danh sách L".padEnd(10)+"\n");
  printSeperate(f);

  const L = new Stack();
  L.push(start);
  parent[start] = "0";

  const Q = new Stack(); // Khởi tạo Q ở ngoài vòng lặp

  while (true) {
    if (L.isEmpty()) break;
    let u = L.pop();
    if (u === end) {
      f.write(u + "    | Trạng thái kết thúc\n");
      Q.push(u); // Thêm vào Q khi tìm được đỉnh kết thúc
      let temp = u;
      while (parent[u] !== "0") {
        Q.push(parent[u]);
        u = parent[u];
      }
      break;
    } else {
      if (dict.hasOwnProperty(u)) {
        f.write(u + "    | ");
        let str="";
        for (const v of dict[u]) {
          str += `${v} `;
          parent[v] = u;
          L.push(v);
        }
        f.write(str.toString().padEnd(10)+ "    |   ");
       
      }
      const L_print = L.items.map((x) => x[0]).reverse();
      const L_str = L_print.join(", ");
      f.write(L_str+"\n");
    }
  }

  if (Q.isEmpty()) {
    f.write("\nKhông có đường đi từ " + start + " đến " + end + "\n");
  } else {
    f.write("\nĐường đi từ " + start + " đến " + end + " là: ");
    while (!Q.isEmpty()) {
      f.write(Q.pop()[0]);
      if (!Q.isEmpty()) f.write("->");
    }
  }
  f.close();
});

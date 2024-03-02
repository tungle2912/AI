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

// Hàm in đường phân cách
function printSeperate(f) {
  f.write("_____________________________________________________________\n");
}

// Hàm main
const fs = require("fs");
fs.readFile("Hill_Climbing.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Không thể đọc file Hill_Climbing.txt:", err);
    return;
  }
  const f = fs.createWriteStream("Hill_Climbing_Output.txt", {
    flags: "w",
    encoding: "utf-8",
  });
  const H = {}; // trọng số mỗi đỉnh
  const parent = {}; // phần tử trước nó
  const dict = {};
  const lines = data.trim().split("\n");
  const n = parseInt(lines[0]);
  const [start, end] = lines[1].split(" ");
  for (let i = 0; i < n; i++) {
    const elem = lines[i + 2].trim().split(" ");
    dict[elem[0]] = elem.slice(1);
  }
  for (let i = 0; i < n; i++) {
    const [node, weight] = lines[i + n + 2].trim().split(" ");
    H[node] = parseInt(weight);
  }
  f.write("Đỉnh".padEnd(8)+" | "+ " TTK".padEnd(15)+" | " +" Danh sách L1".padEnd(15) + " | "+" Danh sách L".padEnd(10)+"\n");
  printSeperate(f);
  const L = new Stack();
  let L1 = [];
  L.push(start);
  parent[start] = "0";
  const Q = new Stack(); // Khởi tạo Q ở ngoài vòng lặp
  while (true) {
    if (L.isEmpty()) break;
    let u = L.pop();
    if (u === "B") {
      f.write((u+H[u]).toString().padEnd(8)+ " | Trạng thái kết thúc\n");
      Q.push(u); // Thêm vào Q khi tìm được đỉnh kết thúc
      let temp = u;
      while (parent[u] !== "0") {
        Q.push(parent[u]);
        u = parent[u];
      }
      break;
    } else {
      if (dict.hasOwnProperty(u)) {
        f.write((u+H[u]).toString().padEnd(5)+ "    |   ");
        let str="";
        for (const v of dict[u]) {
          str += `${v}${H[v]} `;
          parent[v] = u;
          L1.push(v);
        }
        f.write(str.toString().padEnd(10)+ "    |   ");
        L1.sort((a, b) => H[a] - H[b]);
        str="";
        for (const v of L1) {
          str += `${v}${H[v]} `;
        }
        f.write(str.toString().padEnd(10)+ "    |   ");
        L1.reverse(); 
        for (const v of L1) {
          L.push(v);
        }
        L1.splice(0,L1.length);
      }     
      const L_print = L.items.map((x) => x[0]).reverse();
      const L_str = L_print.join(", ");
      f.write( L_str+"\n");
    
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

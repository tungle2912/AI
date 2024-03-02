class LifoQueue {
    constructor() {
        this.queue = [];
    }

    put(item) {
        this.queue.push(item);
    }

    get() {
        return this.queue.pop();
    }

    empty() {
        return this.queue.length === 0;
    }
}

function printSeperate(f) {
    f.write("______________________________________________________________________________________________________________________________\n");
}

let arrH = {}; // mang luu giá trị ham danh gia ung voi moi dinh
let mark = {}; // key - đỉnh u, value - mang chua cac dinh v co the di toi tu dinh u va k(u, v)
let parent = {}; // parent[(v, g_v, f_v)] = (u, g_u, f_u)
let fs = require('fs');
let f = fs.readFileSync('NhanhCan.txt', 'utf8').split("\n");

// doc file va tien xu lí du lieu
let [start, end] = f.shift().split(" "); // start - trang thai dau, end - trang thai ket thuc
for (let line of f) {
    if (line === "") break;
    let parts = line.split(" ");
    if (parts.length === 2) {
        let [dinh, h] = parts;
        arrH[dinh] = parseInt(h);
    } else {
        let [u, v, k] = parts;
        if (!mark[u]) mark[u] = [];
        mark[u].push([v, parseInt(k)]);
    }
}

let outputFile = 'NhanhCanOutput.txt';
let stream = fs.createWriteStream(outputFile);

// Bat dau thuat toan
let L = new LifoQueue(); // lưu danh sách các trang thai chua xet
let Q = new LifoQueue(); // lưu danh sách cac dinh trong duong di
let res = 1e18; // do dai duong di ngan nhat
L.put([start, 0, 0]); // bộ ba gia tri: dinh, gia tri ham g, gia tri ham f
parent[[start, 0, 0]] = ['0', '0', 0];
stream.write("Dinh".padEnd(5) + " | " + "TTK".padEnd(5) + " | " + "k(u, v)".padEnd(8) + " | " + "h(v)".padEnd(5) + " | " + "g(v)".padEnd(5) + " | " + "f(v)".padEnd(5) + " | " + "".padEnd(30) + " | " + "".padEnd(30) + "\n");
printSeperate(stream);

while (true) {
    if (L.empty()) break; // ket thuc thuat toan
    let [u, g_u, f_u] = L.get();
    if (f_u >= res) continue;
    if (u === 'B') {
        if (res > g_u) {
            res = g_u;
            let L_print = L.queue.map(x => x[0] + x[2]);
            L_print.reverse();
            stream.write(u.toString().padEnd(5) + " | " + ("Tam thoi do dai duong di ngan nhat la: " + g_u.toString()).padEnd(73) + " | " + L_print.join(', ').padEnd(30) + "\n");
            printSeperate(stream);
            Q = new LifoQueue();
            Q.put([u, g_u, f_u]);
            // truy xuat lại cac dinh trong duong di
            while (parent[[u, g_u, f_u]][0] !== '0') {
                Q.put(parent[[u, g_u, f_u]]);
                [u, g_u, f_u] = parent[[u, g_u, f_u]];
            }
            continue;
        }
    }
    let L1 = [];
    if (mark[u]) { // kiem tra neu dinh u co trong mark
        let dem = 0;
        for (let [v, k] of mark[u]) {
            dem += 1;
            let g_v = g_u + k;
            let f_v = g_v + arrH[v];
            L1.push([v, g_v, f_v]);
            parent[[v, g_v, f_v]] = [u, g_u, f_u];
            if (dem > 1) {
                stream.write("".padEnd(5) + " | " + v.toString().padEnd(5) + " | " + k.toString().padEnd(8) + " | " + arrH[v].toString().padEnd(5) + " | " + g_v.toString().padEnd(5) + " | " + f_v.toString().padEnd(5) + " | " + "".padEnd(30) + " | " + "".padEnd(30) + "\n");
            } else {
                stream.write(u.toString().padEnd(5) + " | " + v.toString().padEnd(5) + " | " + k.toString().padEnd(8) + " | " + arrH[v].toString().padEnd(5) + " | " + g_v.toString().padEnd(5) + " | " + f_v.toString().padEnd(5) + " | " + "".padEnd(30) + " | " + "".padEnd(30) + "\n");
            }
            
        }
    }

    // Doan nay khong anh huong den thuat toan chi de in cho dep
    L1.sort((a, b) => a[2] - b[2]); // sap xep tang dan theo ham f
    let L1_print = L1.map(x => x[0] + x[2]);
    L1.reverse();
    for (let item of L1) {
        L.put(item);
    }
    let L_print = L.queue.map(x => x[0] + x[2]);
    L_print.reverse();
    stream.write("".padEnd(5) + " | " + "".padEnd(5) + " | " + "".padEnd(8) + " | " + "".padEnd(5) + " | " + "".padEnd(5) + " | " + "".padEnd(5) + " | " + L1_print.join(', ').padEnd(30) + " | " + L_print.join(', ').padEnd(30) + "\n");
    printSeperate(stream);
}

stream.write('\n');
if (Q.empty()) {
    stream.write(`Khong tim thay duong di tu ${start} den dinh ${end}`);
} else {
    let Q_print = Q.queue.map(x => x[0]);
    Q_print.reverse();
    if (Q_print.length > 0) {
        stream.write(`Duong di ngan nhat tu ${start} den dinh ${end} la: `);
        stream.write(Q_print.join(' -> ') + "\n");
        stream.write(`Do dai duong di ngan nhat la: ${res}`);
    }
}

stream.close();

const fs = require("fs");
const readline = require("readline");

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class FuzzyBinaryTree {
    // Переименованный класс для уточнения его назначения
    constructor() {
        this.root = null;
    }

    // Метод для добавления значения в дерево
    add(value) {
        if (!this.root) {
            this.root = new TreeNode(value);
        } else {
            this.addRecursive(this.root, value);
        }
    }

    // Рекурсивный метод для добавления значения
    addRecursive(node, value) {
        if (value <= node.value) {
            if (!node.left) {
                node.left = new TreeNode(value);
            } else {
                this.addRecursive(node.left, value);
            }
        } else {
            if (!node.right) {
                node.right = new TreeNode(value);
            } else {
                this.addRecursive(node.right, value);
            }
        }
    }

    // Метод для отображения дерева
    display() {
        this.displayRecursive(this.root, 0);
    }

    // Рекурсивный метод для отображения дерева
    displayRecursive(node, level) {
        if (node) {
            this.displayRecursive(node.right, level + 1);
            console.log(" ".repeat(level * 3) + node.value);
            this.displayRecursive(node.left, level + 1);
        }
    }
}

// Метод для вычисления центра площади
function calculateCenterOfArea(fuzzy) {
    // Расчет значений для центра площади
    const terms = fuzzy.map((data) => data[1]);
    const memberships = fuzzy.map((data) => data[0]);

    const totalSum = memberships.reduce((acc, curr) => acc + curr, 0);
    let leftSum = 0;
    const tolerance = 0.000001;

    for (let i = 0; i < memberships.length; i++) {
        if (
            Math.abs(leftSum - (totalSum - leftSum - memberships[i])) <
            tolerance
        ) {
            return terms[i];
        }
        leftSum += memberships[i];
    }

    throw new Error("Incorrect data. Method can't be used.");
}

// Метод для чтения данных из файла
function readFuzzyDataFromFile(filePath) {
    const textData = fs.readFileSync(filePath, "utf8").split("\n");
    const data = [];

    for (const strList of textData) {
        const listStrNums = strList.trim().split(" ");
        const dataList = [];

        for (let i = 0; i < listStrNums.length; i += 2) {
            const m = parseFloat(listStrNums[i]);
            if (m > 1 || m < 0) {
                throw new Error("Incorrect data of memberships.");
            }
            const t = parseInt(listStrNums[i + 1]);
            dataList.push([m, t]);
        }
        data.push(dataList);
    }

    return data;
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const prompt = (question) =>
        new Promise((resolve) => rl.question(question, resolve));

    // Путь к файлу с нечеткими числами
    let filePath = await prompt("Enter the path to the input data file: ");
    let fuzzyData = readFuzzyDataFromFile(filePath);

    // Проходим по каждому списку нечетких чисел и вычисляем центр площади
    let result = fuzzyData.map((fuzzyList) => calculateCenterOfArea(fuzzyList));

    console.log("Centers of area: ", result.join(" "));

    // Создаем экземпляр бинарного дерева
    const tree = new FuzzyBinaryTree();

    // Добавляем значения центра площади в дерево
    result.forEach((term) => tree.add(term));

    console.log("Binary tree from the obtained values:");
    tree.display();

    filePath = await prompt("Enter the path to additional data file: "); // Путь к файлу с дополнительными данными
    fuzzyData = readFuzzyDataFromFile(filePath);

    // Проходим по каждому списку дополнительных данных и вычисляем центр площади
    const inputValues = fuzzyData.map((fuzzyList) =>
        calculateCenterOfArea(fuzzyList)
    );
    console.log("Centers of area: ", inputValues.join(" "));

    // Добавляем новые значения в дерево
    inputValues.forEach((v) => tree.add(v));

    console.log("Updated binary tree:");
    tree.display();

    rl.close();
}

main();

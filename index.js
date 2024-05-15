const fs = require('fs');
const readline = require('readline');

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class FuzzyBinaryTree {
    constructor() {
        this.root = null;
    }

    add(value) {
        if (!this.root) {
            this.root = new TreeNode(value);
        } else {
            this.addRecursive(this.root, value);
        }
    }

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

    display() {
        this.displayRecursive(this.root, 0);
    }

    displayRecursive(node, level) {
        if (node) {
            this.displayRecursive(node.right, level + 1);
            console.log(' '.repeat(level * 3) + node.value);
            this.displayRecursive(node.left, level + 1);
        }
    }
}

function calculateCenterOfArea(fuzzy) {
    const terms = fuzzy.map(data => data[1]);
    const memberships = fuzzy.map(data => data[0]);

    const totalSum = memberships.reduce((acc, curr) => acc + curr, 0);
    let leftSum = 0;
    const tolerance = 0.000001;

    for (let i = 0; i < memberships.length; i++) {
        if (Math.abs(leftSum - (totalSum - leftSum - memberships[i])) < tolerance) {
            return terms[i];
        }
        leftSum += memberships[i];
    }

    throw new Error("Incorrect data. Method can't be used.");
}

function readFuzzyDataFromFile(filePath) {
    const textData = fs.readFileSync(filePath, 'utf8').split('\n');
    const data = [];

    for (const strList of textData) {
        const listStrNums = strList.trim().split(' ');
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
        output: process.stdout
    });

    const prompt = question => new Promise(resolve => rl.question(question, resolve));

    let filePath = await prompt("Enter the path to the input data file: ");
    let fuzzyData = readFuzzyDataFromFile(filePath);

    let result = fuzzyData.map(fuzzyList => calculateCenterOfArea(fuzzyList));

    console.log("Centers of area: ", result.join(" "));

    const tree = new FuzzyBinaryTree();
    result.forEach(term => tree.add(term));

    console.log("Binary tree from the obtained values:");
    tree.display();

    filePath = await prompt("Enter the path to additional data file: ");
    fuzzyData = readFuzzyDataFromFile(filePath);

    const inputValues = fuzzyData.map(fuzzyList => calculateCenterOfArea(fuzzyList));
    console.log("Centers of area: ", inputValues.join(" "));

    inputValues.forEach(v => tree.add(v));

    console.log("Updated binary tree:");
    tree.display();

    rl.close();
}

main();

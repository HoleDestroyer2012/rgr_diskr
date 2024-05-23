const fs = require("fs");
const path = require("path");

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class TreeFuzzy {
    constructor() {
        this.rootNode = null;
    }

    insert(value) {
        if (this.rootNode === null) {
            this.rootNode = new TreeNode(value);
        } else {
            this.insertRecursive(this.rootNode, value);
        }
    }

    insertRecursive(node, value) {
        if (value <= node.value) {
            if (node.left === null) {
                node.left = new TreeNode(value);
            } else {
                this.insertRecursive(node.left, value);
            }
        } else {
            if (node.right === null) {
                node.right = new TreeNode(value);
            } else {
                this.insertRecursive(node.right, value);
            }
        }
    }

    remove(value) {
        return this.removeRecursive(this.rootNode, value, null);
    }

    removeRecursive(current, value, parent) {
        if (current === null) return false;

        if (current.value === value) {
            if (current.left === null && current.right === null) {
                if (parent === null) {
                    this.rootNode = null;
                } else if (parent.left === current) {
                    parent.left = null;
                } else {
                    parent.right = null;
                }
            } else if (current.left === null || current.right === null) {
                const child =
                    current.left !== null ? current.left : current.right;
                if (parent === null) {
                    this.rootNode = child;
                } else if (parent.left === current) {
                    parent.left = child;
                } else {
                    parent.right = child;
                }
            } else {
                const successor = this.getSuccessor(current.right);
                current.value = successor.value;
                this.removeRecursive(current.right, successor.value, current);
            }
            return true;
        } else if (value < current.value) {
            return this.removeRecursive(current.left, value, current);
        } else {
            return this.removeRecursive(current.right, value, current);
        }
    }

    getSuccessor(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }

    display() {
        this.displayRecursive(this.rootNode, 0);
    }

    displayRecursive(node, level) {
        if (node !== null) {
            this.displayRecursive(node.right, level + 1);
            console.log(" ".repeat(level * 3) + node.value);
            this.displayRecursive(node.left, level + 1);
        }
    }
}

function arealCentre(terms, memberships) {
    const epsilon = 1e-5;
    let minDeviation = 9999 * memberships.length;
    let termMinDeviation = terms[0];

    for (let i = 0; i < memberships.length; i++) {
        const leftSum = memberships.slice(0, i).reduce((a, b) => a + b, 0);
        const rightSum = memberships.slice(i + 1).reduce((a, b) => a + b, 0);
        const deviation = Math.abs(rightSum - leftSum);

        if (Math.abs(rightSum - leftSum) < epsilon) {
            return terms[i];
        }

        if (deviation < minDeviation) {
            minDeviation = deviation;
            termMinDeviation = terms[i];
        }
    }

    return termMinDeviation;
}

function readData(filePath) {
    const textData = fs.readFileSync(filePath, "utf-8").split("\n");
    const parsedData = textData.map((line) =>
        line.trim().split(/\s+/).map(Number)
    );
    return parsedData;
}

function main() {
    const tree = new TreeFuzzy();
    const treePath = path.join(__dirname, "data.txt");
    const anotherPath = path.join(__dirname, "new_nodes.txt");

    let textData = readData(treePath);

    textData.forEach((content) => {
        const [a, b, c, d] = content;

        const memFunc = (x) => {
            if (x <= a || x >= d) {
                return 0;
            } else if (x >= b && x <= c) {
                return 1;
            } else if (x > a && x < b) {
                return (x - a) / (b - a);
            } else {
                return (d - x) / (d - c);
            }
        };

        const terms = Array.from({ length: d - a + 1 }, (_, i) => a + i);
        const memberships = terms.map(memFunc);

        const centre = arealCentre(terms, memberships);
        console.log(`Центр площади: ${centre}`);
        tree.insert(centre);
    });

    tree.display();

    console.log();
    console.log("Добавление:");

    textData = readData(anotherPath);

    textData.forEach((content) => {
        const [a, b, c, d] = content;

        const memFunc = (x) => {
            if (x <= a || x >= d) {
                return 0;
            } else if (x >= b && x <= c) {
                return 1;
            } else if (x > a && x < b) {
                return (x - a) / (b - a);
            } else {
                return (d - x) / (d - c);
            }
        };

        const terms = Array.from({ length: d - a + 1 }, (_, i) => a + i);
        const memberships = terms.map(memFunc);

        const centre = arealCentre(terms, memberships);
        console.log(`Центр площади: ${centre}`);
        tree.insert(centre);
    });

    tree.display();
}

main();

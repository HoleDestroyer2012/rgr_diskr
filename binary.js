let treeData = { name: "Root", children: [] };
let selectedNode = null;

document.getElementById("generateTree").addEventListener("click", () => {
    treeData = generateRandomTree("Root", 3);
    selectedNode = treeData;
    updateTree();
});

document.getElementById("addNode").addEventListener("click", () => {
    if (selectedNode) {
        addNode(selectedNode);
        updateTree();
    } else {
        alert("Please select a node to add a new node.");
    }
});

function generateRandomTree(name, depth) {
    if (depth === 0) return { name };
    const node = { name, children: [] };
    for (let i = 0; i < 2; i++) {
        if (Math.random() > 0.5 || depth === 3) {
            node.children.push(
                generateRandomTree(`${name}-${i + 1}`, depth - 1)
            );
        }
    }
    return node;
}

function addNode(parentData) {
    if (!parentData.children) {
        parentData.children = [];
    }
    const newNodeName = `Node ${parentData.children.length}`;
    const newNode = { name: newNodeName, children: [] };
    parentData.children.push(newNode);
    selectedNode = newNode;
}

function updateTree() {
    const container = d3.select("#treeVisual").html("");
    const svg = container
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");
    const treeLayout = d3.tree().size([500, 760]);
    const root = d3.hierarchy(treeData, function (d) {
        return d.children;
    });
    treeLayout(root);

    svg.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr(
            "d",
            d3
                .linkHorizontal()
                .x((d) => d.y)
                .y((d) => d.x)
        );

    const nodes = svg
        .selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.y},${d.x})`);

    nodes
        .append("circle")
        .attr("r", 10)
        .style("fill", (d) =>
            d.data === selectedNode ? "lightsteelblue" : "white"
        )
        .on("click", function (event, d) {
            event.stopPropagation();
            selectedNode = d.data;
            updateTree();
        });

    nodes
        .append("text")
        .attr("dy", "0.35em")
        .attr("x", (d) => (d.children && d.children.length > 0 ? -13 : 13))
        .style("text-anchor", (d) =>
            d.children && d.children.length > 0 ? "end" : "start"
        )
        .text((d) => d.data.name);
}

d3.select("body").on("click", () => {
    selectedNode = null;
    updateTree();
});

updateTree();

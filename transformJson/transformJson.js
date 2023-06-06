const fs = require("fs");

function transformToTree(arr) {
    const map = {};
    let node;
    const tree = [];

    for (let i = 0; i < arr.length; i += 1) {
        map[arr[i].id] = i;
        arr[i].children = [];
    }

    for (let i = 0; i < arr.length; i += 1) {
        node = arr[i];
        if (node.parentId !== undefined) {
            arr[map[node.parentId]].children.push(node);
        } else {
            tree.push(node);
        }
    }

    return tree;
}

function adjustProperties(nodes) {
    for (let node of nodes) {
        // If duration is a string, convert it to a number
        if (node?.duration && typeof node.duration === "string") {
            node.duration = parseInt(node.duration);
        }
        if (node.children.length > 0) {
            if (!node.startDate) {
                // get start date based on the children
                let grandChildMinStartDateTimeStamp = Infinity;
                node.children.forEach((grandChild) => {
                    if (grandChild.startDate) {
                        const grandChildStartDateTimeStamp = new Date(
                            grandChild.startDate
                        ).valueOf();
                        if (
                            grandChildStartDateTimeStamp <
                            grandChildMinStartDateTimeStamp
                        ) {
                            grandChildMinStartDateTimeStamp =
                                grandChildStartDateTimeStamp;
                        }
                    }
                });
                node.startDate = new Date(
                    grandChildMinStartDateTimeStamp
                ).toISOString();
            }
            adjustProperties(node.children);
        }
    }
}

// Read from input.json, transform the data, then write to output.json
fs.readFile("input.json", "utf-8", (err, data) => {
    if (err) throw err;
    const jsonData = JSON.parse(data);
    const tasks = jsonData.tasks.rows;

    const treeData = transformToTree(tasks);
    adjustProperties(treeData);

    jsonData.tasks.rows = treeData;

    // Ensure "tasks", "resources", "assignments", "dependencies", and "timeRanges" exist
    const properties = [
        "tasks",
        "resources",
        "assignments",
        "dependencies",
        "timeRanges",
    ];
    for (let prop of properties) {
        if (!jsonData.hasOwnProperty(prop)) {
            jsonData[prop] = { rows: [] };
        }
    }
    const outputData = JSON.stringify(jsonData, null, 2);

    fs.writeFile("output.json", outputData, (err) => {
        if (err) throw err;
        console.log("Tree data written to file");
    });
});

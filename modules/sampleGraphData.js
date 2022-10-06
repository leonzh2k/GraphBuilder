export const sampleGraphData = {
    nodes: [
        {
            pos: {
                x: 400,
                y: 425
            },
            name: "1"
        },

        {
            pos: {
                x: 525,
                y: 300
            },
            name: "2"
        },

        {
            pos: {
                x: 525,
                y: 550
            },
            name: "3"
        },

        {
            pos: {
                x: 690,
                y: 550
            },
            name: "4"
        },

        {
            pos: {
                x: 690,
                y: 425
            },
            name: "5"
        },

        {
            pos: {
                x: 690,
                y: 300
            },
            name: "6"
        },

        {
            pos: {
                x: 855,
                y: 300
            },
            name: "7"
        },

        {
            pos: {
                x: 975,
                y: 425
            },
            name: "8"
        },

        {
            pos: {
                x: 855,
                y: 550
            },
            name: "9"
        },
    ],

    edges: {
        "1": [{node: "2", weight: 4}, {node: "3", weight: 8}],
        "2": [{node: "3", weight: 11}, {node: "6", weight: 8}],
        "3": [{node: "5", weight: 7}, {node: "4", weight: 1}],
        "4": [{node: "5", weight: 6}, {node: "9", weight: 2}],
        "5": [{node: "6", weight: 2}],
        "6": [{node: "7", weight: 7}, {node: "9", weight: 4}],
        "7": [{node: "8", weight: 9}, {node: "9", weight: 14}],
        "8": [{node: "9", weight: 10}],
        "9": [],
    }
};
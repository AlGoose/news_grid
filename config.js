const TEMPLATES = [
    {
        pattern: [
            ['t']
        ],
        imageType: 'q'
    },
    {
        pattern: [
            ['t', 'i']
        ],
        imageType: 'q'
    },
    {
        pattern: [
            ['i', 't']
        ],
        imageType: 'q'
    },
    {
        pattern: [
            ['i', 'i', 't']
        ],
        imageType: 'h'
    },
    {
        pattern: [
            ['t', 'i', 'i']
        ],
        imageType: 'h'
    },
    {
        pattern: [
            ['i'],
            ['t']
        ],
        imageType: 'q'
    },
    {
        pattern: [
            ['i', 't'],
            ['i', 't']
        ],
        imageType: 'v'
    },

    {
        pattern: [
            ['t', 'i'],
            ['t', 'i']
        ],
        imageType: 'v'
    },
    {
        pattern: [
            ['i', 'i'],
            ['.', 't']
        ],
        imageType: 'h'
    },
    {
        pattern: [
            ['i', 'i'],
            ['t', '.']
        ],
        imageType: 'h'
    },
    {
        pattern: [
            ['t', 'i'],
            ['.', 'i']
        ],
        imageType: 'v'
    },
    {
        pattern: [
            ['i', 't'],
            ['i', '.']
        ],
        imageType: 'v'
    },
];

const GRID_SETTINGS = [
    {
        itemsPerRow: 3,
        rowsCount: 6,
        width: [0,1330]
    },
    {
        itemsPerRow: 4,
        rowsCount: 5,
        width: [1330, 1665]
    },
    {
        itemsPerRow: 5,
        rowsCount: 4,
        width: [1665, 2000]
    },
    {
        itemsPerRow: 6,
        rowsCount: 3,
        width: [2000, Number.MAX_SAFE_INTEGER]
    }
]
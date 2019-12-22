//TODO: Сделать конфиг с шаблонами и размерами возможных сеток
const TEMPLATES = [
    {
        pattern: ['t'],
        imageType: 0
    },
    {
        pattern: ['t', 'i'],
        imageType: 0
    },
    {
        pattern: ['i', 't'],
        imageType: 0
    },
    {
        pattern: ['i', 'i', 't'],
        imageType: 2
    },
    {
        pattern: ['t', 'i', 'i'],
        imageType: 2
    },
    {
        pattern: [
            ['i'],
            ['t']
        ],
        imageType: 0
    },
    {
        pattern: [
            ['i', 't'],
            ['i', 't']
        ],
        imageType: 1
    },
    {
        pattern: [
            ['t', 'i'],
            ['t', 'i']
        ],
        imageType: 1
    },
];

const GRID_SETTINGS = [
    {
        itemsPerRow: 3,
        rowsCount: 6,
        width: [0,1200]
    },
    {
        itemsPerRow: 4,
        rowsCount: 5,
        width: [1200, 1440]
    },
    {
        itemsPerRow: 5,
        rowsCount: 4,
        width: [1440, Number.MAX_SAFE_INTEGER]
    },
]
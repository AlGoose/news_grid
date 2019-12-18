let TEMPLATES = [
    {
        schema: ['t'],
        imageType: 0
    },
    {
        schema: ['t', 'i'],
        imageType: 0
    },
    {
        schema: ['i', 't'],
        imageType: 0
    },
    {
        schema: ['i', 'i', 't'],
        imageType: 0
    },
    {
        schema: ['t', 'i', 'i'],
        imageType: 0
    },
    {
        schema: [
            ['i'],
            ['t']
        ],
        imageType: 0
    },
    {
        schema: [
            ['i', 't'],
            ['i', 't']
        ],
        imageType: 0
    },
    {
        schema: [
            ['t', 'i'],
            ['t', 'i']
        ],
        imageType: 0
    },
]

let NEWS = [
    {
        id: 1,
    },
    {
        id: 2,
    },
    {
        id: 3,
    },
    {
        id: 4,
    },
    {
        id: 5,
    },
    {
        id: 6,
    },
    {
        id: 7,
    },
    {
        id: 8,
    },
    {
        id: 9,
    },
    {
        id: 10,
    },
];

function srand(seed) {
    if (typeof seed === 'string') {
        str = seed;
        seed = 0xFF;
        for (let i = 0; i < str.length; i++) {
            seed ^= str.charCodeAt(i);
        }
    }

    return function (min, max) {
        max = max || 1;
        min = min || 0;
        seed = (seed * 9301 + 49297) % 233280;

        return min + (seed / 233280) * (max - min);
    }
}

function gridArrayToGridString(gridTemplate) {
    let gridString = '';

    for (let i = 0; i < gridTemplate.length; i++) {
        let rowString = "'" + gridTemplate[i].join(' ') + "'";
        gridString += rowString + '\n';
    }

    return gridString;
}

function arrayToGridArray(columnsCount, rowsCount) {
    let gridTemplate = new Array(rowsCount);
    for (let i = 0; i < rowsCount; i++) {
        gridTemplate[i] = new Array(columnsCount).fill('.');
    }

    let allowTemplates = [];
    let newsCurrentIndex = 0;
    let newsCount = NEWS.length;
    let isNewsGone = false;

    for (let gridTemplateRow = 0; gridTemplateRow < gridTemplate.length; gridTemplateRow++) {
        for (let gridTemplateColumn = 0; gridTemplateColumn < gridTemplate[gridTemplateRow].length; gridTemplateColumn++) {
            if (gridTemplate[gridTemplateRow][gridTemplateColumn] !== '.') continue;

            allowTemplates = TEMPLATES.filter(template => {
                let isFree = true;
                
                if (typeof (template.schema[0]) === 'object') {
                    if (!(gridTemplateRow + template.schema.length <= gridTemplate.length && gridTemplateColumn + template.schema[0].length <= gridTemplate[gridTemplateRow].length)) {
                        return false;
                    }

                    for (let n = 0; n < template.schema.length; n++) {
                        for (let m = 0; m < template.schema[0].length; m++) {
                            if (gridTemplate[gridTemplateRow + n][gridTemplateColumn + m] !== '.') {
                                isFree = false;
                            }
                        }
                    }
                } else {
                    if (!(gridTemplateColumn + template.schema.length <= gridTemplate[gridTemplateRow].length)) {
                        return false;
                    }

                    for (let m = 0; m < template.schema[0].length; m++) {
                        if (gridTemplate[gridTemplateRow][gridTemplateColumn + m] !== '.') {
                            isFree = false;
                        }
                    }
                }

                return isFree;
            })

            if (newsCurrentIndex < newsCount) {
                let rand = srand(NEWS[newsCurrentIndex].id);
                let num = Math.trunc(rand(0, allowTemplates.length - 1));
                let template = allowTemplates[num];

                if (typeof (template.schema[0]) === 'object') {
                    for (let n = 0; n < template.schema.length; n++) {
                        for (let m = 0; m < template.schema[0].length; m++) {
                            gridTemplate[gridTemplateRow + n][gridTemplateColumn + m] = template.schema[n][m] + NEWS[newsCurrentIndex].id;
                        }
                    }
                } else {
                    for (let m = 0; m < template.schema.length; m++) {
                        gridTemplate[gridTemplateRow][gridTemplateColumn + m] = template.schema[m] + NEWS[newsCurrentIndex].id;
                    }
                }

                newsCurrentIndex++;
            } else {
                isNewsGone = true;
            }

            allowTemplates = [];

            if (isNewsGone) {
                break;
            }
        }
        if (isNewsGone) {
            break;
        }
    }

    return gridTemplate;
}

let gridArray = arrayToGridArray(5, 4);
let gridString = gridArrayToGridString(gridArray);
console.log(gridString);

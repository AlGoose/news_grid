new Vue({
    el: '#app',
    data: {
        templates: [
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
                imageType: 0
            },
            {
                pattern: ['t', 'i', 'i'],
                imageType: 0
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
                imageType: 0
            },
            {
                pattern: [
                    ['t', 'i'],
                    ['t', 'i']
                ],
                imageType: 0
            },
        ],
        news: [
            {
                id: 1,
                isActive: false,
            },
            {
                id: 2,
                isActive: false,
            },
            {
                id: 3,
                isActive: false,
            },
            {
                id: 4,
                isActive: false,
            },
            {
                id: 5,
                isActive: false,
            },
            {
                id: 6,
                isActive: false,
            },
            {
                id: 7,
                isActive: false,
            },
            {
                id: 8,
                isActive: false,
            },
            {
                id: 9,
                isActive: false,
            },
            {
                id: 10,
                isActive: false,
            },
            {
                id: 11,
                isActive: false,
            },
            {
                id: 12,
                isActive: false,
            },
            {
                id: 13,
                isActive: false,
            },
            {
                id: 14,
                isActive: false,
            },
            {
                id: 15,
                isActive: false,
            },
            {
                id: 16,
                isActive: false,
            },
            {
                id: 17,
                isActive: false,
            },
            {
                id: 18,
                isActive: false,
            },
            {
                id: 19,
                isActive: false,
            },
            {
                id: 20,
                isActive: false,
            }
        ],
        blocksCount: 1,
        isNewsGone: false,
        windowWidth: 0,
        gridColumnsCount:5,
        gridRowsCount:4,
    },

    created: function () {
        this.windowWidth = document.documentElement.clientWidth;
        window.addEventListener('resize', this.resize);
    },
    watch: {
        windowWidth(oldValue, newValue) {

            if (newValue <= 1280) {
                this.gridColumnsCount = 3;
                this.gridRowsCount = 6;

            }

            if (newValue > 1280 && newValue <= 1440) {
                this.gridColumnsCount = 4;
                this.gridRowsCount = 5;
            }

            if (newValue > 1440) {
                this.gridColumnsCount = 5;
                this.gridRowsCount = 4;
            }
        }
    },
    computed: {
        gridStyle() {
            return {
                'grid-template-areas': this.gridTemplateAreas,
            }
        },

        activeNews: function () {
            return this.news.filter((item) => {
                return item.isActive;
            });
        },




        gridTemplateAreas: function () {
            return gridArrayToGridString(this.gridArray);
        },

        gridArray: function () {
            console.log("Here", this);
            // debugger;
            let resultGrid = [];
            let newsCount = this.news.length;
            let newsCurrentIndex = 0;
            this.isNewsGone = false;

            this.news.forEach(element => {
                if (element.isActive) {
                    element.isActive = false;
                }
            });

            for (let i = 0; i < this.blocksCount; i++) {
                let block = new Array(this.gridRowsCount);
                for (let i = 0; i < this.gridRowsCount; i++) {
                    block[i] = new Array(this.gridColumnsCount).fill('.');
                }

                let allowTemplates = [];

                for (let blockRow = 0; blockRow < this.gridRowsCount; blockRow++) {
                    for (let blockColumn = 0; blockColumn < this.gridColumnsCount; blockColumn++) {
                        if (block[blockRow][blockColumn] !== '.') continue;

                        /** Создаем массив, подходящих на данную позицию, шаблонов */
                        allowTemplates = this.templates.filter(template => {
                            return isPatternApproach(block, template.pattern, blockRow, blockColumn);
                        });

                        /**Смотрим есть ли новость в пуле */
                        if (newsCurrentIndex < newsCount) {
                            /** Выбираем шаблон */
                            let rand = this.srand(this.news[newsCurrentIndex].id);
                            let num = Math.trunc(rand(0, allowTemplates.length - 1));
                            let template = allowTemplates[num];

                            /** Добавляем выбранный шаблон */
                            addPatternToGridArray(block, template.pattern, blockRow, blockColumn, this.news[newsCurrentIndex].id);

                            this.news[newsCurrentIndex].template = template;
                            this.news[newsCurrentIndex].imageExist = this.news[newsCurrentIndex].template.pattern.flat().includes('i');
                            this.news[newsCurrentIndex].isActive = true;
                            newsCurrentIndex++;
                        } else {
                            this.isNewsGone = true;
                        }

                        if (this.isNewsGone) {
                            break;
                        }
                    }
                    if (this.isNewsGone) {
                        break;
                    }
                }

                resultGrid = resultGrid.concat(block);
            }

            return resultGrid;
        }
    },

    methods: {
        srand: function (seed) {
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
                seed = (seed * 2 * 9301 + 49297) % 233280;

                return min + (seed / 233280) * (max - min);
            }
        },

        resize: function () {
            clearTimeout(this.timerDebounce);
            this.timerDebounce = setTimeout(() => {
                this.windowWidth = document.documentElement.clientWidth;
            }, 300);
        },

        addBlock: function () {
            if (this.isNewsGone) return;
            this.blocksCount++;
        }
    }
})
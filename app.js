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
        gridTemplate: "",
        newsCurrentIndex: 0,
        blocksCount: 1,
        windowWidth: 1920, // в эту переменную будем записывать ширину окна. Она нужна чтобы за ней установить слежение т.к. изменения document.documentElement.clientWidth vue не отслеживает.
        isNewsGone: false
    },

    created: function () {
        window.addEventListener('resize', this.resize);
    },

    destroyed: function () {
        // window.removeEventListener('resize', this.resize);
        // window.addEventListener('scroll', this.scroll);
    },

    computed: {
/*вот теперь это выглядит непонятно. Но по сути так написавть правильно. Возвращать не строку а объект, и назвать его по смыслу. А то вдруг что то еще будет меняться кроме grid-template-areas*/
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
/* следующие 2 метода просятся на переделку. слишком схожий код. может быть мы даже зря вынесли его в computed*/
        gridColumnsCount: function () {
            if (this.windowWidth <= 1280) {
                return 3;
            }

            if (this.windowWidth > 1280 && this.windowWidth <= 1440) {
                return 4;
            }

            if (this.windowWidth > 1440) {
                return 5;
            }
        },
        gridRowsCount: function () {
            if (this.windowWidth <= 1280) {
                return 6;
            }

            if (this.windowWidth > 1280 && this.windowWidth <= 1440) {
                return 5;
            }

            if (this.windowWidth > 1440) {
                return 4;
            }
        },
/**Этот метод ничего не делает.*/
        gridTemplateAreas: function () {
            return gridArrayToGridString(this.gridArray);
        },

        gridArray: function () {
            // debugger;
            let resultGrid = [];

            for (let i = 0; i < this.blocksCount; i++) {
                let block = new Array(this.gridRowsCount);
                for (let i = 0; i < this.gridRowsCount; i++) {
                    block[i] = new Array(this.gridColumnsCount).fill('.');
                }

                let allowTemplates = [];
                let newsCount = this.news.length;
                // let isNewsGone = false;

                for (let blockRow = 0; blockRow < this.gridRowsCount; blockRow++) {
                    for (let blockColumn = 0; blockColumn < this.gridColumnsCount; blockColumn++) {
                        if (block[blockRow][blockColumn] !== '.') continue;

                        /** Создаем массив, подходящих на данную позицию, шаблонов */
                        allowTemplates = this.templates.filter(template => {
                            return isPatternApproach(block, template.pattern, blockRow, blockColumn);
                        });

                        /**Смотрим есть ли новость в пуле */
                        if (this.newsCurrentIndex < newsCount) {
                            /** Выбираем шаблон */
                            let rand = this.srand(this.news[this.newsCurrentIndex].id);
                            let num = Math.trunc(rand(0, allowTemplates.length - 1));
                            let template = allowTemplates[num];

                            /** Добавляем выбранный шаблон */
                            addPatternToGridArray(block, template.pattern, blockRow, blockColumn, this.news[this.newsCurrentIndex].id);

                            this.news[this.newsCurrentIndex].template = template;
                            this.news[this.newsCurrentIndex].imageExist = this.news[this.newsCurrentIndex].template.pattern.flat().includes('i');
                            this.news[this.newsCurrentIndex].isActive = true;
                            this.newsCurrentIndex++;
                        } else {
                            this.isNewsGone = true;
                        }

                        allowTemplates = [];

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

        /** Перерисовка сети при изменении размеров окна */
        // resize: function () {
        //     // debugger;
        //     if (document.documentElement.clientWidth <= 1280) {
        //         console.log("3x6 MODE");
        //         this.gridColumnsCount = 3;
        //         this.gridRowsCount = 6;
        //     }

        //     if (document.documentElement.clientWidth > 1280 && document.documentElement.clientWidth <= 1440) {
        //         console.log("4x5 MODE");
        //         this.gridColumnsCount = 4;
        //         this.gridRowsCount = 5;
        //     }

        //     if (document.documentElement.clientWidth > 1440) {
        //         console.log("5x4 MODE");
        //         this.gridColumnsCount = 5;
        //         this.gridRowsCount = 4;
        //     }

        //     /** Высчитываем ~новый размер сетки и перерисовываем */
        //     let total = this.currentHeight * this.currentWidth;
        //     let blockSize = this.gridColumnsCount * this.gridRowsCount;
        //     let newGridRowsCount = Math.round(total / blockSize) * this.gridRowsCount;

        //     this.newsCurrentIndex = 0;
        //     this.currentHeight = newGridRowsCount;
        //     this.currentWidth = this.gridColumnsCount;

        //     this.news.forEach(element => {
        //         if (element.isActive) {
        //             element.isActive = false;
        //         }
        //     });
        //     this.stop = false;
        //     // debugger;
        //     this.renderGrid(this.gridColumnsCount, newGridRowsCount);
        //     let elem = document.getElementsByClassName('grid')[0];
        //     elem.style.cssText =
        //         `grid-template-areas: ${this.gridTemplate};
        //             grid-template-rows: repeat(${this.currentHeight}, 300px);`;
        // },

        resize: function () {
            clearTimeout(this.timerDebounce);
            this.timerDebounce = setTimeout(() => {
                console.log('RENDER');
                this.windowWidth = document.documentElement.clientWidth;
            }, 500);
        },

        addBlock: function () {
            if (this.isNewsGone) return;

            this.newsCurrentIndex = 0;
            this.news.forEach(element => {
                if (element.isActive) {
                    element.isActive = false;
                }
            });
            this.blocksCount++;

            console.log(this.blocksCount);
        }
    }
})
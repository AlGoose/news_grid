let app = new Vue({
    el: '#app',
    data: {
        timerDebounce: 0,
        gridCount: 1,
        templates: [
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
                imageType: 1
            },
            {
                schema: ['t', 'i', 'i'],
                imageType: 1
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
                imageType: 2
            },
            {
                schema: [
                    ['t', 'i'],
                    ['t', 'i']
                ],
                imageType: 2
            },
        ],
        news: [
            {
                id: 1,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']

            },
            {
                id: 2,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 3,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 4,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']

            },
            {
                id: 5,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']

            },
            {
                id: 6,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 7,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 8,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 9,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 10,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 11,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 12,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 13,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 14,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 15,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 16,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 17,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 18,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 19,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            },
            {
                id: 20,
                isActive: false,
                images:['https://picsum.photos/325/300','https://picsum.photos/660/300','https://picsum.photos/325/610']
            }
        ],
        gridTemplate: "", // перенести в computed
        newsCurrentIndex: 0,
        stop: false,

        currentHeight: 0,// перенести в computed
        currentWidth: 0// перенести в computed
    },

    created: function () {
        showAlert('dsf')
        window.addEventListener('resize', this.resize);
        /*       window.addEventListener('scroll', this.scroll);
  */
        if (document.documentElement.clientWidth <= 1280) {
            console.log("3x6 MODE");
            // this.gridColumnsCount = 3;
            this.gridRowsCount = 6;
            this.currentHeight = 6;
            this.currentWidth = 3;
            this.renderGrid(this.gridColumnsCount, this.gridRowsCount);
        }

        if (document.documentElement.clientWidth > 1280 && document.documentElement.clientWidth <= 1440) {
            console.log("4x5 MODE");
            //   this.gridColumnsCount = 4;
            this.gridRowsCount = 5;
            this.currentHeight = 5;
            this.currentWidth = 4;
            this.renderGrid(this.gridColumnsCount, this.gridRowsCount);
        }

        if (document.documentElement.clientWidth > 1440) {
            console.log("5x4 MODE");
            //  this.gridColumnsCount = 5;
            this.gridRowsCount = 4;
            this.currentHeight = 4;
            this.currentWidth = 5;
            this.renderGrid(this.gridColumnsCount, this.gridRowsCount);
        }
    },

    destroyed: function () {
        window.removeEventListener('resize', this.resize);
        /*   window.addEventListener('scroll', this.scroll);*/
    },

    computed: {
        gridRowsCountAll() {
            return this.gridRowsCount * this.gridCount;
        },
        gridTemplate: function () {
            return this.gridArrayToGridString(this.gridArray);
        },
        gridArray: function () {
            let gridTemplate = new Array(this.gridRowsCountAll);
            for (let i = 0; i < this.gridRowsCount; i++) {
                gridTemplate[i] = new Array(this.gridColumnsCount).fill('.');
            }

            let allowTemplates = [];
            let newsCount = this.news.length;
            let isNewsGone = false;

            /** Обходим каждый элемент сетки (двумерный массив) */
            for (let gridTemplateRow = 0; gridTemplateRow < gridTemplate.length; gridTemplateRow++) {
                for (let gridTemplateColumn = 0; gridTemplateColumn < gridTemplate[gridTemplateRow].length; gridTemplateColumn++) {
                    if (gridTemplate[gridTemplateRow][gridTemplateColumn] !== '.') continue;

                    /** Создаем массив, подходящих на данную позицию, шаблонов */
                    allowTemplates = this.templates.filter(template => {
                        let isFree = true;

                        /** Проверяем подходит ли шаблон по размерам */
                        if (typeof (template.schema[0]) === 'object') {
                            if (!(gridTemplateRow + template.schema.length <= gridTemplate.length && gridTemplateColumn + template.schema[0].length <= gridTemplate[gridTemplateRow].length)) {
                                return false;
                            }

                            /** Проверям не пересекается ли шаблон с другими элементами */
                            for (let n = 0; n < template.schema.length; n++) {
                                for (let m = 0; m < template.schema[0].length; m++) {
                                    if (gridTemplate[gridTemplateRow + n][gridTemplateColumn + m] !== '.') {
                                        isFree = false;
                                    }
                                }
                            }
                        } else {
                            /** Аналогичное действие для одномерных шаблонов */
                            if (!(gridTemplateColumn + template.schema.length <= gridTemplate[gridTemplateRow].length)) {
                                return false;
                            }

                            for (let m = 0; m < template.schema.length; m++) {
                                if (gridTemplate[gridTemplateRow][gridTemplateColumn + m] !== '.') {
                                    isFree = false;
                                }
                            }
                        }

                        return isFree;
                    });

                    /**Смотрим есть ли новость в пуле */
                    if (this.newsCurrentIndex < newsCount) {
                        /** Выбираем шаблон */
                        let rand = this.srand(this.news[this.newsCurrentIndex].id);
                        let num = Math.trunc(rand(0, allowTemplates.length - 1));
                        let template = allowTemplates[num];

                        /** Добавляем выбранный шаблон */
                        if (typeof (template.schema[0]) === 'object') {
                            for (let n = 0; n < template.schema.length; n++) {
                                for (let m = 0; m < template.schema[0].length; m++) {
                                    gridTemplate[gridTemplateRow + n][gridTemplateColumn + m] = template.schema[n][m] + this.news[this.newsCurrentIndex].id;
                                }
                            }
                        } else {
                            for (let m = 0; m < template.schema.length; m++) {
                                gridTemplate[gridTemplateRow][gridTemplateColumn + m] = template.schema[m] + this.news[this.newsCurrentIndex].id;
                            }
                        }
                        this.news[this.newsCurrentIndex].template = template;

                        this.news[this.newsCurrentIndex].isActive = true;
                        this.newsCurrentIndex++;
                    } else {
                        isNewsGone = true;
                        this.stop = true;
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

        },
        gridColumnsCount: function () {
            if (document.documentElement.clientWidth <= 1280) {

                return 3;

            }

            if (document.documentElement.clientWidth > 1280 && document.documentElement.clientWidth <= 1440) {

                return 4;

            }

            if (document.documentElement.clientWidth > 1440) {

                return 5;

            }
        },
        gridRowsCount: function () {
            if (document.documentElement.clientWidth <= 1280) {

                return 6;

            }

            if (document.documentElement.clientWidth > 1280 && document.documentElement.clientWidth <= 1440) {

                return 5;

            }

            if (document.documentElement.clientWidth > 1440) {

                return 4;

            }
        },
        grid_template_areas: function () {
            return "grid-template-areas: " + this.gridTemplate;
        },

        activeNews: function () {
            return this.news.filter((item) => {
                return item.isActive;
            });
        },
    },

    methods: {
        /** Проверяем есть ли картинка в сетке, чтоб лишний блок не отрисовывался */
        isExist: function (item) {
            console.log(item.template.schema, item.template.schema.flat())
            return
        },

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

        /**Переводим сетку из двумерного массива в строку */
        gridArrayToGridString: function (gridTemplate) {
            let gridString = '';

            for (let i = 0; i < gridTemplate.length; i++) {
                let rowString = "'" + gridTemplate[i].join(' ') + "'";
                gridString += rowString + ' ';
            }
            return gridString;
        },

        /**Создаем сетку в виде двумерного массива */
        arrayToGridArray: function (columnsCount, rowsCount) {
            let gridTemplate = new Array(rowsCount);
            for (let i = 0; i < rowsCount; i++) {
                gridTemplate[i] = new Array(columnsCount).fill('.');
            }

            let allowTemplates = [];
            let newsCount = this.news.length;
            let isNewsGone = false;

            /** Обходим каждый элемент сетки (двумерный массив) */
            for (let gridTemplateRow = 0; gridTemplateRow < gridTemplate.length; gridTemplateRow++) {
                for (let gridTemplateColumn = 0; gridTemplateColumn < gridTemplate[gridTemplateRow].length; gridTemplateColumn++) {
                    if (gridTemplate[gridTemplateRow][gridTemplateColumn] !== '.') continue;

                    /** Создаем массив, подходящих на данную позицию, шаблонов */
                    allowTemplates = this.templates.filter(template => {
                        let isFree = true;

                        /** Проверяем подходит ли шаблон по размерам */
                        if (typeof (template.schema[0]) === 'object') {
                            if (!(gridTemplateRow + template.schema.length <= gridTemplate.length && gridTemplateColumn + template.schema[0].length <= gridTemplate[gridTemplateRow].length)) {
                                return false;
                            }

                            /** Проверям не пересекается ли шаблон с другими элементами */
                            for (let n = 0; n < template.schema.length; n++) {
                                for (let m = 0; m < template.schema[0].length; m++) {
                                    if (gridTemplate[gridTemplateRow + n][gridTemplateColumn + m] !== '.') {
                                        isFree = false;
                                    }
                                }
                            }
                        } else {
                            /** Аналогичное действие для одномерных шаблонов */
                            if (!(gridTemplateColumn + template.schema.length <= gridTemplate[gridTemplateRow].length)) {
                                return false;
                            }

                            for (let m = 0; m < template.schema.length; m++) {
                                if (gridTemplate[gridTemplateRow][gridTemplateColumn + m] !== '.') {
                                    isFree = false;
                                }
                            }
                        }

                        return isFree;
                    });

                    /**Смотрим есть ли новость в пуле */
                    if (this.newsCurrentIndex < newsCount) {
                        /** Выбираем шаблон */
                        let rand = this.srand(this.news[this.newsCurrentIndex].id);
                        let num = Math.trunc(rand(0, allowTemplates.length - 1));
                        let template = allowTemplates[num];

                        /** Добавляем выбранный шаблон */
                        if (typeof (template.schema[0]) === 'object') {
                            for (let n = 0; n < template.schema.length; n++) {
                                for (let m = 0; m < template.schema[0].length; m++) {
                                    gridTemplate[gridTemplateRow + n][gridTemplateColumn + m] = template.schema[n][m] + this.news[this.newsCurrentIndex].id;
                                }
                            }
                        } else {
                            for (let m = 0; m < template.schema.length; m++) {
                                gridTemplate[gridTemplateRow][gridTemplateColumn + m] = template.schema[m] + this.news[this.newsCurrentIndex].id;
                            }
                        }
                        this.news[this.newsCurrentIndex].template = template;
                        this.news[this.newsCurrentIndex].imageExist = this.news[this.newsCurrentIndex].template.schema.flat().includes('i');
                        this.news[this.newsCurrentIndex].isActive = true;
                        this.newsCurrentIndex++;
                    } else {
                        isNewsGone = true;
                        this.stop = true;
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
        },

        /** Перерисовка сети при изменении размеров окна */
        resize: function () {
            clearTimeout(this.timerDebounce);
            this.timerDebounce = setTimeout( () =>{

                /** Высчитываем ~новый размер сетки и перерисовываем */
                let total = this.currentHeight * this.currentWidth;
                let blockSize = this.gridColumnsCount * this.gridRowsCount;
                let newGridRowsCount = Math.round(total / blockSize) * this.gridRowsCount;

                this.newsCurrentIndex = 0;
                this.currentHeight = newGridRowsCount;
                this.currentWidth = this.gridColumnsCount;

                this.news.forEach(element => {
                    if (element.isActive) {
                        element.isActive = false;
                    }
                });
                this.stop = false;
                // debugger;
                this.renderGrid(this.gridColumnsCount, newGridRowsCount);
                let elem = document.getElementsByClassName('grid')[0];
                elem.style.cssText =
                    `grid-template-areas: ${this.gridTemplate};
                    grid-template-rows: repeat(${this.currentHeight}, 300px);`;
                console.log('RENDER');
            }, 1000);

            // debugger;
            /*   if (document.documentElement.clientWidth <= 1280) {
                   console.log("3x6 MODE");
            //       this.gridColumnsCount = 3;
                   this.gridRowsCount = 6;
               }

               if (document.documentElement.clientWidth > 1280 && document.documentElement.clientWidth <= 1440) {
                   console.log("4x5 MODE");
                //   this.gridColumnsCount = 4;
                   this.gridRowsCount = 5;
               }

               if (document.documentElement.clientWidth > 1440) {
                   console.log("5x4 MODE");
               //    this.gridColumnsCount = 5;
                   this.gridRowsCount = 4;
               }
   */

        },

        /** Перерисовываем сетку */
        renderGrid: function (columnsCount, rowsCount) {
            let gridArray = this.arrayToGridArray(columnsCount, rowsCount);
            this.gridTemplate = this.gridArrayToGridString(gridArray);
        },

        /** Проверка на конец ленты */
        scroll: function (e) {

            let elem = document.getElementsByClassName('grid')[0];
            if (elem.getBoundingClientRect().bottom < document.documentElement.clientHeight + 150) {
                if (!this.stop) {
                    this.addGrid();
                }
            }
            ;
        },

        /** Добавляем новый блок в конце страницы */
        addGrid: function () {
            this.gridCount++;
        }
    }
})
function showAlert(text) {
   console.log(text)
}
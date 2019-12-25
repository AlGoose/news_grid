new Vue({
    el: '#app',
    data: {
        news: [],
        blocksCount: 1,
        appWidth: 0,
        gridColumnsCount: 0,
        gridRowsCount: 0,
        gridHeight: 0,
        showedNews: false,
        isNewsGone: false,
        popupGridArea: ""
    },

    created: function () {
        this.news = dataNews;
        this.appWidth = document.getElementById('app').offsetWidth;
        window.addEventListener('resize', this.resize);
    },

    mounted: function () {
        axios
            .get('https://www.zkabel.ru/api/news/get/')
            .then(response => {
                if (response.data.status == 200) {
                    this.news = response.data.result;

                    console.log(response.data);

                    this.news.forEach((item, index) => {
                        Vue.set(this.news[index], 'isActive', false);
                    });

                    console.log(this.news);
                }
            });
    },

    watch: {
        appWidth(newValue) {
            GRID_SETTINGS.forEach(item => {
                if (newValue >= item.width[0] && newValue < item.width[1]) {
                    this.gridColumnsCount = item.itemsPerRow;
                    this.gridRowsCount = item.rowsCount;
                }
            });
        },

        showedNews(news) {
            if (news) {
                Vue.nextTick(function () {
                    let popup = document.getElementsByClassName('popup')[0];
                    popup.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
                })
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
            console.log("Render");
            let resultGrid = [];
            let newsCount = this.news.length;
            let newsCurrentIndex = 0;
            this.isNewsGone = false;

            this.news.forEach(element => {
                if (element.isActive) {
                    element.isActive = false;
                }
            });

            for (let blockNumber = 0; blockNumber < this.blocksCount; blockNumber++) {
                let block = new Array(this.gridRowsCount);
                for (let i = 0; i < this.gridRowsCount; i++) {
                    block[i] = new Array(this.gridColumnsCount).fill('.');
                }

                let allowTemplates = [];

                for (let blockRow = 0; blockRow < this.gridRowsCount; blockRow++) {
                    for (let blockColumn = 0; blockColumn < this.gridColumnsCount; blockColumn++) {
                        if (block[blockRow][blockColumn] !== '.') continue;

                        if (blockNumber === 0 && blockRow === 0 && blockColumn === 0) {
                            allowTemplates = [{
                                pattern: [
                                    ['i', 't'],
                                    ['i', 't']
                                ],
                                imageType: 'v'
                            }];
                        } else {
                            /** Создаем массив, подходящих на данную позицию, шаблонов */
                            allowTemplates = TEMPLATES.filter(template => {
                                return isPatternApproach(block, template.pattern, blockRow, blockColumn);
                            });
                        }

                        /**Смотрим есть ли новость в пуле */
                        if (newsCurrentIndex < newsCount) {
                            /** Выбираем шаблон */
                            let rand = this.srand(this.news[newsCurrentIndex].id);
                            let num = Math.trunc(rand(0, allowTemplates.length - 1));
                            let template = allowTemplates[num];

                            /** Добавляем выбранный шаблон */
                            addPatternToGridArray(block, template.pattern, blockRow, blockColumn, this.news[newsCurrentIndex].id);

                            this.news[newsCurrentIndex].template = template;
                            this.news[newsCurrentIndex].coords = {
                                firstRow: blockRow + 1 + blockNumber * this.gridRowsCount,
                                lastRow: blockRow + 1 + template.pattern.length + blockNumber * this.gridRowsCount,
                                firstColumn: blockColumn + 1,
                                lastColumn: blockColumn + 1 + template.pattern[0].length,
                            };
                            this.news[newsCurrentIndex].imageExist = this.news[newsCurrentIndex].template.pattern.flat().includes('i');
                            this.news[newsCurrentIndex].isActive = true;
                            newsCurrentIndex++;
                        } else {
                            this.isNewsGone = true;

                            if (this.news.length > 0) {
                                let isEmpty;
                                let startCut = blockRow;

                                for (let i = blockRow; i < this.gridRowsCount; i++) {
                                    isEmpty = true;
                                    for (let k = 0; k < block[i].length; k++) {
                                        if (block[i][k] !== '.') {
                                            isEmpty = false;
                                            startCut = i + 1;
                                            continue;
                                        }
                                    }
                                }
                                if (isEmpty) {
                                    block.splice(startCut, block.length - startCut);
                                }
                            }
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
            this.gridHeight = resultGrid.length;
            return resultGrid;
        },

        popupStyle: function () {
            return { ...this.popupPosition, ...this.popupGridStyle };
        },

        popupGridStyle: function () {
            if (this.popupGridArea === 'left') {
                return {
                    'grid-template-areas': "'i t t' 'i t t'"
                }
            } else {
                return {
                    'grid-template-areas': "'t t i' 't t i'"
                }
            }
        },

        popupPosition: function () {
            let grid_column_start = 0;
            let grid_column_end = 0;
            let grid_row_start = 0;
            let grid_row_end = 0;

            if (this.showedNews) {
                if (this.showedNews.coords.firstColumn <= this.gridColumnsCount - 2) {
                    console.log('Right');
                    grid_column_start = this.showedNews.coords.firstColumn;
                    grid_column_end = this.showedNews.coords.firstColumn + 3;

                    this.popupGridArea = 'left';
                } else if (this.showedNews.coords.lastColumn - 3 >= 1) {
                    console.log('Left');
                    grid_column_start = this.showedNews.coords.lastColumn - 3;
                    grid_column_end = this.showedNews.coords.lastColumn;

                    this.popupGridArea = 'right';
                } else {
                    console.log('Center');
                    grid_column_start = this.showedNews.coords.firstColumn - 1;
                    grid_column_end = this.showedNews.coords.lastColumn + 1;

                    this.popupGridArea = 'left';
                }

                if (this.showedNews.coords.firstRow <= this.gridHeight - 1) {
                    console.log('Down');
                    grid_row_start = this.showedNews.coords.firstRow;
                    grid_row_end = this.showedNews.coords.firstRow + 2;
                } else {
                    console.log('Up');
                    grid_row_start = this.showedNews.coords.firstRow - 1;
                    grid_row_end = this.showedNews.coords.lastRow;
                }
            }

            return {
                'grid-column-start': grid_column_start,
                'grid-column-end': grid_column_end,
                'grid-row-start': grid_row_start,
                'grid-row-end': grid_row_end
            }
        }
    },

    methods: {
        srand: function (seed) {
            if (typeof seed === 'string') {
                let str = seed;
                seed = 0xFF;
                for (let i = 0; i < str.length; i++) {
                    seed ^= str.charCodeAt(i);
                }
            }

            return function (min, max) {
                //     seed = Math.round(Math.random() * 10);
                max = max || 1;
                min = min || 0;
                seed = (seed * 2 * 9301 + 49297) % 233280;

                return min + (seed / 233280) * (max - min);
            }
        },

        resize: function () {
            clearTimeout(this.timerDebounce);
            this.timerDebounce = setTimeout(() => {
                this.appWidth = document.getElementById('app').offsetWidth;
            }, 300);
        },

        show(e) {
            this.showedNews = e;
        },

        addBlock: function () {
            if (this.isNewsGone) return;
            this.blocksCount++;
        },

        showNews(news) {
            this.showedNews = news;
        },

        closeNews() {
            this.showedNews = false;
        }
    }
})
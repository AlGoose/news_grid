new Vue({
    el: '#app',
    data: {
        news: [],
        blocksCount: 1,
        isNewsGone: false,
        appWidth: 0,
        gridColumnsCount: 0,
        gridRowsCount: 0,
        showedNews: false,
        // grid_column_start: 0,
        // grid_column_end: 0,
        // grid_row_start: 0,
        // grid_row_end: 0,
        gridHeight: 0,
        imageStyle: 'left',
        textStyle: 'right'
    },

    created: function () {
        this.appWidth = document.getElementById('app').offsetWidth;
        window.addEventListener('resize', this.resize);
    },

    mounted: function () {
        // axios
        //     .get('data.json')
        //     .then(response => {
        //         this.news = response.data;
        //         this.news.forEach((item, index) => {
        //             Vue.set(this.news[index], 'isActive', false);
        //         })
        //     });
        this.news = NEWS;
        this.news.forEach((item, index) => {
            Vue.set(this.news[index], 'isActive', false);
        })
    },

    watch: {
        appWidth(newValue) {
            GRID_SETTINGS.forEach(item => {
                if (newValue >= item.width[0] && newValue < item.width[1]) {
                    this.gridColumnsCount = item.itemsPerRow;
                    this.gridRowsCount = item.rowsCount;
                }
            });
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

                        /** Создаем массив, подходящих на данную позицию, шаблонов */
                        allowTemplates = TEMPLATES.filter(template => {
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
            return this.popupPosition;
            // return {
            //     'grid-column-start': this.grid_column_start,
            //     'grid-column-end': this.grid_column_end,
            //     'grid-row-start': this.grid_row_start,
            //     'grid-row-end': this.grid_row_end
            // }
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

                    this.textStyle = "right";
                    this.imageStyle = "left";
                } else if (this.showedNews.coords.lastColumn - 3 >= 1) {
                    console.log('Left');
                    grid_column_start = this.showedNews.coords.lastColumn - 3;
                    grid_column_end = this.showedNews.coords.lastColumn;
                    
                    this.textStyle = "left";
                    this.imageStyle = "right";
                } else {
                    console.log('Center');
                    grid_column_start = this.showedNews.coords.firstColumn - 1;
                    grid_column_end = this.showedNews.coords.lastColumn + 1;
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
        },

        popupTextStyle: function() {
            return {
                'float': this.textStyle
            }
        },

        popupImageStyle: function() {
            return {
                'float': this.imageStyle
            }
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
                this.appWidth = document.getElementById('app').offsetWidth;
            }, 300);
        },

        addBlock: function () {
            if (this.isNewsGone) return;
            this.blocksCount++;
        },

        showNews(news) {
            console.log(news)
            console.log(news.coords)

            // if (news.coords.firstColumn <= this.gridColumnsCount - 2) {
            //     console.log('Right');
            //     this.grid_column_start = news.coords.firstColumn;
            //     this.grid_column_end = news.coords.firstColumn + 3;
            // } else if (news.coords.lastColumn - 3 >= 1) {
            //     console.log('Left');
            //     this.grid_column_start = news.coords.lastColumn - 3;
            //     this.grid_column_end = news.coords.lastColumn;
            // } else {
            //     console.log('Center');
            //     this.grid_column_start = news.coords.firstColumn - 1;
            //     this.grid_column_end = news.coords.lastColumn + 1;
            // }

            // if (news.coords.firstRow <= this.gridHeight - 1) {
            //     console.log('Down');
            //     this.grid_row_start = news.coords.firstRow;
            //     this.grid_row_end = news.coords.firstRow + 2;
            // } else {
            //     console.log('Up');
            //     this.grid_row_start = news.coords.firstRow - 1;
            //     this.grid_row_end = news.coords.lastRow;
            // }

            this.showedNews = news;
            let popup = document.getElementsByClassName('popup')[0];
            popup.style.display = "inline-block";
            // popup.scrollIntoView({block: "center", behavior: "smooth"}); //TODO: Как сделать прокрутку без подсчета координат?
        },

        closeNews() {
            this.showedNews = false;
            let popup = document.getElementsByClassName('popup')[0];
            popup.style.display = "none";
        }
    }
})
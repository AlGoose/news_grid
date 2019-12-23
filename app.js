new Vue({
    el: '#app',
    data: {
        showedNews:false,
        news: [],
        blocksCount: 1,
        isNewsGone: false,
        appWidth: 0,
        gridColumnsCount: 0,
        gridRowsCount: 0,

    },

    created: function () {
        this.appWidth = document.getElementById('app').offsetWidth;
        ;
        window.addEventListener('resize', this.resize);
    },

    mounted: function () {
        axios
            .get('data.json')
            .then(response => {
                this.news = response.data;
                console.log(this.news);
                this.news.forEach((item, index) => {
                    Vue.set(this.news[index], 'isActive', false);
                })
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
            console.log("Here");
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
                                fr: blockRow + (this.blocksCount - 1) * this.gridRowsCount,
                                lr: blockRow + template.pattern.length - 1 + (this.blocksCount - 1) * this.gridRowsCount,
                                fc: blockColumn,
                                lc: blockColumn + template.pattern[0].length - 1,
                            };
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
                let str = seed;
                seed = 0xFF;
                for (let i = 0; i < str.length; i++) {
                    seed ^= str.charCodeAt(i);
                }
            }

            return function (min, max) {
                seed = Math.round(Math.random() * 10);
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
            console.log(e)
        },
        addBlock: function () {
            if (this.isNewsGone) return;
            this.blocksCount++;
        },

    }
})
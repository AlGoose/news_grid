new Vue({
    el: '#app',
    data: {
        news: [
            {
                id: 1,
                isActive: false,
                image: []
            },
            {
                id: 2,
                isActive: false,
                image: []
            },
            {
                id: 3,
                isActive: false,
                image: []
            },
            {
                id: 4,
                isActive: false,
                image: []
            },
            {
                id: 5,
                isActive: false,
                image: []
            },
            {
                id: 6,
                isActive: false,
                image: []
            },
            {
                id: 7,
                isActive: false,
                image: []
            },
            {
                id: 8,
                isActive: false,
                image: []
            },
            {
                id: 9,
                isActive: false,
                image: []
            },
            {
                id: 10,
                isActive: false,
                image: []
            },
            {
                id: 11,
                isActive: false,
                image: []
            },
            {
                id: 12,
                isActive: false,
                image: []
            },
            {
                id: 13,
                isActive: false,
                image: []
            },
            {
                id: 14,
                isActive: false,
                image: []
            },
            {
                id: 15,
                isActive: false,
                image: []
            },
            {
                id: 16,
                isActive: false,
                image: []
            },
            {
                id: 17,
                isActive: false,
                image: []
            },
            {
                id: 18,
                isActive: false,
                image: []
            },
            {
                id: 19,
                isActive: false,
                image: []
            },
            {
                id: 20,
                isActive: false,
                image: []
            }
        ],
        blocksCount: 1,
        isNewsGone: false,
        windowWidth: 0,
        gridColumnsCount: 0,
        gridRowsCount: 0
    },

    created: function () {
        this.windowWidth = document.documentElement.clientWidth;
        window.addEventListener('resize', this.resize); //TODO: Привязаться не к окну а к родительскому объекту (сетке?) Как?
    },

    mounted: function () {
        //FIXME: Сетка отрисовывется быстрее ответа ---> текст и картинка не отображается на старте
        let textPromises = [];
        axios
            .get('https://picsum.photos/v2/list?page=1&limit=20')
            .then(response => {
                console.log(response.data);
                for(let i = 0; i < response.data.length; i++) {
                    this.news[i].image[0] = `https://picsum.photos/id/${response.data[i].id}/325/300`;
                    this.news[i].image[1] = `https://picsum.photos/id/${response.data[i].id}/325/610`;
                    this.news[i].image[2] = `https://picsum.photos/id/${response.data[i].id}/660/300`;
                }
            });

        for (let i = 0; i < this.news.length; i++) {
            textPromises.push(axios.get('https://litipsum.com/api/picture-of-dorian-gray/1'));
        }
        Promise.all(textPromises).then(values => {
            console.log(values);
            this.news.forEach((item, index) => {
                item.text = values[index].data;
            });
        });
    },

    watch: {
        windowWidth(newValue) {
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
        },
        
        //FIXME: Можно лучше сделать, правильнее. Как?
        getImage: function (id) {
            for (let i = 0; i < this.news.length; i++) {
                if (this.news[i].id === id) {
                    let imageType = this.news[i].template.imageType;
                    return this.news[i].image[imageType];
                }
            }
        }
    }
})
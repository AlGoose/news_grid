function isPatternApproach(block, pattern, blockRow, blockColumn) {
    if (typeof (pattern[0]) === 'object') {
        /**
         * Проверяем подходит ли шаблон по размерам
         * и не пересекается ли он с другими элементами
         */
        if (!(blockRow + pattern.length <= block.length && blockColumn + pattern[0].length <= block[blockRow].length)) {
            return false;
        }


        for (let n = 0; n < pattern.length; n++) {
            for (let m = 0; m < pattern[0].length; m++) {
                if (block[blockRow + n][blockColumn + m] !== '.') {
                    return false;
                }
            }
        }
    } else {
        /** Аналогичное действие для одномерных шаблонов */
        if (!(blockColumn + pattern.length <= block[blockRow].length)) {
            return false;
        }

        for (let m = 0; m < pattern.length; m++) {
            if (block[blockRow][blockColumn + m] !== '.') {
                return false;
            }
        }
    }

    return true;
}

function addPatternToGridArray(block, pattern, blockRow, blockColumn, idNews) {
    if (typeof (pattern[0]) === 'object') {
        for (let n = 0; n < pattern.length; n++) {
            for (let m = 0; m < pattern[0].length; m++) {
                block[blockRow + n][blockColumn + m] = pattern[n][m] + idNews;
            }
        }
    } else {
        for (let m = 0; m < pattern.length; m++) {
            block[blockRow][blockColumn + m] = pattern[m] + idNews;
        }
    }
}

/**Переводим сетку из двумерного массива в строку */
function gridArrayToGridString(gridArray) {
    let gridString = '';

    for (let i = 0; i < gridArray.length; i++) {
        let rowString = "'" + gridArray[i].join(' ') + "'";
        gridString += rowString + ' ';
    }
    return gridString;
}
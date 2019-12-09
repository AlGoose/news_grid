function openNews(elem) {
    let img = elem.querySelector('img');
    let modalImage = document.getElementsByClassName("modal_image");
    modalImage[0].src = img.src;

    // console.log(elem.getBoundingClientRect().x);
    // console.log(elem.getBoundingClientRect().y);
    // console.log(elem.getBoundingClientRect());
    // console.log(document.documentElement.clientWidth);
    // console.log(document.documentElement.clientHeight);

    let coords = getGridCoord(elem);
    let windowWidth = document.documentElement.clientWidth;

    if (windowWidth <= 1280) {
        size_one(coords);
    } else if (windowWidth > 1280 && windowWidth <= 1440) {
        size_two(coords);
    } else {
        size_three(coords);
    }
}

function closeModalBlock() {
    let elem = document.getElementsByClassName("modal_block");
    elem[0].classList.toggle("isVisible");
}

function getGridCoord(elem) {
    let xCoord = Math.round(Math.abs(elem.getBoundingClientRect().x) / 335) + 1;
    let yCoord = Math.round(Math.abs(elem.getBoundingClientRect().y) / 310) + 1;
    if (yCoord === 4) {
        yCoord = 3;
    }
    return [xCoord, yCoord];
}

function size_one(coords) {
    let gridRow;
    let gridColumn = "grid-column: 1 / 4;";
    let flexDirection = "flex-direction: row";

    if (coords[1] == 1 || coords[1] == 2) {
        gridRow = "grid-row: 1 / 3;";
    } else {
        gridRow = "grid-row: 2 / 4;";
    }

    if (coords[0] == 3) {
        flexDirection = "flex-direction: row-reverse;";
        document.getElementsByClassName("button_block")[0].style.cssText = "justify-content: flex-start;";
    } else {
        document.getElementsByClassName("button_block")[0].style.cssText = "justify-content: flex-end;";
    }

    document.getElementsByClassName("news_block")[0].style.cssText = gridColumn + gridRow + flexDirection;
    document.getElementsByClassName("modal_block")[0].classList.toggle("isVisible");
}

function size_two(coords) {
    let gridRow;
    let gridColumn;
    let flexDirection = "flex-direction: row";

    if (coords[0] == 1 || coords[0] == 3) {
        gridColumn = "grid-column: 1 / 4;";
    } else {
        gridColumn = "grid-column: 2 / 5;";
    }

    if (coords[1] == 1 || coords[1] == 2) {
        gridRow = "grid-row: 1 / 3;";
    } else {
        gridRow = "grid-row: 2 / 4;";
    }

    if (coords[0] == 3 || coords[0] == 4) {
        flexDirection = "flex-direction: row-reverse;";
        document.getElementsByClassName("button_block")[0].style.cssText = "justify-content: flex-start;";
    } else {
        document.getElementsByClassName("button_block")[0].style.cssText = "justify-content: flex-end;";
    }

    document.getElementsByClassName("news_block")[0].style.cssText = gridColumn + gridRow + flexDirection;
    document.getElementsByClassName("modal_block")[0].classList.toggle("isVisible");
}

function size_three(coords) {
    let gridRow;
    let gridColumn;
    let flexDirection = "flex-direction: row";

    if (coords[0] == 1) {
        gridColumn = "grid-column: 1 / 4;";
    } else if (coords[0] == 2 || coords[0] == 4) {
        gridColumn = "grid-column: 2 / 5;";
    } else {
        gridColumn = "grid-column: 3 / 6;";
    }

    if (coords[1] == 1 || coords[1] == 2) {
        gridRow = "grid-row: 1 / 3;";
    } else {
        gridRow = "grid-row: 2 / 4;";
    }

    if (coords[0] == 4 || coords[0] == 5) {
        flexDirection = "flex-direction: row-reverse;";
        document.getElementsByClassName("button_block")[0].style.cssText = "justify-content: flex-start;";
    } else {
        document.getElementsByClassName("button_block")[0].style.cssText = "justify-content: flex-end;";
    }

    document.getElementsByClassName("news_block")[0].style.cssText = gridColumn + gridRow + flexDirection;
    document.getElementsByClassName("modal_block")[0].classList.toggle("isVisible");
}
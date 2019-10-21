// ex: cumulate([1, 2, 3], (a, b) => a * b, 1) = [1, 2, 6]
const cumulate = (array, accumulator, neutral) => {
    const result = [];
    array.reduce( (previous, current, index) => result[index] = accumulator(previous, current), neutral);
    return result;
};
// ex: cumulateAdd([1, 2, 3]) = [1, 3, 6]
const cumulateAdd = array => cumulate(array, (a, b) => a + b, 0);

// ex: removeFirst([1, 2, 3]) = [2, 3]
const removeFirst = array => array.slice(1);
// ex: removeLast([1, 2, 3]) = [1, 2]
const removeLast = array => array.slice(0, -1);
// ex: concat([1, 2], [3, 4]) = [1, 2, 3, 4]
const concat = (...arrays) => [].concat(...arrays);
// ex: select([1, 3], [3, 4, 5]) = [3, 5]
const select = (indexes, array) => array.filter((_, index) => indexes.includes(index));

// ex: <td colspan="5">, extractAttributeValue('colspan', value => parseInt(value))(tr) = 5
const extractAttributeValue = (attributeName, mapper) => element => mapper(element.attributes[attributeName].value);
// ex: <td colspan="5">, extractNumericAttribute('colspan')(td) = 5
const extractNumericAttribute = attributeName => extractAttributeValue(attributeName, parseInt);
// ex: <td colspan="5">, colspanExtractor(td) = 5
const colspanExtractor = extractNumericAttribute('colspan');
// ex: row = <tr><td colspan="5"></td><td colspan="3"></td></tr>,  cumulateColspans(row) = [5, 8]
const cumulateColspans = row => cumulateAdd(Array.from(row.cells, colspanExtractor));
// ex: table = <table><thead><tr id="1"></tr></thead><tbody><tr id="2"></tr></tbody>, getAllRows(table) = [<tr id="1">, <tr id="2">]
const getAllRows = table => concat(
    // Headers
    Array.from(table.tHead.rows),
    // Bodies
    Array.from(table.tBodies).flatMap(body => Array.from(body.rows)),
    // Footer optionel
    Array.from(table.tFoot ? table.tFoot.rows : [])
);
const getSeparatorCells = table => {
    const allRows = getAllRows(table);
    // calcul des indices des colonnes où il faut ajouter la classe 'first-col-group'
    const colspans = removeLast(cumulateColspans(allRows[0]));
    // pour une ligne, donne les cellules où il faut ajouter la classe
    const selectRowCells = row => select(colspans, Array.from(row.cells));
    // pour un ensemble de lignes, donne les cellules où il faut ajouter la classe
    const selectCells = rows => rows.flatMap(selectRowCells);
    // cellules où il faut ajouter la classe 'first-col-group'
    const cells = concat(
        // 1ere ligne du header (toutes les colonnes)
        Array.from(allRows[0].cells),
        // Les autres lignes
        selectCells(removeFirst(allRows))
    );
    return cells;
};

// Effets de bord
const addClass = className => element => element.classList.add(className);
document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementsByTagName('table')[0];
    getSeparatorCells(table)
        .forEach(addClass('first-col-group'));
});

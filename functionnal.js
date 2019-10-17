// Fonctions d'accumulation
const cumulate = (array, accumulator, neutral = 0) => {
    const result = [];
    array.reduce( (previous, current, index) => result[index] = accumulator(previous, current), neutral);
    return result;
};
const add = (a, b) => a + b;
const cumulateAdd = array => cumulate(array, add);

// Utilitaire sur les tableaux
const removeFirst = array => array.slice(1);
const removeLast = array => array.slice(0, -1);
const concat = (...arrays) => [].concat(...arrays);
const select = indexes => array => array.filter((_, index) => indexes.includes(index));

// Manipulation des éléments du DOM
const extractAttributeValue = (attributeName, mapper) => element => mapper(element.attributes[attributeName].value);
const extractNumericAttribute = attributeName => extractAttributeValue(attributeName, parseInt);
const colspanExtractor = extractNumericAttribute('colspan');
const cumulateColspans = row => cumulateAdd(Array.from(row.cells, colspanExtractor));
const addClass = className => element => element.classList.add(className);
const getAllRows = table => concat(
    // Headers
    Array.from(table.tHead.rows),
    // Bodies
    Array.from(table.tBodies).flatMap(body => Array.from(body.rows))
);
const applyColumnGroupSeparator = table => {
    const allRows = getAllRows(table);
    // calcul des indices des colonnes où il faut ajouter la classe 'first-col-group'
    const colspans = removeLast(cumulateColspans(allRows[0]));
    // donne les cellules d'un ensemble de lignes où il faut ajouter la classe
    const selectCells = rows => rows.flatMap(row => colspans.map(colspan => row.cells[colspan]));
    // cellules où il faut ajouter la classe 'first-col-group'
    const cells = concat(
        // 1ere ligne du header
        Array.from(allRows[0].cells),
        // Les autres lignes
        selectCells(removeFirst(allRows))
    );
    cells.forEach(addClass('first-col-group'));
};

document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementsByTagName('table')[0];
    applyColumnGroupSeparator(table);
});

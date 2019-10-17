// Générique
const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

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
const addClass = className => element => element.classList.add(className);

// Spécifique à la problématique
const computeGroups = table => {
    const firstHeaderCells = Array.from(table.tHead.rows[0].cells);
    const colspans = firstHeaderCells.map(colspanExtractor);
    return compose(removeLast, cumulateAdd)(colspans);
};

document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementsByTagName('table')[0];

    // 1ère ligne de header
    const firstHeaderRow = table.tHead.rows[0];
    // autres lignes du header
    const otherHeaderRows = removeFirst(Array.from(table.tHead.rows));
    // lignes des bodys
    const bodyRows = Array.from(table.tBodies).flatMap(body => Array.from(body.rows));
    
    // Calcul des indices des colonnes où il faut ajouter la classe 'first-col-group'
    const firstHeaderCells = Array.from(firstHeaderRow.cells);
    const colspans = firstHeaderCells.map(colspanExtractor);
    const groups = compose(removeLast, cumulateAdd)(colspans);


    // donne les cellules d'un ensemble de lignes où il faut ajouter la classe
    const selectGroupColumns = rows => rows.flatMap(row => groups.map(group => row.cells[group]));

    // Cellules où il faut ajouter la classe 'first-col-group'
    const cells = concat(
        // 1ere ligne du header
        Array.from(firstHeaderRow.cells),
        // Les autres lignes du header
        selectGroupColumns(otherHeaderRows),
        // Les lignes du body
        selectGroupColumns(bodyRows)
    );
    cells.forEach(addClass('first-col-group'));
});
function applyColumnGroupSeparator(table) {
    const firstHeader = table.tHead.rows[0];
    // indices des colonnes où il faut ajouter la classe 'first-col-group'
    let groups = [];
    // on ne traite pas la dernière colonne puisqu'il n'existe pas de groupe à sa droite
    for (let i = 0; i < firstHeader.cells.length - 1; i++) {
        const row = firstHeader.cells[i];
        // on cumule les valeurs de 'colspan'
        const span = row.attributes['colspan'].value || 1;
        const previous = groups[i - 1] || 0;
        groups[i] = previous + parseInt(span);
        row.classList.add("first-col-group");
    }
    for (let group of groups) {
        // lignes header (on ne traite pas la 1ère ligne)
        for (let i = 1; i < table.tHead.rows.length; i++) {
            const row = table.tHead.rows[i];
            row.cells[group].classList.add("first-col-group");
        }
        // lignes bodies
        for (let body of table.tBodies) {
            for (let row of body.rows) {
                row.cells[group].classList.add("first-col-group");
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementsByTagName('table')[0];
    applyColumnGroupSeparator(table);
});
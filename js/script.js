document.addEventListener('DOMContentLoaded', () => {
    let date = new Date();
    let fullDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    console.log(fullDate);
});
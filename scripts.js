const headerBtn = document.getElementById('btnHeader');
const form = document.getElementById('donateForm');

headerBtn.addEventListener('click', () => {
    form.classList.toggle('hide');
}) 
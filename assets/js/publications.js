// Keep abstracts readable without JavaScript; progressively enhance the buttons.
document.querySelectorAll('.publication-toggle').forEach(function (button) {
    var abstract = document.getElementById(button.getAttribute('aria-controls'));
    if (!abstract) return;

    abstract.hidden = true;
    button.hidden = false;
    button.setAttribute('aria-expanded', 'false');

    button.addEventListener('click', function () {
        var expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        abstract.hidden = expanded;
    });
});

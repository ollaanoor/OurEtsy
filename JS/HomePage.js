var dropdowns = document.getElementsByClassName('dropdown')[0];

dropdowns.addEventListener('click', ()=>{
    var content = document.getElementsByClassName('dropdown-content')[0];
    content.classList.toggle('show');
})

// Close the dropdown if the user clicks outside of it
document.addEventListener('click', function(event){
    if (!event.target.matches('.dropbtn')) {
        var openDropdown = document.getElementsByClassName("dropdown-content")[0];
        if(openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
})
// Toggle the dropdown content on click
document.querySelector('#categories').addEventListener('click', function(event){
    // Ensure that the click event does not propagate to the window click event
    event.stopPropagation();
    document.querySelector('.dropdown-content').classList.toggle('show');
});

// Close the dropdown if the user clicks outside of it
window.onclick = function(event){
    if(!event.target.matches('#categories')){
        var dropdowns = document.getElementsByClassName('dropdown-content');
        for(var i=0; i<dropdowns.length; i++){
            var openDropdown = dropdowns[i];
            if(openDropdown.classList.contains('show')){
                openDropdown.classList.remove('show');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
// window.onload = function() {
    /* Dropdown */
    var dropdowns = document.getElementsByClassName('dropbtn')[0];
    var overlay = document.getElementsByClassName('dropdown-overlay')[0];
    console.log(dropdowns);
    dropdowns.addEventListener('click', (event)=>{
        var content = document.querySelector('.dropdown-content');
        content.classList.toggle('show');

        overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';

         // Prevent the click from bubbling to the document
        event.stopPropagation();
    })

    // Close the dropdown if the user clicks outside of it
    document.addEventListener('click', function(event){
        if (!event.target.matches('.dropbtn')) {
            var openDropdown = document.getElementsByClassName("dropdown-content")[0];
            if(openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
            overlay.style.display = 'none';
        }
    })

    /* Personalized Gifts Favorite Icons */
    // Event Delegation 
    /* We attach a single click event listener to the .grid-container div, which is the parent of all the fav-btn elements. */
    // Get the parent container of the favorite buttons
    const gridContainer = document.querySelector('.grid-container');

    // Add event listener for click on the container
    gridContainer.addEventListener('click', function (event) {
        // Check if the clicked element is a button inside the fav-btn div
        if (event.target.closest('.fav-btn button')) {
            // Handle the click event for the favorite button
            const button = event.target.closest('.fav-btn button');
            toggleFav(button);
        }
    });

    function toggleFav(button) {
        
        const icon = button.querySelector('img');

        // Toggle the icon to indicate if the item is favorited or not
        if (icon.src.includes('fav-icon-2.png')) {
            icon.src = '../Resources/Images/fav-icon-2-fill.png';  // Change to filled icon
        } else {
            icon.src = '../Resources/Images/fav-icon-2.png';  // Change back to unfilled icon
        }

        // Log which item was favorited
        // console.log('Favorited item:', button);
    }
});
// }
//  Get the header container
const headerContainer = document.getElementById('header-placeholder');

// Ensure the header container exists before proceeding
if (headerContainer) {
    // Listen for clicks on the document
    document.addEventListener('click', function(event) {

        /* Dropdown */
        // Check if the clicked element or any of its parents is the dropdown button
        if (event.target.closest('.dropbtn')) {
            // Run your dropdown logic
            const content = document.querySelector('.dropdown-content');
            const droparrow = document.getElementsByClassName('dropdown-arrow')[0];
            const overlay = document.getElementsByClassName('dropdown-overlay')[0];

             if (content) {
                content.classList.toggle('show');
            } else {
                console.error("Error: Dropdown content element not found");
            }
            if (droparrow) {
                 droparrow.classList.toggle('show');
            } else {
                console.error("Error: Dropdown arrow element not found");
            }

            // Check if overlay exists before trying to change its display
            if (overlay) {
                overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
            } else {
                console.error("Error: Dropdown overlay element not found");
            }

             event.stopPropagation();
        } else if (!event.target.closest('.dropbtn')){
             const openDropdown = document.getElementsByClassName("dropdown-content")[0];
             const overlay = document.getElementsByClassName('dropdown-overlay')[0];

           
            if (openDropdown && openDropdown.classList.contains('show')) {
                console.log("Closing open dropdown");
                openDropdown.classList.remove('show');
            }
            if (overlay) {
                console.log("Hiding overlay");
                overlay.style.display = 'none';
            }
        }
    });

    // You can also set up other event listeners here if needed
} else {
    console.error("Header container element not found.");
}
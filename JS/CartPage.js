import dataService from './dataService.js';

// Fetch the JSON file for products data 
// fetch('../Resources/JSON/data.json')
dataService.fetchData()
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json(); // Parse JSON
    // })
    .then(data => {
        console.log(data); // Log the JSON data
        
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
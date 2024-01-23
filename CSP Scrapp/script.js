 // This function will fetch the data from the Arduino and display it on the page
 function fetchData() {
    fetch('/api/data') // This should be the endpoint that returns the data from the Arduino
      .then(response => response.json())
      .then(data => {
        // Here, you can manipulate the data and update the HTML content accordingly
        console.log('Data received:', data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }
    
 // Call the function to fetch data when the page loads
 fetchData();
 
 // Optionally, you can call the function periodically to update the data in real-time
 setInterval(fetchData, 5000); // This will fetch the data every 5 seconds
// Autocomplete suggestions
function autocompleteSuggestions() {
    const query = document.getElementById('search-input').value;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&langRestrict=en&maxResults=5`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const suggestions = data.items.map(book => book.volumeInfo.title);
            displayAutocomplete(suggestions);
        })
        .catch(error => console.error('Error fetching suggestions:', error));
}

function displayAutocomplete(suggestions) {
    const suggestionBox = document.getElementById('autocomplete-list');
    suggestionBox.innerHTML = ''; // Clear previous suggestions

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.innerText = suggestion;
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.onclick = function () {
            document.getElementById('search-input').value = suggestion;
            suggestionBox.innerHTML = ''; // Clear suggestions
        };
        suggestionBox.appendChild(suggestionItem);
    });
}

// Fetch books with a language restriction to English and display more results
function searchBooks() {
    const query = document.getElementById('search-input').value;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&langRestrict=en&maxResults=40`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayBooks(data.items))
        .catch(error => console.error('Error fetching books:', error));
}

// Display books in the search results
function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Clear previous results

    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        
        // Extract book info
        const thumbnail = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150';
        const title = book.volumeInfo.title;
        const author = book.volumeInfo.authors?.[0] || 'Unknown Author';

        bookElement.innerHTML = `
            <img src="${thumbnail}" alt="${title}">
            <h3>${title}</h3>
            <p>${author}</p>
            <button onclick="viewBookDetails('${book.id}')">View Details</button>
        `;

        bookList.appendChild(bookElement);
    });
}

// Autocomplete event listener
document.getElementById('search-input').addEventListener('input', autocompleteSuggestions);

// View individual book details
function viewBookDetails(bookId) {
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const bookDetails = data.volumeInfo;
            
            // Update the book details section
            document.getElementById('book-cover').src = bookDetails.imageLinks?.thumbnail || 'https://via.placeholder.com/150';
            document.getElementById('book-title').innerText = bookDetails.title;
            document.getElementById('book-author').innerText = bookDetails.authors?.[0] || 'Unknown Author';
            document.getElementById('book-description').innerText = bookDetails.description || 'No description available.';
            document.getElementById('book-link').href = bookDetails.infoLink;

            // Hide search results and show the book details section
            document.getElementById('search-results').classList.add('hidden');
            document.getElementById('book-details').classList.remove('hidden');
        })
        .catch(error => console.error('Error fetching book details:', error));
}

// Function to clear autocomplete suggestions when clicked outside
document.addEventListener('click', function(event) {
    const searchBar = document.getElementById('search-input');
    const suggestionBox = document.getElementById('autocomplete-list');
    
    // If the clicked target is not the search bar or suggestion box, hide suggestions
    if (!searchBar.contains(event.target) && !suggestionBox.contains(event.target)) {
        suggestionBox.innerHTML = '';  // Clear suggestions
    }
});

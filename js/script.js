/* Determine whether we need a link or already have one */
const urlParams = new URLSearchParams(window.location.search);
const domain = urlParams.get('d');
const searchText = urlParams.get('s');
const editMode = (!domain || !searchText);

/* Once loaded, determine which elements need shown */
window.addEventListener('load', function() {
    if (editMode) {
        document.getElementById('domainSection').style.display = 'block';
        document.getElementById('linkBtn').style.display = 'inline-block';
    } else {
        document.getElementById('searchBtn').style.display = 'inline-block';
        simulateSearch();
    }
})

/* Called when Get Link button is pressed
   Generates the link that when visited, 
   will start a search with your search terms and then redirect to jira
 */
function generateLink() {
    var query = document.getElementById('searchQuery').value
    var urlEncodedQuery = encodeURIComponent(query);

    var domain = document.getElementById('domainName').value;
    var searchLink = window.location.href + "?s=" + urlEncodedQuery + "&d=" + domain; 

    document.getElementById('linkBox').value = searchLink;
    document.getElementById('linkDiv').style.display = 'inline-block';
}

/* Redirects to given jira domain with given search query */
function redirectToJira() {
    var url = "http://jira." + domain + ".com/secure/QuickSearch.jspa?searchString=" + searchText;
    window.location.replace(url);
}

/* Gets the search text from the url and starts the search */
function simulateSearch() {
    document.getElementById('searchQuery').focus();
    var text = decodeURIComponent(searchText);
    typeWriter(text);
}

/* Writes the search term out character by character */
var i = 0;
function typeWriter(text) {
    if (i < text.length) {
        document.getElementById('searchQuery').value += text.charAt(i);
        ++i;
        setTimeout(function() { typeWriter(text) }, 100);
    } else {
        /* Once finished typing, move the mouse to the search button */
        moveMouse();
    }
}

/* Focuses the search button and clicks it */
function clickSearch() {
    document.getElementById('searchBtn').focus();
    document.getElementById('searchBtn').click();
}

/* Mouse position vars */
var x = 0, y = 0, destX, destY;

/* Gets coordinates for the mouse starting position and ending position, and starts the mouse animation */
function moveMouse() {
    document.getElementById('sarcasticLabel').style.display = "block";

    var rect = document.getElementById('searchQuery').getBoundingClientRect();
    x = rect.left;
    y = rect.top;
    
    var dest = document.getElementById('searchBtn').getBoundingClientRect();
    destX = dest.left;
    destY = dest.top - 100;

    requestAnimationFrame(render);
    document.getElementById('mouse').style.display = "block";
}

/* Moves the mouse animation to the search button */
function render (a) {
    var targetX = destX - x;
    var targetY = destY - y;
    
    if (targetX != 0) {
        x = x + Math.min(targetX, 5);
    }
    if (targetY != 0) {
        y = y + Math.min(targetY, 2);
    }
    
    if (targetX == 0 && targetY == 0) {
        document.getElementById('searchBtn').classList.add("button-hover");
        setTimeout(clickSearch, 2000);
        return;
    }
    
    document.getElementById('mouse').style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(render);
}

/* Determine whether we need a link or already have one */
const urlParams = new URLSearchParams(window.location.search);
const jiraUrl = urlParams.get('u');
const searchText = urlParams.get('s');
const editMode = (!jiraUrl || !searchText);

/* Once loaded, determine which elements need shown */
window.addEventListener('load', function() {
    if (editMode) {
        document.getElementById('domainSection').classList.remove('hide');
        document.getElementById('linkBtn').classList.remove('hide');
    } else {
        document.getElementById('searchBtn').classList.remove('hide');
        /* Add a 250ms delay before simulating the search */
        setTimeout(simulateSearch, 250);
    }
})

/* Called when Get Link button is pressed
   Generates the link that when visited, 
   will start a search with your search terms and then redirect to jira
 */
function generateLink() {
    var query = document.getElementById('searchQuery').value;
    var urlEncodedQuery = encodeURIComponent(query);

    var jUrl = document.getElementById('domainName').value;
    var baseUrl = window.location.href.split("?")[0];
    var searchLink = baseUrl + "?s=" + urlEncodedQuery + "&u=" + jUrl; 

    document.getElementById('linkBox').value = searchLink;
    document.getElementById('linkDiv').classList.remove('hide');
}

/* Copies the generated link to the user's clipboard */
function copyToClipboard() {
    document.getElementById('checkIcon').classList.add('hide'); /* Hide the check if button has been clicked already */

    var linkEl = document.getElementById('linkBox');
    linkEl.select();
    linkEl.setSelectionRange(0, 99999);
    document.execCommand('copy');
    
    document.getElementById('copyIcon').classList.add('hide');
    document.getElementById('loadingIcon').classList.remove('hide');
    
    setTimeout(function() {
        document.getElementById('loadingIcon').classList.add('hide');
        document.getElementById('checkIcon').classList.remove('hide'); 
    }, 500);
}

/* Redirects to given jira domain with given search query */
function redirectToJira() {
    if (!jiraUrl.startsWith("https://") && !jiraUrl.startsWith("http://")) {
        url = "https://" + jiraUrl; /* Assume it's secure protocol */
    }
    else {
        url = jiraUrl;
    }
    var searchUrl = url + "/secure/QuickSearch.jspa?searchString=" + searchText;
    window.location.replace(searchUrl);
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
    var saveBtn = document.getElementById('searchBtn');
    saveBtn.focus();
    saveBtn.click();
}

/* Mouse position vars */
var x = 0, y = 0, destX, destY;

/* Gets coordinates for the mouse starting position and ending position, and starts the mouse animation */
function moveMouse() {
    document.getElementById('sarcasticLabel').classList.remove('hide');

    var rect = document.getElementById('searchQuery').getBoundingClientRect();
    x = rect.left;
    y = rect.top;
    
    var dest = document.getElementById('searchBtn').getBoundingClientRect();
    destX = dest.left;
    destY = dest.top - 100;

    requestAnimationFrame(render);
    document.getElementById('mouse').classList.remove('hide');
}

/* Moves the mouse animation to the search button */
function render() {
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
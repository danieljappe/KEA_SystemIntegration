// Check if user is authenticated
async function checkAuth() {
    try {
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (data.authenticated) {
            // Redirect to profile if already logged in
            window.location.href = '/profile';
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', checkAuth);

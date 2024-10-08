document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('login-logout-link');
    const logoutLink = document.getElementById('logout-link');

    if (loginLink && logoutLink) {
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (isLoggedIn === 'true') {
            loginLink.classList.add('d-none');
            logoutLink.classList.remove('d-none');
        } else {
            loginLink.classList.remove('d-none');
            logoutLink.classList.add('d-none');
        }
    }
});

function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    alert('You have logged out successfully.');
    window.location.href = '/login';
}

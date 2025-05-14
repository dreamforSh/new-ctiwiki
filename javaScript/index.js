document.addEventListener('DOMContentLoaded', function() {

    const isIndexPage = window.location.pathname.endsWith('index.html') ||
                        window.location.pathname.endsWith('/') ||
                        window.location.pathname === '';


    if (!isIndexPage) {
        document.body.classList.add('page-not-index');
    }

    const tabs = document.querySelectorAll('.page-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });


    const navLinks = document.querySelectorAll('.nav-link');


    document.addEventListener('click', function(e) {
        if (e.target.closest('.nav-link')) {
            const clickedLink = e.target.closest('.nav-link');
            const href = clickedLink.getAttribute('href');


            e.preventDefault();


            navLinks.forEach(link => link.classList.remove('active'));
            clickedLink.classList.add('active');


            loadContent(href);
        }
    });


    async function loadContent(url) {
        try {

            const targetUrl = new URL(url, window.location.href).href;


            const currentUrlBase = window.location.href.split('#')[0].split('?')[0];
            const targetUrlBase = targetUrl.split('#')[0].split('?')[0];


            if (currentUrlBase === targetUrlBase && targetUrlBase.endsWith('index.html')) {
                console.log('已在首页，不重新加载');
                return;
            }

            const response = await fetch(targetUrl);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Page not found');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('text/html')) {
                // 如果不是HTML，直接跳转
                window.location.href = targetUrl;
                return;
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const newContent = doc.querySelector('.content');
            if (newContent) {
                document.querySelector('.content').innerHTML = newContent.innerHTML;

                if (doc.title) {
                    document.title = doc.title;
                }


                const isTargetIndexPage = targetUrl.endsWith('index.html') ||
                                         targetUrl.endsWith('/');


                if (!isTargetIndexPage) {
                    document.body.classList.add('page-not-index');
                } else {
                    document.body.classList.remove('page-not-index');
                }

                bindInteractiveElements();

                history.pushState({}, doc.title, targetUrl);
            } else {

                window.location.href = targetUrl;
            }
        } catch (error) {
            console.error('加载失败:', error);

            if (error.message.includes('Page not found')) {
                window.location.href = '404.html';
            } else {

                window.location.href = url;
            }
        }
    }


    function bindInteractiveElements() {

        document.querySelectorAll('.page-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }


    function initialize() {

        const currentPath = window.location.pathname;
        const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);

        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            const linkPage = href.substring(href.lastIndexOf('/') + 1);

            if (currentPage === linkPage || (currentPage === '' || currentPage === 'index.html') && linkPage === 'home.html') {
                link.classList.add('active');
            }
        });


        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                targetElement.scrollIntoView();
            }
        }
    }


    initialize();


    window.addEventListener('popstate', function(event) {
        const currentUrl = window.location.href;

        
        const isCurrentIndexPage = currentUrl.endsWith('index.html') ||
                                  currentUrl.endsWith('/') ||
                                  window.location.pathname === '';

        if (!isCurrentIndexPage) {
            document.body.classList.add('page-not-index');
        } else {
            document.body.classList.remove('page-not-index');
        }

        loadContent(currentUrl).catch(error => {
            console.error('历史导航失败:', error);
        });
    });
});

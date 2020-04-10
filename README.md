

In order for the ServiceWorker script in `/assets/js/sw.js` to load correctly, your web server will
need to be configured to set the `Service-Worker-Allowed` header. Here is an example in Nginx, using
a `location` block:

    location ~ assets/js/sw.js$ {
      add_header 'Service-Worker-Allowed' '/';
    }

# There is nothing glamorous to see here

  - this package is just a static js with jquery code that runs on catalog admin pages

# Developing locally

  - Setup:
  ```
  npm install
  ```
  - You will need requestly chrome extension [linked here](https://chrome.google.com/webstore/detail/requestly-redirect-url-mo/mdnleldcmiljblolnjhpnblkcekpdkpa)
 - Open requestly, create a Redirect Rule like so:
  ```
  Request URL Contains //unpkg.com/admin-iframe-compatibility/index.js

  Destination http://localhost:4200/index.js
  ```
  - Save it and leave it on
  - Run the server and you are good to go
    ```
    npm start
    ``` 
  - Just edit the js, save it and refresh admin page to get the new version running

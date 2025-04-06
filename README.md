# Neill Robson's Website

Source code for the personal website and blog of Neill Robson.

[![Deployment status badge](https://github.com/neillrobson/neillrobson.github.io/workflows/Publish%20Website/badge.svg)](https://github.com/neillrobson/neillrobson.github.io/actions)

## Local Development

1. Download or clone the repo

    ```
    git clone git@github.com:neillrobson/neillrobson.github.io.git
    ```

2. Enter the folder

    ```
    cd neillrobson.github.io/
    ```

3. Install dependencies

    ```
    npm install
    ```

4. Run development server

    ```
    npm start
    ```

    > [!NOTE]
    > If you want drafts to be rendered, put `ELEVENTY_ENV=development` into a file named `.env` in the root directory of the project.

5. Access via http://localhost:8080/

6. Check production build

    ```
    npm run build
    ```

## Live Site

-   https://neillrobson.com

## Todo

- [ ] Implement search bar

  - [ ] using frontend-only solution: maybe [lunr](https://lunrjs.com)

- [ ] Switch to [Giscus](https://github.com/giscus/giscus) for comments

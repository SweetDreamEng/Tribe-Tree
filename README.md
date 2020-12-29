## Association of Guardianship For the Sadat Al Ashraf - notes

The site is composed of a Nuxt universal web app + Express server + MongoDB database

Key technologies used:
    - Vue
    - Nuxt
    - D3
    - Node
    - Express
    - MongoDB
    - TailwindCSS

Other minor packages:
Bcrypt, GSAP, PDF2PIC, fs, VueX

Key features:
    - D3 tree graph
    - Animated PDF viewer
    - Auth system
    - Support of 3 different languages
    - Basic admin dashboard - includes file processing

Notes:
    - The main difficulty with the project is the genealogy tree. Currently it's layed out using d3.tree(). The layout supports nodes and children but not marriages. It's likely the entire component will have to be re-written to accomodate a new layout.
    - All the nodes, tribes, users and books are stored in the database. Attached with this repo is an export of a sample DB used in testing - we recommend this be used as a reference.
    - VueX is used for storing auth data on the client side.
    - Vue-i18n is used for language support - this data is within the components themselves in their own tag.
    - TailwindCSS classes are used throughout - though there's a considerable amount of custom CSS in components and /assets aswell.
    - There's a node module used for creating thumbnails for PDF books that has prerequisites for the system that it's run on. The npm module is pdf2pic.




## Build Setup - Nuxt

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

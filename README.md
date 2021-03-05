![https://avatars.githubusercontent.com/u/33359466?s=200&v=4](https://avatars.githubusercontent.com/u/33359466?s=200&v=4)

> 📢 If you'll looking to create a new blog post, you've come to the right place!
> 🏠 For edits to the main brigade.sh site, go [here](https://github.com/brigadecore/brigade-www).
> 📚 For documentation edits to docs.brigade.sh go [here](https://github.com/brigadecore/brigade/tree/master/docs).


## Development

blog.brigade.sh is a simple [Hugo](https://gohugo.io/) static site for the [Brigade](https://github.com/brigadecore/brigade) project. it is built with some tweaks to the [Tale](https://themes.gohugo.io/tale-hugo/) blog theme. To run the website locally, you'll need to first [install](https://gohugo.io/getting-started) Hugo and any dependencies.

```
brew install hugo
yarn install
```

You can then compile and run the site locally:

```
hugo serve
```

## Deployment [![Netlify Status](https://api.netlify.com/api/v1/badges/5f160e82-9368-491b-9557-d75d09752787/deploy-status)](https://app.netlify.com/sites/blog-brigade-sh/deploys)

Changes are automatically deployed to [Netlify](https://app.netlify.com/sites/blog-brigade-sh/deploys) when merged to main. Build logs can be found [here](https://app.netlify.com/sites/blog-brigade-sh/deploys).

---

## Contributing

Anyone can submit a PR to add a post to blog.brigade.sh. We require commits be signed - please refer to the [contributing guide](https://github.com/brigadecore/blog/blob/main/CONTRIBUTING.md#sign-your-work).

Pull requests require [maintainer](https://github.com/brigadecore/blog/blob/main/CODEOWNERS) approval before merge.


### How to Write a Blog Post

Blog posts are created via pull requests. The following steps are used to add them:

1) Add a new file to the `content/` directory whose name is the published date and the title. The files must be markdown formatted. See the existing titles for examples of the format
2) Add the header meta-data to the file using this format (note the permalink structure). Recommended but optional field is `authorname` which should be name(s); these are displayed verbatim.

```yaml
---
title: "A Fancy Title"
slug: "yyyy-mm-dd-fancy-title"
authorname: "Captain Awesome"
date: "yyyy-mm-dd"
---
```

3) Add the content below the `---` as Markdown. The title doesn't need to be re-included in the content.
4) Any images should be placed in the `/content/images/` directory. Images should be losslessly compressed to reduce their size. Tools, such as [ImageOptim](https://imageoptim.com/), can be used.
5) To summarize the content on the blog index page, insert a `<!--more-->` break in your markdown. This will truncate the content with a _Read More_ link.

---

### Code of Conduct

Participation in the Brigade community is governed by the Brigade [Code of Conduct](https://github.com/brigadecore/blog/blob/main/code-of-conduct.md).

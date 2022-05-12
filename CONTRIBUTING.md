# Contributing Guide

This repository contains the source for the official Brigade Blog at
[blog.brigade.sh](https://blog.brigade.sh) and as such follows all of the
policies laid out in the main
[Brigade Contributor Guide](https://docs.brigade.sh/topics/contributor-guide/).
Anyone interested in contributing to this blog should familiarize themselves
with that guide _first_.

The remainder of _this_ document only supplements the above with things specific
to this project.

## Development

> ⚠️&nbsp;&nbsp;If you're only looking to contribute content, you can skip this
> section.

The site is a simple [Hugo](https://gohugo.io/) site built with some tweaks to
the [Tale](https://themes.gohugo.io/tale-hugo/) theme.

> ⚠️&nbsp;&nbsp;The contents of `themes/tale` are a git submodule. __Do not
> tweak the theme by modifying the contents of `themes/tale`.__ Instead, copy
> files you wish to tweak to a parallel directory structure under the root of
> the repository and modify them there. Hugo will automatically favor such files
> when building the site.

After initially cloning this repository, be sure to run the following commands:

```shell
$ git submodule init
$ git submodule update
```

To run the website locally, you'll need to first
[install Hugo](https://gohugo.io/getting-started/installing/).

You can then run a local development server. This process will watch for changes
and automatically refresh content, styles, etc.:

```shell
$ hugo serve
```

## Deployment

Changes are automatically deployed to
[Netlify](https://app.netlify.com/sites/blog-brigade-sh/deploys) when merged to
the `main` branch.

Build logs can be found
[here](https://app.netlify.com/sites/blog-brigade-sh/deploys).

## How to Write a Blog Post

New posts are created via pull requests. The following steps are used to create
one:

1. Add a new file to the `content/` directory whose name is the publication date
   and the title. See existing posts for
   examples.

1. Add [front matter](https://gohugo.io/content-management/front-matter/) to the
   file using this format:

   ```yaml
   ---
   title: "A Fancy Title"
   slug: "yyyy-mm-dd-fancy-title"
   description: "A short byline"
   authorname: "Your Real Name"
   date: "yyyy-mm-dd"
   summary: |
     This optional summary gives you precise control over the preview text that
     appears on the index page.
   ---
   ```

1. Add the content below the `---` as markdown. The title MUST NOT be
   re-included as a header in the content.

1. Any images should be placed in the `/content/images/` directory. Images
   should be losslessly compressed to reduce their size. Tools, such as
   [ImageOptim](https://imageoptim.com/), can help.

1. To summarize the post's content on the index page, insert a `<!--more-->`
   break in your markdown. This will truncate the content on the index page with
   a "Read More" link. For more precise control over this summary, user the
   optional `summary` field in the post's front matter. (See no. 2 above.)

1. Open a PR.

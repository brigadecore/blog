---
title: "Our Secure Supply Chain Obsession"
slug: "2022-04-14-our-secure-supply-chain-obsession"
description: "Let's talk about our project's obsession with securing our software supply chain"
date: "2022-04-14"
author: "Kent Rancourt"
summary: |
  Today we have a somewhat different sort of blog post for you. The project has
  invested significant effort recently in improving our security posture --
  specifically with respect to our software supply chain -- and today we want to
  shed some light on the advances we've made. One reason for doing so, of
  course, is to assure our community that software supply chain security is a
  topic we take very seriously, but we also hope that by sharing valuable
  insight we've gained and applied in recent weeks, that our community can begin
  applying some of those learnings to their own software projects as well.  
---

Hello again, Brigadiers!

Today we have a somewhat different sort of blog post for you. The project has
invested significant effort recently in improving our security posture --
specifically with respect to our software supply chain -- and today we want to
shed some light on the advances we've made. One reason for doing so, of course,
is to assure our community that software supply chain security is a topic we
take very seriously, but we also hope that by sharing valuable insight we've
gained and applied in recent weeks, that our community can begin applying some
of those learnings to their own software projects as well.

## What's a Software Supply Chain, Anyway?

And why does it need to be secured?

For those who may be unfamiliar with the term, we'll start by clarifying what we
mean by "software supply chain." Very few software projects have zero
dependencies on other software. Let's consider a variety of cases.

Most projects, whether open source or proprietary, and regardless of language,
make use of third-party (often open source) packages, and such projects can only
ever be as secure as the third-party packages on which they depend.

So your project doesn't use any third-party packages? OK! But are you still
building and distributing binaries in some form? Your binaries can only ever be
as secure as the compiler you built them with.

Are you building Docker images? The software you bundle into your image can only
be as secure as the base image you started with.

The bottom line is that most software projects have dependencies of _some kind_
on other software, and this web of dependencies is considered your "software
supply chain." And as with any chain, this a software supply chain is only as
strong as its weakest link.

While this has always been justification for concern, it has become even more so
in recent years as hackers have grown in sophistication and begun using
vulnerable software supply chains as attack vectors. Want to introduce a
vulnerability into proprietary or commercial software that you can later
exploit? If you cannot do it directly, how about introducing the vulnerability
into one of their critical dependencies? How about compromising their build
servers and injecting a vulnerability at build time? If this sounds familiar,
it's because it's not merely theoretical. This has happened! The most famous
case, of course, is the
[Solar Winds supply chain attacks](https://en.wikipedia.org/wiki/SolarWinds#2019%E2%80%932020_supply_chain_attacks).

If this sounds like a nightmare to you, you're not wrong.

To secure one's own _software_ requires securing one's _software supply chain_.
Sadly, there's no silver bullet solution to this problem -- although there is no
shortage of companies working feverishly to find one. Currently, the cost of
securing one's software supply chain is _eternal vigilance_, and as such, the
remainder of this post will focus on the incremental steps that the Brigade
project has taken recently to improve our confidence -- and hopefully yours --
in our software supply chain.

## Verified Commits

The first step we took toward securing Brigade's software supply chain was taken
well over a year ago when we instituted a policy that all commits to our source
code repositories in GitHub need to be _verified_. Practically speaking, what
this means is we require the ability to trace every commit back to the GitHub
user who authored it. It's tempting to think this is automatically the case
since any GitHub user must be authenticated to GitHub to open a pull request,
but when you consider that a single pull request could contain commits from
multiple authors, that assumption breaks down. Worse, the possibility will
always exist that a GitHub account has been compromised. Verified commits are
cryptographically signed with a GPG key, thereby offering stronger assurances of
the author's identity. Is it foolproof? Of course not. Keys can be stolen. But
since we've already established that eternal vigilance is the cost to secure
one's software supply chain, every incremental improvement can be counted as a
small win.

To be fully transparent, there's an undeniable downside to our policy of
insisting on verified commits -- and that is many would-be contributors are
presently unfamiliar with the steps required to cryptographically sign their
commits and we believe that has stymied our efforts to grow our contributor
base. While this is unfortunate, we believe that this effect is a temporary one.
Since we expect the industry-wide obsession over software supply chain security
will continue to grow, we also expect most open source projects will eventually
insist on verified commits, and as that practice trends toward ubiquity, it will
become more common for would-be contributors to be familiar with the required
steps. In the near term, we've attempted to mitigate the adverse effects of this
policy by producing an instructional video on the topic that we share with any
would-be contributors who open pull requests containing unverified commits.

## Monitoring Our Dependencies

Another step we took some time ago in an effort to secure our software supply
chain was to enable [Dependabot](https://github.com/dependabot) on all of our
source code repositories. This is quick and easy to do, and besides alerting
maintainers to vulnerabilities in third-party dependencies, it also
automatically opens PRs to upgrade those same dependencies once a patch becomes
available. If you're not already doing this with your own repositories, we
suggest you start immediately.

{{< blockquote >}}
  Stale software is vulnerable software.
{{< /blockquote >}}

But our effort to monitor our dependencies didn't end with Dependabot; it merely
began there. For TypeScript-based components of Brigade and related projects,
we've also integrated a `yarn audit` into our CI processes. While this mostly
surfaces the same vulnerabilities as Dependabot, integrating it directly into
our CI processes means we have the opportunity to detect new vulnerable
dependencies _before_ they're ever committed to our main branch, but with that
being said, the maintainers do not strictly require `yarn audit` to pass in
order for a PR to be merged, because in many cases, the PR we're reviewing has
_not_ introduced new third-party dependencies and isn't remotely responsible for
the failed audit -- and this underscores a critically important point: Software
that passes every single scan or audit you can throw at it _today_ may fail
_tomorrow_, without a single change having been made in the interim. This can
happen simply because new vulnerabilities have been _reported_ in the interim.
_Stale software is vulnerable software,_ so I will repeat -- the cost of
securing your software supply chain is _eternal vigilance_.

Brigade and related projects are mostly implemented in Go, and with very few
exceptions, our software is distributed as Docker images. In recent weeks, we
became aware of an open source tool -- [Grype](https://github.com/anchore/grype)
-- which we instantly fell in love with for its ability to detect vulnerable
packages in most languages, including Go, _and_ its ability to detect vulnerable
system-level packages in a Docker image. In fact, the tool can even scan a
Docker image containing a binary built with Go and report on vulnerable Go
packages and system level packages all at once! Seeing the immediate value in
this, we've integrated image scanning using Grype into all of our CI processes
over the recent weeks. After an image is built, it's immediately scanned. We
treat these scans similarly to the `yarn audit`s. While they have the potential
to stop the introduction of a _new_ package with known vulnerabilities, these
scans frequently tell us about newly _reported_ vulnerabilities in existing
dependencies and in such cases, we don't allow them to block a PR from being
merged.

And this takes us to a very important point: It is, unfortunately, not the case
that every known vulnerability even _can_ be immediately remediated. Sometimes a
vulnerable package cannot be updated to a new, patched version because that
vulnerable version of the package in question is a _transitive dependency_ of
another package which is a direct and critical dependency which has itself, not
been patched yet. There is also such a thing as vulnerabilities that have been
classified as "won't fix," with no patch forthcoming. False positives are also a
thing.

So what can be done about this? Two things.

1. Minimize your dependencies to the greatest extent you are able.

1. Be as transparent as possible with those who use your software.

## Minimizing Dependencies

In terms of Docker images, it's generally true that the more stuff there is in
an image, the more "attackable surface" that image has. Let's use Grype to
demonstrate.

First, let's scan the latest stable Debian release ("Bullseye," as of this
writing), which is certainly a common enough base image:

```shell
$ grype debian:bullseye      
 ✔ Vulnerability DB        [no update available]
 ✔ Pulled image            
 ✔ Loaded image            
 ✔ Parsed image            
 ✔ Cataloged packages      [96 packages]
 ✔ Scanned image           [71 vulnerabilities]
NAME              INSTALLED           FIXED-IN     VULNERABILITY     SEVERITY   
apt               2.2.4                            CVE-2011-3374     Negligible  
bsdutils          1:2.36.1-8+deb11u1               CVE-2022-0563     Negligible  
coreutils         8.32-4+b1           (won't fix)  CVE-2016-2781     Low         

...

tar               1.34+dfsg-1                      CVE-2005-2541     Negligible  
util-linux        2.36.1-8+deb11u1                 CVE-2022-0563     Negligible  
zlib1g            1:1.2.11.dfsg-2                  CVE-2018-25032    Unknown
```

I've abridged the output, but you can see that this image contains 71
vulnerabilities -- and that's before we've layered any software of our own on
top of it.

Compare this to a scan of the latest Alpine (3.15.3, as of this writing) -- a
famously "tiny" Linux distribution, and again, a common enough base image:

```shell
$ grype alpine:3.15.3 
 ✔ Vulnerability DB        [no update available]
 ✔ Pulled image            
 ✔ Loaded image            
 ✔ Parsed image            
 ✔ Cataloged packages      [14 packages]
 ✔ Scanned image           [0 vulnerabilities]
No vulnerabilities found
```

While I expected fewer vulnerabilities, I was for sure shocked to discover none.
But there are still fourteen system-level packages included in this images and
every one of those is just _waiting_ for new vulnerabilities to be discovered
and reported. Scanning this same image tomorrow may yield different results.

If, at this point, you accept my premise that (with all other things being
equal), you minimize your software's attackable surface by starting from the
smallest possible base image, we should start asking ourselves exactly _how_
small of a base image we can get away with. This Alpine image probably _still_
has a lot of things in it that we don't need.

Most of Brigade is implemented in Go and Go binaries can be statically linked.
This means we can layer a Go binary onto a Docker image that contains _virtually
nothing_ and it will still be executable. Let's try it.

In this example, we'll use a `Dockerfile` that describes a build with two
stages. The first stage uses the `golang:1.18` image as its base (Grype found
347 vulnerabilities in that image), but the second stage layers a copy of the
statically linked binary built by the first stage onto a the smallest possible
Docker base image -- `scratch`:

```dockerfile
FROM golang:1.18 as builder

ARG CGO_ENABLED=0

WORKDIR /app

COPY . .

RUN go build -o bin/app .

FROM scratch as final

COPY --from=builder /app/bin/app /app/bin/app

ENTRYPOINT ["/app/bin/app"]
```

The only vulnerabilities Grype may uncover in the resulting image, now or ever,
will be those introduced by third-party Go packages.

It would be tempting to think that we're done, but we're not.

The first problem with where we've landed is that in the highly likely event
that our software needs to interact with the outside world, lacking any
system-level packages means it's lacking any kind of SSL trust store. Good luck
making any HTTPS calls. This _can_ easily be solved by copying the trust store
over from the first, "builder" stage to the second, "final" stage.

The second problem is that even though our image is as minimal as we could
possibly make it, our program will still run as the `root` user. This is bad --
_very bad_ -- and frankly, it's somewhat shocking that exactly how bad this is
isn't more widely known. Docker containers share the the underlying host's
kernel. If your program can be coerced into doing bad things, it does them as
`root` and it can wreak havoc on the underlying host. We can't be having that.

It's not _easy_ to run as a nonroot user on our minimal image. There's no
`useradd` binary that we can run in the second stage of our build to even
_create_ an alternative user to run as. The best we can do is to create the user
in the first stage and copy `/etc/passwd` from the first stage to the second
before applying a `USER` directive to make our program run as that new, nonroot
user.

While none of this is insurmountable, the need for a trust store and the need to
run as a nonroot user surely present enough hoops to jump through that many
developers won't -- or they'll forget. Fortunately, there's an easier way to get
this right with no additional effort. The
[GoogleContainerTools/distroless](https://github.com/GoogleContainerTools/distroless)
project provides a number of base images that are minimal, but still viable for
a number of languages. The `gcr.io/distroless/static:nonroot`, for instance,
provides a perfect base image for a statically linked Go binary.

In the end, our `Dockerfile` might look something like this:

```dockerfile
FROM golang:1.18 as builder

ARG CGO_ENABLED=0

WORKDIR /app

COPY . .

RUN go build -o bin/app .

FROM gcr.io/distroless/static:nonroot as final

COPY --from=builder /app/bin/app /app/bin/app

ENTRYPOINT ["/app/bin/app"]
```

To recap this section: Smaller images are better and it's always best for
software not to run as `root` -- and you can be assured that the Brigade project
is taking this advice to heart.

## Somebody Set Up Us the SBOM

While the title of this section is a fun throwback to a poor translation of
dialog from a late 80's Japanese video game, SBOMs -- software bills of material
-- are serious business. Simply put, an SBOM is a manifest of everything that
went into a piece of software.

Remember when I said that, sadly, not every known vulnerability can be
remediated immediately? Remember when I said you may discover vulnerabilities
tomorrow in software that had no known vulnerabilities today? _Remember when I
said, "Be as transparent as possible with those who use your software?"_ This is
where SBOMs come into play.

If no one can ever truly guarantee their software is 100% invulnerable in
perpetuity, the best and most honest gesture anyone can make to gain the trust
of their users is to be publicly transparent about what's in the software. This
can be instrumental in helping future users assess what new vulnerabilities
impacting your software have been discovered in the time since you released it.

As it turns out, the fine people behind Grype also make a tool called
[Syft](https://github.com/anchore/syft) that can scan a Docker image to generate
an SBOM in a variety of formats. (For what it's worth, Grype seems to actually
_use_ Syft under the covers.)
[SPDX](https://en.wikipedia.org/wiki/Software_Package_Data_Exchange)
(Software Package Data Exchange) is the _de facto_ standard for expressing SBOMs
-- and this itself can be represented in a number of different formats, with
JSON seemingly being the most popular.

It takes little more than a command like this to generate an SBOM for a Docker
image:

```shell
$ syft -o spdx-json debian:bullseye
```

In recent weeks, the Brigade project has integrated this into our release
processes. Just as our CI processes automatically scan images with Grype
immediately after they're built, our release processes now automatically
generate SBOMs with Syft and publish them immediately after pushing images to
to Docker Hub.

This is where we'll freely admit that we're pretty sure there's still room to
improve upon what we're doing with these SBOMs. For the moment, we're publishing
the SBOM for every image we push to its corresponding GitHub release page. This
seems, to us, to be better than nothing, but we expect to discover more useful
things to do with these over time. Although I can claim no expertise on this
topic, I do possess a vague notion that OCI registries (Docker image registries)
are rapidly improving in terms of their ability to attach arbitrary metadata to
images. Some vendors may be ahead of others. I expect, eventually, we'll be able
to _seamlessly_ push our SBOMs to OCI registries with the images themselves.

Recalling once again that the cost to secure the software supply chain is
eternal vigilance, Brigade users can be assured that maintainers will continue
to evolve our process as the state of the art advances.

## Signing Images

Last, but certainly not least, in recent weeks the project has also begun
signing all images we push to Docker Hub. While signing Docker images is not a
new or novel concept, it's something we hadn't been doing previously, and in
light of our recent efforts to minimize our dependencies, scan our images, and
publish bills of material, we wanted to go just one step further to help our
users know that the images they're pulling from Docker Hub are in fact the
_authentic_ images to which this great diligence has been applied.

If you deliver your own software in the form of Docker images, this is once
again, something we highly recommend you begin doing.

## Wrapping Up

All the advancements we've discussed here have already been incorporated into
the latest releases of all Brigade peripherals (gateways, dashboards, etc.) and
the upcoming Brigade v2.4.0 release will incorporate the same advancements into
Brigade itself.

Happy hacking, everyone! Stay secure!

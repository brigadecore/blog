---
title: "Brigade 2 Reaches Third Beta Release"
slug: "2021-09-20-brigade-2-reaches-third-beta-release"
description: "Brigade v2 has cut its third beta release"
date: "2021-09-20"
author: "Kent Rancourt"
summary: Today, we released Brigade v2.0.0-beta.3.
---

Hey, everyone!

It's been a while since our last post, and while we haven't been posting, we _have_ been hard at work. Today, we want to share quite a few updates to give everyone a sense of where the v2 effort currently stands.

Today, we released Brigade v2.0.0-beta.3. Since we're focused primarily on stability and performance at this point, there's not a lot in the release that's blog-worthy, but the things that are, _really_ are.

* Thanks in large part to our summer intern, Willie Yao, with guidance from project maintainers, the `brig term` command, which launches an interactive, text-based UI, has finally been ported from Brigade v1 to v2. It's a little sluggish, but since the team is primarily focused on improving stability and performance, you can expect this to improve in future releases.

* Brigade v2 uses ActiveMQ Artemis for queueing workers and jobs for asynchronous execution. As of this release, we're building our own ActiveMQ Artemis Docker image. Previously, we depended on [some great work by vromero](https://github.com/vromero/activemq-artemis-docker), but he has now archived his project and we wanted to be certain this critical dependency remained in a sustainable position.

* A deceptively small feature addition is poised to pay big dividends. We've added an optional "summary" field to events. This can be thought of as a counterpart to the payload field. The payload field is one method that gateways (or systems even further upstream) have of conveying complex input to an event's worker. The payload is 100% opaque as far as Brigade itself is concerned -- its contents being meaningful only to the system that originated the event and the worker that handles it. The summary field now provides workers with a mechanism for providing complex _output_ that is, likewise, 100% opaque as far as Brigade itself is concerned, but potentially meaningful to gateways and other upstream systems. This will enable us to continue creating ever-smarter gateways.


One final note related to the v2.0.0-beta.3 release: This release, unlike preceding ones, must be installed using [Helm 3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0). Did you know that Helm and Brigade are sister projects? That's why Brigade has been committed to helping test Helm's experimental support for pulling charts from OCI registries (just like Docker images). Previous v2 alpha and beta releases required Helm 3.6.0+ for this same reason, but Helm 3.7.0 has taken a major leap forward in its experimental OCI support. Charts that we push to our registry using Helm 3.7.0, unfortunately, cannot be installed using older versions of Helm. We'll say this though -- we're really happy with how Helm 3.7.0 is working out for us so far and we think you'll be happy with it, too. We know this because we've already been using it for quite some time to publish and install the many v2-compatible gateways we have been working on.

Speaking of which...

## Gateways

When we first got started on v2, we all would have been happy if we had just one or two v2-compatible gateways ready to ship by the time v2 itself went GA, but we've far surpassed our own expectations. We'll have no fewer than a half dozen compatible gateways in _at least_ a beta state by the time v2 goes GA, and some will even go GA in the same timeframe as v2 itself.

These include integrations with:

* [GitHub](https://github.com/brigadecore/brigade-github-gateway)
* [Bitbucket](https://github.com/brigadecore/brigade-bitbucket-gateway/tree/v2)
* [Docker Hub](https://github.com/brigadecore/brigade-dockerhub-gateway)
* [Azure Container Registry](https://github.com/brigadecore/brigade-acr-gateway)
* [CloudEvents](https://github.com/brigadecore/brigade-cloudevents-gateway)

We're also working on a prototype Slack gateway and expect to soon parlay lessons learned from that effort into similar gateways for MS Teams and possibly Discord.

The team is quite pleased to say that with the gateways mentioned above, Brigade v2 should very nicely cover three of our favorite use cases for this platform -- CI/CD, GitOps, and ChatOps.

## Other Integrations

In addition to gateways, the team has two other integrations that we expect to be in at least beta states when v2 reaches GA. These are [Brigade Metrics](https://github.com/brigadecore/brigade-metrics) and the [Noisy Neighbor](https://github.com/brigadecore/brigade-noisy-neighbor), both of which we use to gain operational insight into our own v2 installation. Both of these are, again, largely thanks to Willie Yao, with guidance from project maintainers.

## SDKs

One reason we've been able to build so many integrations so quickly is that we took the time early on to build great SDKs to bind some of our favorite languages to the v2 APIs. We've actually somewhat surprised ourselves with how easy it is to create new integrations. Indeed, in some of the simpler cases, we've gone from prototype to an alpha release in just one day.

If you'd like to build integrations of your own, have a look at:

* [Brigade SDK for Go](https://github.com/brigadecore/brigade/tree/v2/sdk)
* [Brigade SDK for JavaScript (and TypeScript)](https://github.com/brigadecore/brigade-sdk-for-js)

Our [Brigade SDK for Rust](https://github.com/brigadecore/brigade-sdk-for-rust) remains a work-in-progress -- and an area where we'd gladly accept community assistance from fellow Rustaceans.

## Community Building

Brigade maintainers love open source and we love the open source community -- especially Brigade's own users. Unfortunately, we've observed community involvement in the project declining over the past year. Frankly, this was to be expected. History has shown us that when open source projects undertake major pivots, users are understandably reluctant to invest time and energy in either the pre-pivot versions or the unstable next gen version. That reluctance can also be compounded by stale, pre-pivot documentation.

So, now's a good time to emphasize that although Brigade v2 remains in beta at this time, its APIs are stable and the team is committed to avoiding breaking changes at all cost. A complete documentation refresh is also well underway. In short, if you're one of our valued community members who has understandably taken a step back while the maintainers have executed this complex pivot, now is a great time to get involved again! And we'll be happy to set aside some great swag for anyone who wants to help kick the tires on a beta release or develop a new integration. More important than swag, the team is very interested in diversifying the ranks of maintainers, not only in terms of demographics, but also in terms of what companies are represented. The project's current state presents a prime opportunity to quickly become a maintainer of a CNCF project -- a great thing to have on your CV!

If you'd like to collaborate with us, please do find us on [GitHub](https://github.com/brigadecore/brigade/tree/v2) or on our [Slack channel](https://kubernetes.slack.com/messages/C87MF1RFD).

## Recent Podcast Appearance

Our good friend [Bridget Kromhout](https://twitter.com/bridgetkromhout) recently hosted me on the [Arrested DevOps Podcast](https://www.arresteddevops.com/brigade/) to talk about Brigade v2. It was a great time! Give us a listen! Like and subscribe! _(I've always wanted to say that!)_

## KubeCon North America 2021

KubeCon North America 2021 in Los Angeles is just around the corner and Brigade will have a project booth, office hours, and some presence at the Microsoft sponsor booth as well. Some project maintainers will be physically present and others will be participating remotely due to COVID and travel conflicts. Whether in-person or virtually, please do find us. We'd love to chat!


## Wrapping Up

It's an exciting time for this project. Come hang out with us on [Slack](https://kubernetes.slack.com/messages/C87MF1RFD) and have fun with the v2.0.0-beta.3 release!

---
title: "Brigade 2 Reaches Beta"
slug: "2021-07-14-brigade-2-reaches-beta"
description: "Brigade v2 has cut its first beta release"
date: "2021-07-14"
author: "Kent Rancourt"
summary: |
  In March, we introduced the community to Brigade 2. Since then, the team has
  been busy developing features, improving stability, and maintaining a regular
  release cadence.

  Today, the Brigade 2 development effort reached its most significant milestone
  yet -- its first _beta_ release (v2.0.0-beta.1).
---

In March, we
[introduced the community to Brigade 2](https://blog.brigade.sh/2021-03-05-meet-brigade-2/).
Since then, the team has been busy developing features, improving stability, and
maintaining a regular release cadence.

Today, the Brigade 2 development effort reached its most significant milestone
yet -- its first _beta_ release (v2.0.0-beta.1).

This first beta release is primarily composed of bug fixes and minor
features. One major feature that has been added, however, is a new `init`
command in the `brig` CLI, which significantly improves the UX for creating and
configuring new projects. In the coming days, we'll turn the spotlight on this
new feature with its own dedicated blog post.

New features and stability improvements aside, two other aspects of this first
beta release are significant. First, the team has been "dogfooding" Brigade 2
since the previous release. That's right -- we're now using Brigade 2
(periodically built and re-deployed from the head of our `v2` branch) as well as
a new Brigade 2 compatible
[GitHub event gateway](https://github.com/brigadecore/brigade-github-gateway)
to implement CI/CD for Brigade 2 itself and a number of related projects. This
process has instilled operational confidence in what we've been building --
we're quite pleased with how well it is serving us.

Second, and even more significant, our first beta release signals a whole new
phase in Brigade 2's development. In this stage, we're committing to incurring
_no further breaking API changes unless 100% unavoidable_. We hope this new
degree of stability in our APIs enables our own team and the community alike to
accelerate development of Brigade 2 compatible peripherals like event gateways
and GUIs.

To get started with Brigade 2, check out our recently refreshed
[getting started docs](https://v2--brigade-docs.netlify.app/intro/quickstart/)
and, as always, feel free to engage with our team on
[GitHub](https://github.com/brigadecore/brigade/tree/v2) or in our
[channel on the Kubernetes Slack](https://kubernetes.slack.com/messages/C87MF1RFD).
We'd love to help you get started!

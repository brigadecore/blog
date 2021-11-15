---
title: "Brigade 2 Reaches Final Beta Release"
slug: "2021-11-15-brigade-2-reaches-final-beta-release"
description: "Brigade v2 has cut its final beta release"
date: "2021-11-15"
author: "Kent Rancourt"
summary: Today, we're excited to announce that late on Friday, we released Brigade v2.0.0-beta.4 -- which is slated to be our _final_ beta release.
---

Happy Monday, y'all!

Today, we're excited to announce that late on Friday, we released Brigade v2.0.0-beta.4 -- which is slated to be our _final_ beta release.

You can take a look at the [release notes](https://github.com/brigadecore/brigade/releases/tag/v2.0.0-beta.4) for a more complete list of what went into this release, but we'll call out a few highlights here.

First, [Vaughn Dice](https://github.com/vdice) deserves a huge shout out for the massive effort he put into updating docs between the previous release and this one. While we will perpetually work to improve our docs, even after v2 is GA, thanks to Vaughn's efforts, every last bit of documentation has been refreshed for v2.

Also on the documentation front, it was quite some time ago that [Carolyn Van Slyck](https://github.com/carolynvs) updated our [QuickStart](https://v2--brigade-docs.netlify.app/intro/quickstart/) document. In this release, a lot of effort went into streamlining the process she had already documented so well, so the getting-started experience finally lives up to the quality documentation she contributed. It's easier now than ever before to get started with Brigade v2, so please give it a shot!

The last big highlight we'll call out is support for additional platforms. _All_ Brigade components can now run natively on Linux/arm64 (aka linux/aarch64) nodes and workloads (workers and jobs) can run on Windows/amd64. (The control plane still needs to run on Linux nodes.)

Look out for our first v2 release candidate -- with support for stable APIs -- by the end of this week!

Until then, see you all on [Slack](https://kubernetes.slack.com/messages/C87MF1RFD)!

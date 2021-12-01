---
title: "Brigade 2 Goes GA"
slug: "2021-12-01-brigade-2-goes-ga"
description: "Brigade 2 is now generally available"
date: "2021-12-01"
author: "Kent Rancourt"
summary: Brigade 2 is now generally available.
---

Alright, Brigadiers! This is the day we've all been waiting for. Brigade 2 is generally available! If you're ready to get started, head on over to our [QuickStart](https://docs.brigade.sh/intro/quickstart/).

But that's not all!

As promised in [a previous post](/2021-11-17-brigade-v1-support-window), we've given some overdue love to Brigade 1.x as it enters a six month maintenance window. Yesterday we released:

* __Helm chart v1.9.0:__ This installs the existing Brigade v1.4.0 software, but addresses the deprecation or removal of certain beta APIs from newer releases of Kubernetes, making v1.4.0 installable, for the first time, on the newest, shiniest clusters.

* __Helm chart v1.10.0:__ This includes the above improvements, but also installs Brigade v1.5.0, which primarily remediates high severity vulnerabilities in the worker's JavaScript dependencies.

Still, there's more!

In an extraordinarily fortunate quirk of timing, CNCF is hosting our all-new, on-demand webinar starting _tomorrow_, December 2 -- coinciding almost perfectly with Brigade 2's GA release. It's available at your convenience through December 8, so be sure to [RSVP soon](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-on-demand-webinar-so-whats-new-in-brigade-2/).

So what's next for Brigade?

While it won't be long before we start work on v2.1, maintainers will be shifting focus over the near term to put the finishing touches on our latest event gateways and other peripherals, such as Brigade Metrics. We'll also be investing more in building up the Brigade community -- especially the community of v2 users -- so remember that maintainers are always available to chat and answer questions in the [#brigade channel on the Kubernetes Slack](https://kubernetes.slack.com/messages/C87MF1RFD). Come say hello!

Check back soon for updates on gateway releases. Until then, we hope you will enjoy Brigade 2 as much as we've enjoyed building it and using it ourselves!

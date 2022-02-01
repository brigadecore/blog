---
title: "The Brigade GitHub Gateway Goes GA"
slug: "2022-02-01-github-gateway-goes-ga"
description: "The new Brigade GitHub Gateway is now generally available"
date: "2022-02-01"
author: "Kent Rancourt"
summary: The Brigade GitHub Gateway is now generally available.
---

Big news, Brigadiers!

Since Brigade v2's release two months ago, the team's shifted its attention to
making our various v2-compatible gateways production-ready, and today we're
proud to announce that the first of those -- one we perceive as extraordinarily
useful -- has reached general availability. Today we'd like to introduce you
to the all new
[Brigade GitHub Gateway](https://github.com/brigadecore/brigade-github-gateway).

As you might infer from its name, the Brigade GitHub Gateway transforms events
(webhooks) from GitHub into _Brigade_ events and emits them into Brigade's event
bus. Although the gateway works with any and all events emitted by a
[GitHub App](https://docs.github.com/en/developers/apps), its most common use
case is as a trigger for CI/CD pipelines that execute within Brigade -- and, in
fact, this is exactly how Brigade's own CI/CD pipelines have been implemented.

Putting aside its obvious utility, what the maintainers are most excited about
is how effectively this new gateway demonstrates the vision behind Brigade v2.
When we first decided to re-architect the platform and build it around a rich,
new API, one of the motivating factors was a desire to implement "smarter"
gateways that could assume responsibility for onerous tasks that Brigade v1 had
previously left to script authors. In Brigade v1, for instance, reporting
statuses back to GitHub (through the
[Checks API](https://docs.github.com/en/rest/reference/checks)) was the
sole responsibility of the script author, and although libraries sprang up over
time to help with this, it was never truly _easy_. Brigade v2's improved
architecture has permitted the Brigade GitHub Gateway to include an
event-monitoring component that automatically watches the status of all jobs
associated with CI/CD-related events and reports their statuses back to GitHub.

If you're interested in installing this gateway, check out the
[install docs](https://github.com/brigadecore/brigade-github-gateway/blob/main/docs/INSTALLATION.md).
If you're interested in subscribing to and handling events from this gateway,
check out our 
[CI/CD recipe](https://github.com/brigadecore/brigade-github-gateway/blob/main/docs/CI_CD.md#cicd-recipe)
or our complete 
[event reference](https://github.com/brigadecore/brigade-github-gateway/blob/main/docs/EVENT_REFERENCE.md).

In any case, if you need help or want to offer feedback, you can always find the
maintainers in
[the #brigade channel on the Kubernetes Slack](https://slack.brigade.sh) and
we're always happy to chat!

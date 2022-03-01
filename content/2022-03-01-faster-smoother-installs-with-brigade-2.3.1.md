---
title: "Faster, Smoother Installs with Brigade 2.3.1"
slug: "2022-03-01-faster-smoother-installs-with-brigade-2.3.1"
description: "Brigade 2.3.1 installs faster and more smoothly"
date: "2022-03-01"
author: "Kent Rancourt"
summary: "Brigade 2.3.1 provides a faster, smoother installation experience."
---

Hello again, Brigadiers!

We've never been so excited to tell anyone about a patch release as we are
today. Brigade v2.3.1 may be our smallest release to date, but it packs a big
punch!

All versions of Brigade prior to this one experienced a lot of "flapping" during
initial installation. Our API server depends on both a MongoDB database and an
Artemis (ActiveMQ) messaging server. In the common case, the API server would
come up _before_ the database and messaging server were ready and would _crash_.
Since Brigade runs inside Kubernetes, that's ok, right? Kubernetes will restart
the pod! We relied on this behavior for quite some time. The problem, however,
is that while the API server was waiting for the database and messaging server
to become available, our scheduler and observer components (microservices) were
also waiting -- for the _API server_ to become available. _They too_ would crash
and restart repeatedly until the API server became available. The inevitable
result was most of our pods would be in a `CrashLoopBackOff` and it could
sometimes take a considerable amount of time for those to resolve.

Feeling we did not need to settle for this, v2.3.1 components block internally
while waiting for their network-bound dependencies to be satisfied. The
rationale for this is that the system, as a whole, installs and starts faster if
individual components wait _longer_ for their dependencies to be satisfied
instead of crashing repeatedly and trying again in a progressive back-off. The
end result is that Brigade v2.3.1 installs faster, with no "flapping."

We really hope that this faster, smoother installation process makes Brigade
easier and more approachable than ever before for new Brigadiers!

Happy scripting, everyone! And until next time, remember you can always find the
maintainers on
[the #brigade channel on the Kubernetes Slack](https://slack.brigade.sh) if you
have questions or need help getting started!

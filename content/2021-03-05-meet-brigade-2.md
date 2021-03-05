---
title: "Meet Brigade 2"
slug: "2021-03-05-meet-brigade-2"
description: "We're proud to announce the first alpha release of Brigade 2!"
date: "2021-03-05"
author: "Kent Rancourt"
---

For some time now, the Brigade maintainers, building upon the community's
experiences using the product, as well as our own, have been hard at work
planning and implementing a major revision of the platform. Today, we're proud
to announce a milestone in that effort -- the release of __Brigade
v2.0.0-alpha.1__. While we're still working out the kinks and cultivating an
extended Brigade 2 ecosystem, we feel it is time to begin introducing the
community to Brigade 2.

If you're unfamiliar with Brigade, now might be a good time to head over to
[brigade.sh](https://brigade.sh) and get acquainted, as the rest of this post
assumes at least a passing familiarity with the platform.

## What Has Changed? What Hasn't?

Two things that Brigade's maintainers have learned over time are that success
with the platform requires a fair degree of Kubernetes competency -- and that
with a better abstraction, users _not_ particularly versed in Kubernetes could
also find value in Brigade. So, paradoxically, Brigade 2's biggest change is
also subtle in some respects. Those familiar with Brigade 1.x might also be
familiar with its tagline -- "event-driven scripting for Kubernetes." Brigade
2's tagline might be written more appropriately as "event-driven scripting (for
Kubernetes)." This reflects our effort to abstract end-users away from
Kubernetes as cleanly as possible whilst not hiding it entirely from those who
are both familiar and have access to the underlying cluster.

Kubernetes fading into the background as an implementation detail, necessarily,
has had a broad impact on Brigade's overall architecture. Where the Brigade 1.x
CLI and event gateways all interacted directly with the Kubernetes API server
for instance, their Brigade 2 counterparts interact with an all-new Brigade API.
This has been an incredibly positive change, as having our very own API has
granted the project latitude to do some really amazing things that weren't
previously possible.

A non-exhaustive list of highlights includes:

* __Access to the underlying cluster is no longer a prerequisite for end-users.__
* Support for authenticating with OpenID Connect and a compatible identity
  provider such as
  [Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/)
  or
  [Google Cloud Identity Platform](https://cloud.google.com/identity-platform/).
* A subscription-based event bus. Gateways can emit events into Brigade without
  knowing who the event is for. All subscribers receive a copy of the event.
* Event data (including logs) now persists beyond the lifetime of the
  Kubernetes pod(s) that handle the event.
* Support for jobs composed of multiple OCI containers (i.e. jobs having sidecar
  containers).
* Easier and substantially improved integrations:
    * Custom workers (container-based event processors) and event gateways are
      easier than ever to create.
    * Event gateways can now follow up on the status of events they have emitted
      into Brigade, perhaps to report status upstream.
    * Official SDKs for Go, JavaScript / TypeScript, and Rust (experimental)
      mean custom workers, event gateways, UIs, etc. can be implemented with
      whichever of these popular languages you are most comfortable.

Other noteworthy advancements not directly attributable to the revised
architecture include dramatically improved UX and support for handling events
using TypeScript.

To address one final, less technical change -- naming things is _hard_. In
Brigade 1.x, a single event spawned a single _build_, so unsurprisingly, the
term "build" came to be used almost synonymously with "event." Using the CLI for
instance, a user may have queried for "builds" rather than "events." Over time,
the maintainers have come to realize that this nomenclature promoted an
inaccurate notion that Brigade is a CI platform. While CI _is_ a notable and
popular use case that Brigade addresses well, Brigade has never been constrained
to such uses. In Brigade 2, we've stricken the term "build" from our vernacular.
Now there are just _events_. Project subscribe to events. Brigade spawns workers
to _handle_ events.

So what hasn't changed then?

Despite the many changes under the hood, the maintainers believe we have
remained faithful to Brigade's original vision, and as such most general
knowledge of Brigade 1.x should carry over to Brigade 2. At the end of the day,
Brigade 2, like its predecessor is simply about connecting events from any
arbitrary source (provided a gateway exists or can be developed) with any
arbitrary action (script).

A lot of love has gone into this exciting product refresh and we hope you'll
love it as much as we do.

## What's Next?

We're not done. With this first alpha release behind us, we're anticipating
further alpha and beta releases, and eventually release candidates, on a regular
cadence.

At present, we're very focuses on:

* Squashing bugs
* Refreshing documentation
* Feature development
* Building integrations to both broaden the ecosystem and identify bugs and
  missing API features:
    * A new GitHub gateway, with more gateways to come
    * A team of students from Brigham Young University is working independently
      on a refreshed, Brigade 2 compatible _Kasthi_ (Brigade UI).

Brigade 2 may be a work-in-progress, but if you'd like to start getting
familiar, it's not too early, and it's the perfect time to provide feedback or
even begin contributing!

So how does one get started?

## Kicking the Tires

To get started, you need a Kubernetes cluster. Although we've worked hard to
abstract Kubernetes, Brigade's control plane is nevertheless packaged as a Helm
chart for ease of deployment _to_ Kubernetes and it uses that same Kubernetes
cluster as a "workload execution substrate" (data plane).

### Installing

__We cannot emphasize strongly enough that if you are just kicking the tires,
Brigade 2 should only be installed on a _private_ cluster -- either
[minikube](https://minikube.sigs.k8s.io/docs/) or
[kind](https://kind.sigs.k8s.io/) on your local machine, or a remote cluster
_that you do not share with anyone else_. The reason for this is that the
instructions that follow will install Brigade on your cluster with common,
insecure defaults and no support for OpenID Connect, which is required for
securing a multi-user environment.__

All commands below assume you're working within a POSIX-compliant shell such as
bash, zsh, or the Windows Subsystem for Linux.

First, you'll need Helm 3 with experimental support for OCI registries enabled:

```console
$ export HELM_EXPERIMENTAL_OCI=1
```

Next, pull the chart from the GitHub Container Registry and _export_ it to save
it somewhere on your local file system. In the example below, we store it at
`~/charts`:

```console
$ helm chart pull ghcr.io/brigadecore/brigade:v2.0.0-alpha.1
$ helm chart export ghcr.io/brigadecore/brigade:v2.0.0-alpha.1 -d ~/charts
```

Now create a Kubernetes namespace to install Brigade into. We use `brigade2`:

```console
$ kubectl create namespace brigade2
```

And install Brigade with default configuration:

```console
$ helm install brigade2 ~/charts/brigade --namespace brigade2
```

It can take a few minutes for everything to come up and some components may
"flap" until other components upon which they depend are running and available.

If you're well-versed in Helm, feel free to inspect and tweak configuration
values, but doing so is beyond the scope of these instructions.

### Exposing the API Server

Because you are presumably following these steps in a local cluster, the best
method of exposing Brigade 2's API server is to do something like this after
installation:

```console
$ kubectl --namespace brigade2 port-forward \
    service/brigade2-apiserver 8443:443 &>/dev/null &
```

### Install the CLI

Next, download the appropriate, pre-built `brig` CLI (command line interface)
from our [releases page](https://github.com/brigadecore/brigade/releases) and
move it to any location on your path, such as `/usr/local/bin`, for instance.

If you're already a frequent Brigade 1.x user, you may want to rename the binary
to something like `brig2` to avoid confusing it with your existing Brigade 1.x
CLI.

You may also have to enabled execution of the downloaded file with
`chmod 755 <path/to/file>` and your OS may enforce other security restrictions
that require you to explicitly allow execution of this new binary.

### Logging In

Log in as the "root" user, using the default root password `F00Bar!!!`. Be sure
to use the `-k` option to indicate tolerance for the API server's self-signed
certificate.

```console
$ brig -k login --server https://localhost:8443 --root
```

For security reasons, root user sessions are invalidated one hour after they are
created. If you play with Brigade 2 for more than an hour, or you walk away and
come back, you will have to log in again.

Remember, for drastically improved security, we support authentication using
Open ID Connect and third-party identity providers like
[Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/)
or
[Google Cloud Identity Platform](https://cloud.google.com/identity-platform/),
but configuring that is a bit more involved and doesn't work well if you're
taking Brigade 2 for a test drive in a local environment like minikube or kind,
so it's beyond the scope of this introduction.

### Creating a Project

Your next step is to create a Brigade __project__. Unlike Brigade 1.x, this is
not accomplished by means of an onerous, interactive process. Rather, it is
accomplished using a file that looks suspiciously like a Kubernetes manifest
(but isn't).

You can download an example from
[here](https://raw.githubusercontent.com/brigadecore/brigade/v2.0.0-alpha.1/examples/javascript/pipeline-demo.yaml):

With this file stored locally, at a location such as `~/pipeline-demo.yaml`, for
instance, you can direct Brigade to create a new project from this file:

```console
$ brig -k project create --file ~/pipeline-demo.yaml
```

If you want to alter the example, [VS Code](https://code.visualstudio.com/) with
the
[Red Hat's YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
installed can enable context help!

### Creating an Event

With your first project set up, it's time to create your first event:

```console
$ brig -k event create --project pipeline-demo
```

On success, this step will reveal the ID of the new event, which will be handled
_asynchronously_ by Brigade 2.

### Watch the Event

To view the status of the event:

```console
$ brig -k event get --id <event id from previous step>
```

Eventually, the worker spawned to process the event, and any jobs spawned by
the worker, should all display a `SUCCEEDED` status.

Congratulations! You're using Brigade 2!

## Wrapping Up

We're really excited about Brigade 2 and we hope you are as well!

We invite everyone to continue beyond the simple tutorial above and begin
getting familiar with this first alpha release to see what it can do -- it can
do a lot already. More importantly,
[please file issues](https://github.com/brigadecore/brigade/issues)
to tell us about problems
you encounter or even to make feature requests! Please also feel free to
engage us in the [#brigade](https://kubernetes.slack.com/messages/C87MF1RFD)
channel on the Kubernetes Slack!

We'll see you on the internet!

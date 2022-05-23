---
title: "Leave the YAML at Home!"
slug: "2022-05-23-leave-the-yaml-at-home"
description: "Did you know Brigade involves a minimal amount of YAML?"
date: "2022-05-23"
author: "Kent Rancourt"
summary: "We hear people aren't always crazy about YAML. Have you met Brigade?"
---

Hello again, Brigadiers!

We've heard from time to time that people aren't always so crazy about YAML --
and that's putting it nicely. If you dare to search for "yaml sucks" in your
favorite search engine, you'll find a litany of criticism. While I don't
generally harbor such strong anti-YAML sentiment, I do feel strongly that
declarative languages -- YAML included -- are not ideal tools for modeling
complex workflows. So I thought I'd mention... Brigade involves a _minimal_
amount of YAML -- so little in fact, that it's fair to say you can "leave the
YAML at home."

{{< pullout >}}
  Project definitions are often quite concise and are typically the only YAML
  you write.
{{< /pullout >}}

Presumably, if you're reading our blog, you already know that Brigade is an
event-driven scripting platform for Kubernetes, but in case you're still very
new to Brigade, let's briefly discuss one of Brigade's most fundamental
concepts.
[__Projects__](https://docs.brigade.sh/topics/project-developers/projects/) pair
__event subscriptions__ with configuration for an event handler called a
__worker__. These project definitions are often quite concise and are typically
the only YAML you write when using Brigade.

To demonstrate, let's look at a _real_ project definition. This happens to be
Brigade's _own_ project definition!

```yaml
# yaml-language-server: $schema=https://schemas.brigade.sh/schemas-v2/project.json
apiVersion: brigade.sh/v2
kind: Project
metadata:
  id: brigade
description: Brigade built with Brigade!
spec:
  eventSubscriptions:
  - source: brigade.sh/github
    qualifiers:
      repo: brigadecore/brigade
    types:
    - ci:pipeline_requested
    - ci:job_requested
    - cd:pipeline_requested
  workerTemplate:
    git:
      cloneURL: https://github.com/brigadecore/brigade.git
```

Besides being the only YAML you typically write when using Brigade, most of the
above can be generated for you with the `brig init` command!

For good measure, let's mention that project definitions such as this one can be
submitted to your Brigade API server like so:

```shell
$ brig project create --file project.yaml
```

With this very small bit of YAML out of the way, _everything else you do is with
JavaScript or TypeScript_. Both of these languages are enormously popular with
developers and we think they're superior tools for modeling complex workflows,
especially compared to yards and yards of YAML.

Your script can be as simple as:

```javascript
console.log("Hello, World!")
```

More commonly, scripts are written to dispatch events to a suitable handler
function:

```javascript
const { events } = require("@brigadecore/brigadier");

events.on("brigade.sh/github", "ci:pipeline_requested", async event => {
  // Script your CI workflow here
});

events.on("brigade.sh/github", "cd:pipeline_requested", async event => {
  // Script your CD workflow here
});

events.process();
```

You can describe your workflows as arbitrarily complex graphs of __jobs__ --
where, behind the scenes, each job is an assembly of one or more containers
running in its own Kubernetes pod.

Here's a simplified excerpt from Brigade's own `brigade.ts` script:

```typescript
import { events, Job } from "@brigadecore/brigadier"

const goImg = "brigadecore/go-tools:v0.9.0"
const srcPath = "/src"
// ...

events.on("brigade.sh/github", "ci:pipeline_requested", async event => {
  const testJob = new Job("test", goImg, event)
  testJob.primaryContainer.command = ["make"]
  testJob.primaryContainer.arguments = ["test-unit"]
  testJob.primaryContainer.sourceMountPath = srcPath
  testJob.primaryContainer.workingDirectory = srcPath

  const lintJob = new Job("lint", goImg, event)
  lintJob.primaryContainer.command = ["make"]
  lintJob.primaryContainer.arguments = ["lint"]
  lintJob.primaryContainer.sourceMountPath = srcPath
  lintJob.primaryContainer.workingDirectory = srcPath

  // ...

  await Job.concurrent(
    testJob,
    lintJob,
    // ...
  ).run()
})

// ...

events.process();
```

In the excerpt above, we respond to `ci:pipeline_requested` events by executing
`make test-unit` and `make lint` concurrently (subject to scheduling
constraints). Each executes in its own container, in its own pod. Those
containers are both based on a `brigadecore/go-tools:v0.9.0` image that's
pre-loaded with all of our team's most frequently used
[Go]([Go](https://golang.org))-based tools.

{{< pullout >}}
  The full range of what you can accomplish with Brigade is unbounded.
{{< /pullout >}}

With JavaScript and TypeScript being
[Turing complete](https://en.wikipedia.org/wiki/Turing_completeness) languages,
the full range of what you can accomplish with Brigade is unbounded and you are
free to implement your workflows using everything those languages have to offer
-- use `try`, `catch`, and `finally` to handle errors, extract your own patterns
and preferences into reusable NPM modules, or consume third-party modules using
either `npm` or `yarn` as your dependency manager. Whenever applicable, Brigade
workers will run an `npm install` or `yarn install` before executing your
script!

With all this power and flexibility of full-featured programming languages at
our disposal, we think it's time to leave the YAML at home.

Head on over to [docs.brigade.sh](https://docs.brigade.sh) if you'd like to
learn more, and until next time, remember that maintainers are always available
to chat in [the #brigade channel on the Kubernetes Slack](https://slack.brigade.sh)
if you have questions or need help getting started.

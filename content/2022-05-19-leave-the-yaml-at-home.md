---
title: "Leave the YAML at Home!"
slug: "2022-05-19-leave-the-yaml-at-home"
description: "Did you know Brigade involves a minimal amount of YAML?"
date: "2022-05-19"
author: "Kent Rancourt"
summary: "We hear people aren't always crazy about YAML. Have you met Brigade?"
---

Hello again, Brigadiers!

We've heard from time to time that people aren't always so crazy about YAML --
and that's putting it nicely. I don't personally harbor such strong anti-YAML
sentiment, but the critics are out there, and as critics often are, they're
quite vocal. If you dare to search for "yaml sucks" in your favorite search
engine, you'll find a litany of criticism -- some of it valid. So we thought
we'd better mention... Brigade involves a _minimal_ amount of YAML -- so little in
fact, that it's fair to say you can "leave the YAML at home."

Presumably, if you're reading our blog, you already know that Brigade is an
event-driven scripting platform for Kubernetes, but in case you're still very
new to Brigade, let's summarize one of Brigade's most fundamental concepts --
[__projects__](https://docs.brigade.sh/topics/project-developers/projects/).
Projects pair __event subscriptions__ with configuration for an event handler
called a __worker__. These project definitions are often quite concise and
are typically the only YAML you write when using Brigade.

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

While the above closely resembles a Kubernetes manifest, it is not. Let's pick
it apart:

* If your text editor or IDE integrates with the YAML language server, the
  comment on the first line will allow your editor or IDE to validate your
  project definition and offer context help. (I use
  [VS Code](https://code.visualstudio.com/) with
  [YAML Language Support by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).)

* As with a Kubernetes manifest, we move on to denote what type of resource this
  YAML describes using the `apiVersion` and `kind` fields, and the `metadata.id`
  field assigns an immutable identifier to our project. The `description` field
  is probably self-explanatory.

* The `spec` portion of the file does exactly what we said earlier that projects
  do -- it pairs event subscriptions with worker configuration.

    * The `eventSubscriptions` field uses `source`, `types`, and `qualifiers` to
      describe events of interest. Event gateways and other event sources
      document what sort of events they emit and exactly how to subscribe to
      them. Here, we're interested in three specific event types that originate
      from the Brigade GitHub Gateway (identified by `source:
      brigade.sh/github`)
      _provided_ the gateway qualified the event as being related to the
      [`brigadecore/brigade`](https://github.com/brigadecore/brigade) repository
      on GitHub. (For reference, all events available from that gateway are
      described
      [here](https://github.com/brigadecore/brigade-github-gateway/blob/main/docs/EVENT_REFERENCE.md).)

    * The `workerTemplate` portion of the file describes the worker that should
      handle the events. In this simple case, it only uses the `git.cloneURL`
      field to indicate where project source -- including the script we'd like
      to run -- can be obtained.

This is all the YAML you write! (And, actually, most of this can be generated
for you with the `brig init` command!)

For good measure, let's mention that project definitions such as this one can be
submitted to your Brigade API server like so:

```shell
$ brig project create --file project.yaml
```

With this very small bit of YAML out of the way, _everything else you do is with
JavaScript or TypeScript_ -- both of which are enormously popular with developers
and are, we think, superior methods of modeling complex workflows (as compared
to yards and yards of YAML).

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

With JavaScript and TypeScript being
[Turing complete](https://en.wikipedia.org/wiki/Turing_completeness) languages,
the full range of what you can accomplish with Brigade is unbounded. More than
simply being unbounded, you're free to implement your workflows using everything
those languages have to offer -- use `try`, `catch`, and `finally` to handle
errors, extract your own patterns and preferences into reusable NPM modules, or
consume third-party modules using either `npm` or `yarn` as your dependency
manager. Whenever applicable, Brigade workers will run an `npm install` or
`yarn install` before executing your script!

With all this power and flexibility at your finger tips, isn't it time you left
the YAML at home?

Head on over to [docs.brigade.sh](https://docs.brigade.sh) if you'd like to
learn more, and until next time, remember that maintainers are always available
to chat in [the #brigade channel on the Kubernetes Slack](https://slack.brigade.sh)
if you have questions or need help getting started.

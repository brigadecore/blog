---
title: "Latest alpha release for Brigade v2"
slug: "2021-05-11-brigade-v2-alpha-4"
description: "We're excited to announce the latest alpha release for Brigade v2"
date: "2021-05-11"
author: "Vaughn Dice"
---

The Brigade maintainers are excited to announce the latest alpha release for
Brigade v2, [Brigade v2.0.0-alpha.4]. With this release, we expect to
transition away from major feature work or breaking changes and instead move
into beta territory.  In doing so, we'll start focusing more on squashing bugs,
improving UX, adding documentation and making other refinements to the
codebase.

There have been many notable improvements in the handful of releases since the
[Brigade v2 announcement post]. Here we'll go over the highlights.

## GitHub Authentication

Brigade 2 has supported user authentication via [OpenID Connect] since its
first alpha release.  In alpha.4, we've now added support for [GitHub OAuth].

We anticipate many developers will choose this route for a low-overhead option
to secure their Brigade instance, as it is quite likely that users will have
pre-existing GitHub accounts at the ready.

To set up GitHub authentication with Brigade, one would create a
[GitHub OAuth App] with the authorization callback URL set to point to the
`/v2/session/auth` endpoint on the Brigade instance's public-facing API server
address.  The OAuth Apps's client ID and a newly-generated client secret can
then be provided as values when installing the Brigade 2 Helm chart. (They go
under `github` in the [thirdPartyAuth] section of the chart's values file.)


## Streamlined Admin login

For initial setup, Brigade offers a streamlined method for designating which
users should be assigned admin privileges out of the gate, bypassing the need
for the operator to manually create the proper role assignments for each admin
beforehand.

Each user added to the `admins` list in the same [thirdPartyAuth] section as
above will then be automatically granted admin privileges upon initial login.
Entries in this list should represent each user's identifier according to the
chosen authentication strategy, e.g. their email address when using OpenID
Connect or their username on GitHub.

Admins can then proceed with creating scoped role assignments for all future
users authenticating into the system. 

# CLI updates

The `brig` CLI now ships with a handful of new and/or update commands.  Let's
review them below.

## Event clone

There may be cases where an event has already run and a user would like to
clone this event's details to run again, perhaps with an updated Worker
configuration.  Maybe the default config file (e.g. `brigade.js`) for a Worker
required a patch or some other type of update, and they would like to use this
to run the same event as before.  In that case, `brig event clone` is the
command to use:

```
$ brig event clone -i <original event uuid>
```

## Event retry

Consider the case when a user wishes to re-run a prior event with the same
worker configuration used originally.  Perhaps a job failed somewhere in the
pipeline due to an intermittent error and the user expects it will succeed
given another chance.  This is what `brig event retry` is intended for.

```
$ brig event retry -i <original event uuid>
```

## Follow flag

For the two new event commands above, as well as `brig event create`, a new
flag (`-f/--follow`) can be used to follow logs as soon as the event has been
pulled from the queue for processing.  Previously, one would create the event
and then issue the corresponding `brig event logs -f -i <event uuid>` command.
Now this can be done in one CLI invocation:

```
$ brig event create -p <project id> -f
```

## Project Secrets

Lastly, the `brig project secret set` command has been updated to allow users
to add secrets via a file to a project ad hoc.  It takes a reference to a flat
JSON or YAML file and updates a given project with the parsed secret values.

```
$ jq -n '{ password: "top$secret!" }' > project-secret.json

$ brig project secret set -p hello-world -f project-secret.json

Set secret "password" for project "hello-world".
```

## Come join us

We're really excited about the progress being made on Brigade 2 and we'd be
delighted to help users and developers get up to speed.  Check out the
[previous blog post][Brigade v2 announcement post] and/or the [v2 README]
for tutorials on how to get started.

[Please file issues](https://github.com/brigadecore/brigade/issues)
to tell us about problems
you encounter or even to make feature requests!  We're also available to answer
questions in the [#brigade](https://kubernetes.slack.com/messages/C87MF1RFD)
channel on the Kubernetes Slack.

Thanks for reading and see you on the internet!

[Brigade v2.0.0-alpha.4]: https://github.com/brigadecore/brigade/releases/tag/v2.0.0-alpha.4
[Brigade v2 announcement post]: ./../2021-03-05-meet-brigade-2
[OpenID Connect]: https://openid.net/connect/
[GitHub OAuth]: https://docs.github.com/en/github/authenticating-to-github/authorizing-oauth-apps
[GitHub OAuth App]: https://docs.github.com/en/developers/apps/creating-an-oauth-app
[thirdPartyAuth]: https://github.com/brigadecore/brigade/blob/845c9d7585883db98735400efd229315e3c0bc7a/charts/brigade/values.yaml#L34-L72
[v2 README]: https://github.com/brigadecore/brigade/blob/v2/README.md
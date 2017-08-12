# Feedbin Mailer

This project allows you to create a newsletter from new activity in your Feedbin account. Here's [an example of an email sent by this project](http://www.blogstomail.com/emails/example.html).

## Why?

I like [Feedbin](https://feedbin.com/), but I also like getting a daily email summary of my news and blogs. I looked around a bit and didn't find a solution that would send me the latest posts from each of my tags every day, so I set this project up.

## Requirements

- Docker
- Feedbin
- Sendgrid
- Amazon S3
- If you want to use the included deployment scripts, you'll also need to use Hyper.sh and Codeship. You can definitely modify it to suit your own needs though.

## Architecture

This project includes two small Node applications:

- `/collector`
- `/mailer`
- `/migrations` not working yet

## Local Setup

- Clone this repository.
- Copy the `.env.example` file to `.env` and add your configuration info.
- Build the Dockerfile: `npm run -s app:local:build`.
- Start up the webserver: `npm run -s app:local:up`.
- Run the mailer: `npm run -s app:local:run`.

This will get all the articles from your Feedbin account for the past 24 hours and compose an email to you.

## Testing
- Run `npm run -s app:test` to run the test suite within a Docker container.

## Server Setup

Once you have the Hyper.sh console running locally:

- Set up your `.env` file for production.
- Encrypt your Docker config: `jet encrypt ${HOME}/.docker/config.json docker/dockercfg.encrypted`.
- Run the deployer container: `npm run -s app:prod:deploy`.

To manually run the script in production, set up your `.env` file and run 

```bash
bash docker/run.hyper.sh
```

To set up a cron job to automatically run the job every day at 9am UTC:

```bash
hyper cron create --minute=0 --hour=9 --name feedbinmailercron --env-file .env karllhughes/feedbin-mailer
```

## License
Copyright 2017, Karl Hughes

>   Licensed under the Apache License, Version 2.0 (the "License");
>   you may not use this file except in compliance with the License.
>   You may obtain a copy of the License at
>
>     http://www.apache.org/licenses/LICENSE-2.0
>
>   Unless required by applicable law or agreed to in writing, software
>   distributed under the License is distributed on an "AS IS" BASIS,
>   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
>   See the License for the specific language governing permissions and
>   limitations under the License.

# Feedbin Mailer

This project allows you to create newsletters from new activity in your Feedbin RSS feeds. Here's [an example of an email sent by this project](https://www.blogstomail.com/emails/example.html).

## Why?

I like [Feedbin](https://feedbin.com/), but I also like getting a daily email summary of my news and blogs. I looked around a bit and didn't find a solution that would send me the latest posts from each of my tags every day, so I set this project up.

## Development

### Requirements

This project relies on a lot of external services. This makes it easy to maintain, but it's also a decent amount of work to get set up. At some point I'd like to make this easier, but it is what it is.

- Feedbin - The whole project relies on you having a paid Feedbin account
- Sendgrid - Sends emails
- Amazon S3 - Hosts static HTML versions of your emails
- Node/NPM - Setup scripts are run in NPM
- Docker - Used for local development
- Hyper.sh - Container hosting and cron jobs

### Architecture

This project includes two small Node applications:

- **Collector** (`/collector`) - Responsible for collecting new entries from Feedbin every hour and updating the list of feeds for each of your tags.
- **Mailer** (`/mailer`) - Sends an email based on the preferences set for your newsletters in the `tags` table.

You can find bash scripts for Docker in the `/docker` folder and a database schema file in the `/database` directory.

### Local Setup

- Clone this repository.
- Copy the `.env.example` file to `.env` and add your configuration info.
  - You will need to have API keys for Amazon AWS, a bucket in S3, a Sendgrid API key, and a Feedbin account.
  - You will also need to have a domain name pointed at your S3 bucket if you want to view the emails offline.
  - The Hyper.sh credentials are only required for deploying to production. 
- Build the Dockerfile for the collector: `npm run -s collector:local:build`.
- Build the Dockerfile for the mailer: `npm run -s mailer:local:build`.
- Start the database container: `npm run -s db:local:up`.
- Run the migrations (first time only): `npm run -s db:local:migrate`.
- Run the collector: `npm run -s collector:local:run`.
- Run the mailer: `npm run -s mailer:local:run`.

This will get you the latest the articles from your Feedbin account and compose an email to you.

### Testing

Coming soon!

### Deployment

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

## Contributing

While this project is primary to scratch my own itch, you're welcome to suggest improvements. Just make a PR or create an issue.

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

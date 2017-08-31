# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Added
- New serve.js file to preview/edit emails.

### Changed
- Ordering entries by popularity in each newsletter.

## [1.2.0] - 2017-08-24

### Added
- Url resolver service to ensure we're getting the final resolved url for entries.
- Summarizer which uses [Aylien](https://developer.aylien.com/) to summarize and retrieve full text content for articles.
- Image extractor gets the URL for the most prominent image in each entry.

### Changed
- Renamed social to "socializer" for consistency.
- Moved .env files into the directory for each service. 

## [1.1.0] - 2017-08-17

### Added
- Social data collector.
- Social media counts to email.

### Changed
- Moved DB models to shared directory.

## [1.0.0] - 2017-08-13

### Changed
- Rebuilt project to use two services: a collector and a mailer.

### Added
- Added Postgres for local article storage.

## [0.2.0] - 2017-05-06

### Added
- Feed names to emails.
- Better date formatting.

### Changed
- Codeship for CI.
- Production to use [Hyper.sh](https://hyper.sh/) for deployment.
- Moved emails to AWS S3.

## [0.1.0] - 2017-05-01

### Added
- Initial release
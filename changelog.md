# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Added
- Nothing yet.

## [1.0.0] - 2017-08-13

### Added
- Collector service separated from mailer service.
- Added Postgres for permanent data storage.

### Changed
- Rebuilt Mailer service to work with collector.

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
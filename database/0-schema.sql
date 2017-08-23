create table feeds
(
	id serial not null
		constraint feeds_id_pk
			primary key,
	title varchar,
	updated_at timestamp with time zone,
	feed_url text,
	url text,
	feedbin_id integer,
	tag_id integer
)
;

create table tags
(
	id serial not null
		constraint tags_pkey
			primary key,
	name varchar not null,
	updated_at timestamp,
	frequency varchar,
	image_url varchar,
	description text
)
;

alter table feeds
	add constraint feeds_tags_id_fk
		foreign key (tag_id) references tags
;

create table entries
(
	id serial not null
		constraint entries_pkey
			primary key,
	title varchar,
	author varchar,
	summary text,
	content text,
	url text,
	feedbin_published_at timestamp,
	feedbin_created_at timestamp,
	feedbin_feed_id integer,
	feedbin_id integer,
	updated_at timestamp,
	created_at timestamp
)
;

create unique index entries_feedbin_id_uindex
	on entries (feedbin_id)
;

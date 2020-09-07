create table visitors
(
    id        char(40)           not null,
    country   char(200)          not null,
    state     char(200)          not null,
    city      char(200)          not null,
    postal    char(20)           not null,
    longitude decimal(11, 8)     not null,
    latitude  decimal(10, 8)     not null,
    visits    smallint default 1 not null,
    constraint visitors_id_uindex
        unique (id)
);

alter table visitors
    add primary key (id);
